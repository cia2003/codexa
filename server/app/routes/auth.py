import hashlib
import hmac
import os
import smtplib
import uuid
from email.message import EmailMessage
from urllib.parse import urlencode

from flask import Blueprint, current_app, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.extensions import db
from app.models.user import User


auth_bp = Blueprint("auth", __name__)

PASSWORD_RESET_SALT = "codexa-password-reset"


def _password_reset_serializer():
    return URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"],
        salt=PASSWORD_RESET_SALT,
    )


def _password_reset_state(password_hash):
    secret = current_app.config["SECRET_KEY"].encode("utf-8")
    return hmac.new(secret, password_hash.encode("utf-8"), hashlib.sha256).hexdigest()


def _send_password_reset_email(user, token):
    frontend_url = current_app.config["FRONTEND_URL"]
    reset_url = f"{frontend_url}/reset-password?{urlencode({'token': token})}"
    message = EmailMessage()
    message["Subject"] = "Reset your Codexa password"
    message["From"] = current_app.config["SMTP_FROM"]
    message["To"] = user.email
    message.set_content(
        "We received a request to reset your Codexa password.\n\n"
        f"Use this link within 30 minutes to choose a new password:\n{reset_url}\n\n"
        "If you did not request this change, you can ignore this email."
    )

    with smtplib.SMTP(
        current_app.config["SMTP_HOST"],
        current_app.config["SMTP_PORT"],
        timeout=15,
    ) as smtp:
        if current_app.config["SMTP_USE_TLS"]:
            smtp.starttls()
        username = current_app.config["SMTP_USERNAME"]
        password = current_app.config["SMTP_PASSWORD"]
        if username and password:
            smtp.login(username, password)
        smtp.send_message(message)


def _get_current_user():
    try:
        user_id = uuid.UUID(str(get_jwt_identity()))
    except (TypeError, ValueError, AttributeError):
        return None

    return db.session.get(User, user_id)


def _remove_user_uploads(user_id, storage_paths):
    upload_root = os.path.realpath(current_app.config["UPLOAD_FOLDER"])
    user_directory = os.path.realpath(os.path.join(upload_root, str(user_id)))

    for storage_path in storage_paths:
        file_path = os.path.realpath(
            storage_path
            if os.path.isabs(storage_path)
            else os.path.join(os.getcwd(), storage_path)
        )

        try:
            if os.path.commonpath((user_directory, file_path)) == user_directory:
                os.remove(file_path)
        except (OSError, ValueError):
            current_app.logger.warning(
                "Could not remove uploaded manuscript for deleted user %s.",
                user_id,
            )

    try:
        os.rmdir(user_directory)
    except OSError:
        pass


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    display_name = data.get("display_name", "").strip()

    # Validasi input
    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email dan password wajib diisi"
        }), 400

    if len(password) < 8:
        return jsonify({
            "status": "error",
            "message": "Password minimal 8 karakter"
        }), 400

    if len(email) > 255:
        return jsonify({
            "status": "error",
            "message": "Email terlalu panjang"
        }), 400

    # Periksa email yang sudah terdaftar
    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:
        return jsonify({
            "status": "error",
            "message": "Email sudah terdaftar"
        }), 409

    # Hash password sebelum disimpan
    password_hash = generate_password_hash(password)

    new_user = User(
        email=email,
        password_hash=password_hash,
        display_name=display_name or None
    )

    try:
        db.session.add(new_user)
        db.session.commit()

    except IntegrityError:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": "Email sudah digunakan"
        }), 409

    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({
        "status": "success",
        "message": "Registrasi berhasil",
        "access_token": access_token,
        "token_type": "Bearer",
        "user": {
            "id": str(new_user.id),
            "email": new_user.email,
            "display_name": new_user.display_name
        }
    }), 201


