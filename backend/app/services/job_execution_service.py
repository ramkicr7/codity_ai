from marshmallow import ValidationError

from app.repositories.job_execution_repository import JobExecutionRepository
from app.schemas.job_execution import JobExecutionSchema


class JobExecutionService:

    @staticmethod
    def get_all():

        executions = JobExecutionRepository.get_all()

        return {
            "success": True,
            "message": "Job executions fetched successfully.",
            "data": JobExecutionSchema(many=True).dump(executions)
        }, 200

    @staticmethod
    def get_by_id(execution_id):

        execution = JobExecutionRepository.get_by_id(execution_id)

        if not execution:
            return {
                "success": False,
                "message": "Job execution not found."
            }, 404

        return {
            "success": True,
            "message": "Job execution fetched successfully.",
            "data": JobExecutionSchema().dump(execution)
        }, 200

    @staticmethod
    def get_by_job(job_id):

        executions = JobExecutionRepository.get_by_job(job_id)

        return {
            "success": True,
            "message": "Job execution history fetched successfully.",
            "data": JobExecutionSchema(many=True).dump(executions)
        }, 200

    @staticmethod
    def create(data):

        try:
            validated = JobExecutionSchema().load(data)

        except ValidationError as err:
            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        execution = JobExecutionRepository.create(validated)

        return {
            "success": True,
            "message": "Execution created successfully.",
            "data": JobExecutionSchema().dump(execution)
        }, 201