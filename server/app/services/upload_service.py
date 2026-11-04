import os
import uuid

from PIL import Image
from werkzeug.utils import secure_filename

from flask import current_app

from app.extensions import db
from app.models.manuscript import Manuscript


ALLOWED_EXTENSIONS = {
    "png", "jpg", "jpeg", "tif", "tiff"
}


def upload_manuscript(file, user_id):

    if not file:
        raise ValueError("File tidak ditemukan")

    original_filename = secure_filename(
        file.filename
    )

    extension = original_filename.rsplit(
        ".", 1
    )[-1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError("Format file tidak didukung")

    # Membaca gambar untuk memvalidasi format dan dimensi
    image = Image.open(file.stream)
    image.verify()

    file.stream.seek(0)

    image = Image.open(file.stream)

    width, height = image.size
    mime_type = Image.MIME.get(
        image.format,
        "application/octet-stream"
    )

    file_id = str(uuid.uuid4())

    filename = f"{file_id}.{extension}"

    user_folder = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        str(user_id)
    )

    os.makedirs(user_folder, exist_ok=True)

    full_path = os.path.join(
        user_folder,
        filename
    )

    file.save(full_path)

    manuscript = Manuscript(
        user_id=user_id,
        original_filename=original_filename,
        storage_path=os.path.relpath(
            full_path,
            os.getcwd()
        ),
        mime_type=mime_type,
        file_size=os.path.getsize(full_path),
        width=width,
        height=height
    )

    db.session.add(manuscript)
    db.session.commit()

    return manuscript