from datetime import datetime

from app.core.database import db
from app.models.job_execution import JobExecution


class JobExecutionRepository:

    @staticmethod
    def create(data):

        execution = JobExecution(**data)

        db.session.add(execution)
        db.session.commit()

        return execution

    @staticmethod
    def get_all():

        return JobExecution.query.order_by(
            JobExecution.created_at.desc()
        ).all()

    @staticmethod
    def get_by_id(execution_id):

        return JobExecution.query.filter_by(
            id=execution_id
        ).first()

    @staticmethod
    def get_by_job(job_id):

        return JobExecution.query.filter_by(
            job_id=job_id
        ).order_by(
            JobExecution.started_at.desc()
        ).all()

    @staticmethod
    def mark_completed(execution, result=None):

        execution.status = "COMPLETED"
        execution.completed_at = datetime.utcnow()

        if execution.started_at:
            execution.duration = (
                execution.completed_at -
                execution.started_at
            ).total_seconds()

        execution.result = result

        db.session.commit()

        return execution

    @staticmethod
    def mark_failed(execution, error_message):

        execution.status = "FAILED"
        execution.completed_at = datetime.utcnow()

        if execution.started_at:
            execution.duration = (
                execution.completed_at -
                execution.started_at
            ).total_seconds()

        execution.error_message = error_message

        db.session.commit()

        return execution