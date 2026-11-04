from PIL import Image

from kraken.tasks import (
    SegmentationTaskModel,
    RecognitionTaskModel
)

from kraken.configs import (
    SegmentationInferenceConfig,
    RecognitionInferenceConfig
)


class HTRService:

    def __init__(
        self,
        segmentation_model_path,
        recognition_model_path
    ):

        self.segmentation_model = (
            SegmentationTaskModel.load_model(
                segmentation_model_path
            )
        )

        self.recognition_model = (
            RecognitionTaskModel.load_model(
                recognition_model_path
            )
        )

        self.segmentation_config = (
            SegmentationInferenceConfig()
        )

        self.recognition_config = (
            RecognitionInferenceConfig()
        )

    def predict(self, image_path):

        image = Image.open(image_path).convert("RGB")

        # STEP 1: Baseline segmentation
        segmentation = self.segmentation_model.predict(
            image,
            self.segmentation_config
        )

        # STEP 2: Text recognition
        records = self.recognition_model.predict(
            image,
            segmentation,
            self.recognition_config
        )

        results = []

        for index, record in enumerate(records):

            line = segmentation.lines[index]

            results.append({
                "line_order": index + 1,
                "polygon": getattr(
                    line,
                    "boundary",
                    None
                ),
                "baseline": getattr(
                    line,
                    "baseline",
                    None
                ),
                "original_text": record.prediction,
                "confidence": getattr(
                    record,
                    "confidence",
                    None
                )
            })

        return results