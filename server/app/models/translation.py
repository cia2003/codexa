import uuid
from datetime import datetime, timezone

from app.extensions import db


class Translation(db.Model):

    __tablename__ = "translations"

    id = db.Column(
        db.Uuid,
        primary_key=True,
        default=uuid.uuid4
    )

    transcription_id = db.Column(
        db.Uuid,
        db.ForeignKey(
            "transcriptions.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    target_language = db.Column(
        db.String(10),
        default="en",
        nullable=False
    )

    translated_text = db.Column(
        db.Text,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        db.UniqueConstraint(
            "transcription_id",
            "target_language"
        ),
    )