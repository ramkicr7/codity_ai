from marshmallow import ValidationError

from app.repositories.dead_letter_repository import DeadLetterRepository
from app.repositories.job_repository import JobRepository

from app.schemas.dead_letter import DeadLetterSchema


class DeadLetterService:

    @staticmethod
    def get_all():
        """
        Get all dead letter jobs.
        """

        dead_letters = DeadLetterRepository.get_all()

        return {
            "success": True,
            "message": "Dead letter jobs fetched successfully.",
            "data": DeadLetterSchema(
                many=True
            ).dump(dead_letters)
        }, 200

    @staticmethod
    def get_by_id(dead_letter_id):
       """
Get dead letter job by ID.
"""