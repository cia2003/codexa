import uuid
from datetime import datetime, timezone

from app.extensions import db


class Manuscript(db.Model):

    __tablename__ = "manuscripts"

    id = db.Column(
        db.Uuid,
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = db.Column(
        db.Uuid,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    original_filename = db.Column(
        db.String(255),
        nullable=False
    )

    storage_path = db.Column(
        db.String(500),
        nullable=False
    )

    mime_type = db.Column(
        db.String(50),
        nullable=False
    )

    file_size = db.Column(
        db.BigInteger,
        nullable=False
    )

    width = db.Column(db.Integer)
    height = db.Column(db.Integer)

    uploaded_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )