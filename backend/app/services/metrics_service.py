from app.repositories.metrics_repository import MetricsRepository


class MetricsService:

    @staticmethod
    def dashboard():
        """
        Get dashboard metrics.
        """

        metrics = MetricsRepository.get_dashboard_metrics()

        return {
            "success": True,
            "message": "Dashboard metrics fetched successfully.",
            "data": metrics
        }, 200

    @staticmethod
    def jobs():
        """
        Get job metrics.
        """

        metrics = MetricsRepository.get_job_metrics()

        return {
            "success": True,
            "message": "Job metrics fetched successfully.",
            "data": metrics
        }, 200

    @staticmethod
    def workers():
        """
        Get worker metrics.
        """

        metrics = MetricsRepository.get_worker_metrics()

        return {
            "success": True,
            "message": "Worker metrics fetched successfully.",
            "data": metrics
        }, 200

    @staticmethod
    def system():
        """
        Get system metrics.
        """

        metrics = MetricsRepository.get_system_metrics()

        return {
            "success": True,
            "message": "System metrics fetched successfully.",
            "data": metrics
        }, 200