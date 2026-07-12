from app.models.project import Project
from app.models.queue import Queue
from app.models.job import Job


class MetricsRepository:

    @staticmethod
    def get_dashboard_metrics():
        """
        Fetch overall dashboard metrics.
        """

        return {
            "projects": Project.query.count(),
            "queues": Queue.query.count(),
            "jobs": Job.query.count(),
            "running_jobs": Job.query.filter_by(status="RUNNING").count(),
            "pending_jobs": Job.query.filter_by(status="PENDING").count(),
            "completed_jobs": Job.query.filter_by(status="COMPLETED").count(),
            "failed_jobs": Job.query.filter_by(status="FAILED").count(),
        }

    @staticmethod
    def get_job_metrics():
        """
        Fetch job statistics.
        """

        return {
            "pending": Job.query.filter_by(status="PENDING").count(),
            "running": Job.query.filter_by(status="RUNNING").count(),
            "completed": Job.query.filter_by(status="COMPLETED").count(),
            "failed": Job.query.filter_by(status="FAILED").count(),
            "cancelled": Job.query.filter_by(status="CANCELLED").count(),
        }

    @staticmethod
    def get_worker_metrics():
        """
        Placeholder worker metrics.
        Replace with actual worker data later.
        """

        return {
            "online": 0,
            "offline": 0,
            "busy": 0,
            "idle": 0,
        }

    @staticmethod
    def get_system_metrics():
        """
        Placeholder system metrics.
        Replace with psutil or monitoring service later.
        """

        return {
            "cpu": 0,
            "memory": 0,
            "disk": 0,
            "uptime": "Unknown",
        }