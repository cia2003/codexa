from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.services.upload_service import upload_manuscript


manuscript_bp = Blueprint(
    "manuscript",
    __name__
)


@manuscript_bp.route(
    "/manuscripts/upload",
    methods=["POST"]
)
@jwt_required()
def upload():

    user_id = get_jwt_identity()

    file = request.files.get("file")

    try:

        manuscript = upload_manuscript(
            file,
            user_id
        )

        return jsonify({
            "message": "Upload berhasil",
            "manuscript_id": str(manuscript.id),
            "filename": manuscript.original_filename,
            "width": manuscript.width,
            "height": manuscript.height
        }), 201

    except ValueError as error:

        return jsonify({
            "error": str(error)
        }), 400