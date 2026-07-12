from datetime import datetime

from app.core.database import db
from app.models.worker import Worker


class WorkerRepository:
    """
    Worker Repository
    """

    @staticmethod
    def create(data):
        """
        Create a new worker.
        """

        try:

            worker = Worker(**data)

            db.session.add(worker)
            db.session.commit()

            return worker

        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def get_all():
        """
        Get all workers.
        """

        return (
            Worker.query
            .order_by(Worker.created_at.desc())
            .all()
        )

    @staticmethod
    def get_by_id(worker_id):
        """
        Get worker by ID.
        """

        return Worker.query.filter_by(
            id=worker_id
        ).first()

    @staticmethod
    def get_by_hostname(hostname):
        """
        Get worker by hostname.
        """

        return Worker.query.filter_by(
            hostname=hostname
        ).first()

    @staticmethod
    def update(worker, data):
        """
        Update worker details.
        """

        try:

            for key, value in data.items():
                setattr(worker, key, value)

            db.session.commit()

            db.session.refresh(worker)

            return worker

        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def delete(worker):
        """
        Delete worker.
        """

        try:

            db.session.delete(worker)
            db.session.commit()

        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def heartbeat(worker):
        """
        Update worker heartbeat.
        """

        try:

            worker.last_heartbeat = datetime.utcnow()
            worker.status = "ONLINE"

            db.session.commit()

            db.session.refresh(worker)

            return worker

        except Exception:
            db.session.rollback()
            raise