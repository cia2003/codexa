import uuid
from datetime import datetime, timezone

from sqlalchemy.dialects.postgresql import JSONB

from app.extensions import db


class TextLine(db.Model):

    __tablename__ = "text_lines"

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

    line_order = db.Column(
        db.Integer,
        nullable=False
    )

    polygon = db.Column(JSONB)

    original_text = db.Column(
        db.Text,
        nullable=False
    )

    corrected_text = db.Column(db.Text)

    confidence = db.Column(db.Float)

    is_edited = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        db.UniqueConstraint(
            "transcription_id",
            "line_order",
            name="uq_transcription_line_order"
        ),
    )