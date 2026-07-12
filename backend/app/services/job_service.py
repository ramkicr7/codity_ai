from marshmallow import ValidationError

from app.repositories.job_repository import JobRepository
from app.schemas.job import JobSchema


class JobService:

    @staticmethod
    def get_all():
        """
        Get all jobs.
        """

        jobs = JobRepository.get_all()

        return {
            "success": True,
            "message": "Jobs fetched successfully.",
            "data": JobSchema(many=True).dump(jobs)
        }, 200

    @staticmethod
    def get_by_id(job_id):
        """
        Get a single job.
        """

        job = JobRepository.get_by_id(job_id)

        if not job:
            return {
                "success": False,
                "message": "Job not found."
            }, 404

        return {
            "success": True,
            "message": "Job fetched successfully.",
            "data": JobSchema().dump(job)
        }, 200

    @staticmethod
    def create(data):
        """
        Create a new job.
        """

        try:
            validated_data = JobSchema().load(data)
        except ValidationError as err:
            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        job = JobRepository.create(validated_data)

        return {
            "success": True,
            "message": "Job created successfully.",
            "data": JobSchema().dump(job)
        }, 201

    @staticmethod
    def delete(job_id):
        """
        Delete a job.
        """

        job = JobRepository.get_by_id(job_id)

        if not job:
            return {
                "success": False,
                "message": "Job not found."
            }, 404

        JobRepository.delete(job)

        return {
            "success": True,
            "message": "Job deleted successfully."
        }, 200

    @staticmethod
    def retry(job_id):
        """
        Retry a failed job.
        """

        job = JobRepository.get_by_id(job_id)

        if not job:
            return {
                "success": False,
                "message": "Job not found."
            }, 404

        if job.status != "FAILED":
            return {
                "success": False,
                "message": "Only failed jobs can be retried."
            }, 400

        job = JobRepository.retry(job)

        return {
            "success": True,
            "message": "Job retried successfully.",
            "data": JobSchema().dump(job)
        }, 200

    @staticmethod
    def cancel(job_id):
        """
        Cancel a job.
        """

        job = JobRepository.get_by_id(job_id)

        if not job:
            return {
                "success": False,
                "message": "Job not found."
            }, 404

        if job.status in ["COMPLETED", "FAILED", "CANCELLED"]:
            return {
                "success": False,
                "message": f"Cannot cancel a {job.status.lower()} job."
            }, 400

        job = JobRepository.cancel(job)

        return {
            "success": True,
            "message": "Job cancelled successfully.",
            "data": JobSchema().dump(job)
        }, 200