from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.user import User


auth_bp = Blueprint("auth", __name__)

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

    return jsonify({
        "status": "success",
        "message": "Registrasi berhasil",
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