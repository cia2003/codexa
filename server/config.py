import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import make_url
from sqlalchemy.exc import ArgumentError


SERVER_DIR = Path(__file__).resolve().parent

# DomCloud environment variables tetap menang atas isi .env.
load_dotenv(dotenv_path=SERVER_DIR / ".env", override=False)


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

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
            "http://localhost:3000,https://NAMA-APP.vercel.app",
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