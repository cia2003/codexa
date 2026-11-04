import time

from app.extensions import db

from app.models.transcription import (
    Transcription,
    JobStatus
)

from app.models.text_line import TextLine


def process_transcription(
    manuscript,
    user_id,
    htr_service
):

    start_time = time.perf_counter()

    transcription = Transcription(
        manuscript_id=manuscript.id,
        user_id=user_id,
        status=JobStatus.processing
    )

    db.session.add(transcription)
    db.session.commit()

    try:

        results = htr_service.predict(
            manuscript.storage_path
        )

        for result in results:

            line = TextLine(
                transcription_id=transcription.id,
                line_order=result["line_order"],
                polygon=result["polygon"],
                original_text=result["original_text"],
                confidence=result["confidence"]
            )

            db.session.add(line)

        elapsed = (
            time.perf_counter() - start_time
        ) * 1000

        transcription.processing_time_ms = int(
            elapsed
        )

        transcription.status = JobStatus.completed

        db.session.commit()

        return transcription

    except Exception:

        db.session.rollback()

        transcription.status = JobStatus.failed

        db.session.commit()

        raise