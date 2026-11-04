import uuid
import enum
from datetime import datetime, timezone

from app.extensions import db


class JobStatus(enum.Enum):
    processing = "processing"
    completed = "completed"
    failed = "failed"


class Transcription(db.Model):

    __tablename__ = "transcriptions"

    id = db.Column(
        db.Uuid,
        primary_key=True,
        default=uuid.uuid4
    )

    manuscript_id = db.Column(
        db.Uuid,
        db.ForeignKey(
            "manuscripts.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    user_id = db.Column(
        db.Uuid,
        db.ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    title = db.Column(db.String(150))

    status = db.Column(
        db.Enum(JobStatus, name="job_status"),
        default=JobStatus.processing,
        nullable=False
    )

    processing_time_ms = db.Column(db.Integer)

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    manuscript = db.relationship(
        "Manuscript",
        backref="transcriptions"
    )