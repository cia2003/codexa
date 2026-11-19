import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import make_url
from sqlalchemy.exc import ArgumentError


SERVER_DIR = Path(__file__).resolve().parent

# DomCloud environment variables tetap menang atas isi .env.
load_dotenv(dotenv_path=SERVER_DIR / ".env", override=False)


class Config:
    # JWT_SECRET_KEY falls back to SECRET_KEY so local and deployed
    # environments only need one configured signing secret.
    SECRET_KEY = os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY") or SECRET_KEY

    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    SMTP_FROM = os.getenv("SMTP_FROM") or SMTP_USERNAME
    SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() in {
        "1", "true", "yes", "on"
    }
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
    PASSWORD_RESET_TOKEN_TTL = 1800

    # DATABASE_URL dari DomCloud menjadi sumber utama.
    # SQLALCHEMY_DATABASE_URI tetap didukung untuk environment lokal lama.
    SQLALCHEMY_DATABASE_URI = (
        os.getenv("DATABASE_URL")
        or os.getenv("SQLALCHEMY_DATABASE_URI")
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000",
        ).split(",")
        if origin.strip()
    ]

    MAX_CONTENT_LENGTH = 20 * 1024 * 1024

    UPLOAD_FOLDER = os.path.join(
        os.getcwd(),
        "storage",
        "uploads",
    )

    @classmethod
    def validate(cls):
        if not cls.JWT_SECRET_KEY:
            raise RuntimeError(
                "JWT_SECRET_KEY atau SECRET_KEY wajib diatur untuk menandatangani token."
            )

        database_uri = cls.SQLALCHEMY_DATABASE_URI

        if not database_uri:
            raise RuntimeError(
                "DATABASE_URL atau SQLALCHEMY_DATABASE_URI wajib diatur."
            )

        try:
            parsed_url = make_url(database_uri)
        except ArgumentError as error:
            raise RuntimeError("Format DATABASE_URL tidak valid.") from error

        if parsed_url.get_backend_name() != "postgresql":
            raise RuntimeError("DATABASE_URL harus menunjuk ke PostgreSQL.")

        if not parsed_url.database:
            raise RuntimeError("Nama database tidak ditemukan di DATABASE_URL.")