# ==========================================
# LOGIN
# POST /api/auth/login
# ==========================================

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Validasi input
    if not email or not password:
        return jsonify({
            "status": "error",
            "message": "Email dan password wajib diisi"
        }), 400

    # Cari pengguna berdasarkan email
    user = User.query.filter_by(
        email=email
    ).first()

    # Verifikasi password
    if not user or not check_password_hash(
        user.password_hash,
        password
    ):
        return jsonify({
            "status": "error",
            "message": "Email atau password salah"
        }), 401

    # Buat JWT access token
    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "status": "success",
        "message": "Login berhasil",
        "access_token": access_token,
        "token_type": "Bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "display_name": user.display_name
        }
    }), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True)
    email = data.get("email") if isinstance(data, dict) else None
    if not isinstance(email, str) or not email.strip():
        return jsonify({
            "status": "error",
            "message": "Email wajib diisi.",
        }), 400

    smtp_host = current_app.config["SMTP_HOST"]
    smtp_from = current_app.config["SMTP_FROM"]
    if not smtp_host or not smtp_from:
        current_app.logger.error("Password reset email is not configured.")
        return jsonify({
            "status": "error",
            "message": "Layanan reset password belum dikonfigurasi. Hubungi administrator.",
        }), 503

    user = User.query.filter_by(email=email.strip().lower()).first()
    if user:
        token = _password_reset_serializer().dumps({
            "user_id": str(user.id),
            "password_state": _password_reset_state(user.password_hash),
        })
        try:
            _send_password_reset_email(user, token)
        except (OSError, smtplib.SMTPException):
            current_app.logger.exception("Could not send password reset email.")

    # Keep the response identical for existing and unknown accounts.
    return jsonify({
        "status": "success",
        "message": "Jika email terdaftar, tautan untuk mengatur ulang password akan dikirim.",
    }), 202


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        data = {}

    token = data.get("token")
    new_password = data.get("new_password")
    if not isinstance(token, str) or not token:
        return jsonify({
            "status": "error",
            "message": "Tautan reset tidak valid atau sudah kedaluwarsa.",
        }), 400
    if not isinstance(new_password, str) or len(new_password) < 8:
        return jsonify({
            "status": "error",
            "message": "Password baru minimal 8 karakter.",
        }), 400

    try:
        payload = _password_reset_serializer().loads(
            token,
            max_age=current_app.config["PASSWORD_RESET_TOKEN_TTL"],
        )
        user_id = uuid.UUID(payload["user_id"])
        user = db.session.get(User, user_id)
        if not user or not hmac.compare_digest(
            payload.get("password_state", ""),
            _password_reset_state(user.password_hash),
        ):
            raise BadSignature("Reset token has already been used or is invalid.")
    except (BadSignature, SignatureExpired, KeyError, TypeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "Tautan reset tidak valid atau sudah kedaluwarsa.",
        }), 400

    user.password_hash = generate_password_hash(new_password)
    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Could not reset account password.")
        return jsonify({
            "status": "error",
            "message": "Password tidak dapat diperbarui saat ini.",
        }), 500

    return jsonify({
        "status": "success",
        "message": "Password berhasil diatur ulang. Silakan login.",
    }), 200


@auth_bp.route("/change-password", methods=["PATCH"])
@jwt_required()
def change_password():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        data = {}
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not isinstance(current_password, str) or not isinstance(new_password, str):
        return jsonify({
            "status": "error",
            "message": "Password saat ini dan password baru wajib diisi.",
        }), 400

    if len(new_password) < 8:
        return jsonify({
            "status": "error",
            "message": "Password baru minimal 8 karakter.",
        }), 400

    user = _get_current_user()
    if not user:
        return jsonify({
            "status": "error",
            "message": "Akun tidak ditemukan.",
        }), 404

    if not check_password_hash(user.password_hash, current_password):
        return jsonify({
            "status": "error",
            "message": "Password saat ini salah.",
        }), 400

    user.password_hash = generate_password_hash(new_password)

    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Could not change account password.")
        return jsonify({
            "status": "error",
            "message": "Password tidak dapat diperbarui saat ini.",
        }), 500

    return jsonify({
        "status": "success",
        "message": "Password berhasil diubah.",
    }), 200


@auth_bp.route("/account", methods=["DELETE"])
@jwt_required()
def delete_account():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        data = {}
    current_password = data.get("current_password")

    if not isinstance(current_password, str) or not current_password:
        return jsonify({
            "status": "error",
            "message": "Masukkan password untuk menghapus akun.",
        }), 400

    user = _get_current_user()
    if not user:
        return jsonify({
            "status": "error",
            "message": "Akun tidak ditemukan.",
        }), 404

    if not check_password_hash(user.password_hash, current_password):
        return jsonify({
            "status": "error",
            "message": "Password salah. Akun tidak dihapus.",
        }), 400

    user_id = user.id
    storage_paths = [manuscript.storage_path for manuscript in user.manuscripts]
    db.session.delete(user)

    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Could not delete account.")
        return jsonify({
            "status": "error",
            "message": "Akun tidak dapat dihapus saat ini.",
        }), 500

    _remove_user_uploads(user_id, storage_paths)

    return jsonify({
        "status": "success",
        "message": "Akun berhasil dihapus.",
    }), 200
