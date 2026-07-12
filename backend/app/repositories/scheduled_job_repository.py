from datetime import datetime

from app.core.database import db
from app.models.scheduled_job import ScheduledJob


class ScheduledJobRepository:

    @staticmethod
    def create(data):
        """
        Create a scheduled job.
        """

        scheduled_job = ScheduledJob(**data)

        db.session.add(scheduled_job)
        db.session.commit()

        return scheduled_job

    @staticmethod
    def get_all():
        """
        Get all scheduled jobs.
        """

        return ScheduledJob.query.order_by(
            ScheduledJob.created_at.desc()
        ).all()

    @staticmethod
    def get_by_id(scheduled_job_id):
        """
        Get scheduled job by ID.
        """

        return ScheduledJob.query.filter_by(
            id=scheduled_job_id
        ).first()

    @staticmethod
    def update(scheduled_job, data):
        """
        Update a scheduled job.
        """

        for key, value in data.items():
            setattr(scheduled_job, key, value)

        db.session.commit()

        return scheduled_job

    @staticmethod
    def delete(scheduled_job):
        """
        Delete a scheduled job.
        """

        db.session.delete(scheduled_job)
        db.session.commit()

    @staticmethod
    def get_ready_jobs():
        """
        Get all scheduled jobs that are ready to run.
        """

        return ScheduledJob.query.filter(
            ScheduledJob.status == "SCHEDULED",
            ScheduledJob.run_at <= datetime.utcnow()
        ).order_by(
            ScheduledJob.run_at.asc()
        ).all()

    @staticmethod
    def mark_running(scheduled_job):
        """
        Mark scheduled job as RUNNING.
        """

        scheduled_job.status = "RUNNING"

        db.session.commit()

        return scheduled_job

    @staticmethod
    def mark_completed(scheduled_job):
        """
        Mark scheduled job as COMPLETED.
        """

        scheduled_job.status = "COMPLETED"

        db.session.commit()

        return scheduled_job

    @staticmethod
    def cancel(scheduled_job):
        """
        Cancel a scheduled job.
        """

        scheduled_job.status = "CANCELLED"

        db.session.commit()

        return scheduled_job