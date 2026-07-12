from sqlalchemy import select

from app.core.database import db
from app.models.job import Job


class JobRepository:

    @staticmethod
    def create(data):
        """
        Create a new job.
        """

        job = Job(**data)

        db.session.add(job)
        db.session.commit()

        return job

    @staticmethod
    def get_all():
        """
        Return all jobs ordered by newest first.
        """

        return Job.query.order_by(
            Job.created_at.desc()
        ).all()

    @staticmethod
    def get_by_id(job_id):
        """
        Find a job by its ID.
        """

        return Job.query.filter_by(
            id=job_id
        ).first()

    @staticmethod
    def update(job, data):
        """
        Update an existing job.
        """

        for key, value in data.items():
            setattr(job, key, value)

        db.session.commit()

        return job

    @staticmethod
    def delete(job):
        """
        Delete a job.
        """

        db.session.delete(job)
        db.session.commit()

    @staticmethod
    def retry(job):
        """
        Retry a failed job.
        """

        job.status = "PENDING"
        job.retry_count += 1
        job.error_message = None

        db.session.commit()

        return job

    @staticmethod
    def cancel(job):
        """
        Cancel a pending/running job.
        """

        job.status = "CANCELLED"

        db.session.commit()

        return job

    # ====================================================
    # Scheduler Methods
    # ====================================================

    @staticmethod
    def claim_next_job():
        """
        Atomically claim the next pending job.
        """

        with db.session.begin():

            job = (
                db.session.execute(
                    select(Job)
                    .where(Job.status == "PENDING")
                    .order_by(Job.created_at.asc())
                    .with_for_update(skip_locked=True)
                )
                .scalars()
                .first()
            )

            if not job:
                return None

            job.status = "CLAIMED"

        return job

    @staticmethod
    def mark_running(job):
        """
        Mark a job as RUNNING.
        """

        job.status = "RUNNING"

        db.session.commit()

        return job

    @staticmethod
    def mark_completed(job, result=None):
        """
        Mark a job as COMPLETED.
        """

        job.status = "COMPLETED"

        if result is not None:
            job.result = result

        db.session.commit()

        return job

    @staticmethod
    def mark_failed(job, error_message):
        """
        Mark a job as FAILED.
        """

        job.status = "FAILED"
        job.error_message = error_message

        db.session.commit()

        return job