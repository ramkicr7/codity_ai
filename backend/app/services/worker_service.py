from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from app.core.database import db
from app.repositories.worker_repository import WorkerRepository
from app.schemas.worker import WorkerSchema


class WorkerService:

    @staticmethod
    def get_all():
        """
        Get all workers.
        """

        workers = WorkerRepository.get_all()

        return {
            "success": True,
            "message": "Workers fetched successfully.",
            "data": WorkerSchema(many=True).dump(workers)
        }, 200

    @staticmethod
    def get_by_id(worker_id):
        """
        Get a single worker.
        """

        worker = WorkerRepository.get_by_id(worker_id)

        if not worker:
            return {
                "success": False,
                "message": "Worker not found."
            }, 404

        return {
            "success": True,
            "message": "Worker fetched successfully.",
            "data": WorkerSchema().dump(worker)
        }, 200

    @staticmethod
    def create(data):
        """
        Create a new worker.
        """

        try:

            validated_data = WorkerSchema().load(data)

            existing = WorkerRepository.get_by_hostname(
                validated_data["hostname"]
            )

            if existing:
                return {
                    "success": False,
                    "message": "Hostname already exists."
                }, 409

            worker = WorkerRepository.create(validated_data)

            return {
                "success": True,
                "message": "Worker created successfully.",
                "data": WorkerSchema().dump(worker)
            }, 201

        except ValidationError as err:

            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        except IntegrityError:

            db.session.rollback()

            return {
                "success": False,
                "message": "Database integrity error."
            }, 409

        except Exception as e:

            db.session.rollback()

            return {
                "success": False,
                "message": str(e)
            }, 500

    @staticmethod
    def update(worker_id, data):
        """
        Update worker.
        """

        worker = WorkerRepository.get_by_id(worker_id)

        if not worker:
            return {
                "success": False,
                "message": "Worker not found."
            }, 404

        try:

            validated_data = WorkerSchema(
                partial=True
            ).load(data)

            if "hostname" in validated_data:

                existing = WorkerRepository.get_by_hostname(
                    validated_data["hostname"]
                )

                if existing and existing.id != worker.id:

                    return {
                        "success": False,
                        "message": "Hostname already exists."
                    }, 409

            worker = WorkerRepository.update(
                worker,
                validated_data
            )

            return {
                "success": True,
                "message": "Worker updated successfully.",
                "data": WorkerSchema().dump(worker)
            }, 200

        except ValidationError as err:

            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        except IntegrityError:

            db.session.rollback()

            return {
                "success": False,
                "message": "Database integrity error."
            }, 409

        except Exception as e:

            db.session.rollback()

            return {
                "success": False,
                "message": str(e)
            }, 500

    @staticmethod
    def delete(worker_id):
        """
        Delete worker.
        """

        worker = WorkerRepository.get_by_id(worker_id)

        if not worker:

            return {
                "success": False,
                "message": "Worker not found."
            }, 404

        try:

            WorkerRepository.delete(worker)

            return {
                "success": True,
                "message": "Worker deleted successfully."
            }, 200

        except Exception as e:

            db.session.rollback()

            return {
                "success": False,
                "message": str(e)
            }, 500

    @staticmethod
    def heartbeat(worker_id):
        """
        Update worker heartbeat.
        """

        worker = WorkerRepository.get_by_id(worker_id)

        if not worker:

            return {
                "success": False,
                "message": "Worker not found."
            }, 404

        try:

            worker = WorkerRepository.heartbeat(worker)

            return {
                "success": True,
                "message": "Heartbeat received.",
                "data": WorkerSchema().dump(worker)
            }, 200

        except Exception as e:

            db.session.rollback()

            return {
                "success": False,
                "message": str(e)
            }, 500