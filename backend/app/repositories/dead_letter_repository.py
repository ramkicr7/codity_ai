from app.core.database import db
from app.models.dead_letter import DeadLetter


class DeadLetterRepository:

    @staticmethod
    def create(data):
        """
        Create a dead letter record.
        """

        dead_letter = DeadLetter(**data)

        db.session.add(dead_letter)
        db.session.commit()

        return dead_letter

    @staticmethod
    def get_all():
        """
        Get all dead letter records.
        """

        return DeadLetter.query.order_by(
            DeadLetter.failed_at.desc()
        ).all()

    @staticmethod
    def get_by_id(dead_letter_id):
        """
        Get dead letter by ID.
        """

        return DeadLetter.query.filter_by(
            id=dead_letter_id
        ).first()

    @staticmethod
    def get_by_job(job_id):
        """
        Get dead letter by original job.
        """

        return DeadLetter.query.filter_by(
            job_id=job_id
        ).first()

    @staticmethod
    def delete(dead_letter):
        """
        Delete dead letter.
        """

        db.session.delete(dead_letter)
        db.session.commit()

    @staticmethod
    def restore(dead_letter):
        """
        Remove from dead letter queue.
        """

        db.session.delete(dead_letter)
        db.session.commit()