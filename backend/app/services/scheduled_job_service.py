from marshmallow import ValidationError

from app.repositories.scheduled_job_repository import ScheduledJobRepository
from app.schemas.scheduled_job import ScheduledJobSchema


class ScheduledJobService:

    @staticmethod
    def get_all():
        """
        Get all scheduled jobs.
        """

        scheduled_jobs = ScheduledJobRepository.get_all()

        return {
            "success": True,
            "message": "Scheduled jobs fetched successfully.",
            "data": ScheduledJobSchema(many=True).dump(scheduled_jobs)
        }, 200

    @staticmethod
    def get_by_id(scheduled_job_id):
        """
        Get a scheduled job by ID.
        """

        scheduled_job = ScheduledJobRepository.get_by_id(scheduled_job_id)

        if not scheduled_job:
            return {
                "success": False,
                "message": "Scheduled job not found."
            }, 404

        return {
            "success": True,
            "message": "Scheduled job fetched successfully.",
            "data": ScheduledJobSchema().dump(scheduled_job)
        }, 200

    @staticmethod
    def create(data):
        """
        Create a scheduled job.
        """

        try:
            validated_data = ScheduledJobSchema().load(data)

        except ValidationError as err:
            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        scheduled_job = ScheduledJobRepository.create(validated_data)

        return {
            "success": True,
            "message": "Scheduled job created successfully.",
            "data": ScheduledJobSchema().dump(scheduled_job)
        }, 201

    @staticmethod
    def update(scheduled_job_id, data):
        """
        Update a scheduled job.
        """

        scheduled_job = ScheduledJobRepository.get_by_id(scheduled_job_id)

        if not scheduled_job:
            return {
                "success": False,
                "message": "Scheduled job not found."
            }, 404

        try:
            validated_data = ScheduledJobSchema(partial=True).load(data)

        except ValidationError as err:
            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        scheduled_job = ScheduledJobRepository.update(
            scheduled_job,
            validated_data
        )

        return {
            "success": True,
            "message": "Scheduled job updated successfully.",
            "data": ScheduledJobSchema().dump(scheduled_job)
        }, 200

    @staticmethod
    def delete(scheduled_job_id):
        """
        Delete a scheduled job.
        """

        scheduled_job = ScheduledJobRepository.get_by_id(scheduled_job_id)

        if not scheduled_job:
            return {
                "success": False,
                "message": "Scheduled job not found."
            }, 404

        ScheduledJobRepository.delete(scheduled_job)

        return {
            "success": True,
            "message": "Scheduled job deleted successfully."
        }, 200

    @staticmethod
    def get_ready_jobs():
        """
        Get all jobs ready for execution.
        """

        scheduled_jobs = ScheduledJobRepository.get_ready_jobs()

        return ScheduledJobSchema(
            many=True
        ).dump(scheduled_jobs)

    @staticmethod
    def mark_running(scheduled_job):

        return ScheduledJobRepository.mark_running(
            scheduled_job
        )

    @staticmethod
    def mark_completed(scheduled_job):

        return ScheduledJobRepository.mark_completed(
            scheduled_job
        )

    @staticmethod
    def cancel(scheduled_job_id):

        scheduled_job = ScheduledJobRepository.get_by_id(
            scheduled_job_id
        )

        if not scheduled_job:
            return {
                "success": False,
                "message": "Scheduled job not found."
            }, 404

        ScheduledJobRepository.cancel(scheduled_job)

        return {
            "success": True,
            "message": "Scheduled job cancelled successfully."
        }, 200