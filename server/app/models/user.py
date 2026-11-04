import uuid
from datetime import datetime, timezone

from app.extensions import db


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(
        db.Uuid,
        primary_key=True,
        default=uuid.uuid4
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    display_name = db.Column(
        db.String(100)
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    manuscripts = db.relationship(
        "Manuscript",
        backref="user",
        cascade="all, delete-orphan"
    )

    transcriptions = db.relationship(
        "Transcription",
        backref="user",
        cascade="all, delete-orphan"
    )