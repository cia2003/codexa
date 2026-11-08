import os
from dotenv import load_dotenv

load_dotenv()

class Config:

    SECRET_KEY = os.getenv("SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "SQLALCHEMY_DATABASE_URI"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
        if origin.strip()
    ]

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    MAX_CONTENT_LENGTH = 20 * 1024 * 1024

    UPLOAD_FOLDER = os.path.join(
        os.getcwd(),
        "storage",
        "uploads"
    )