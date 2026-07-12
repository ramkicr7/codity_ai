from marshmallow import ValidationError

from app.repositories.queue_repository import QueueRepository
from app.schemas.queue_schema import QueueSchema


schema = QueueSchema()
schemas = QueueSchema(many=True)


class QueueService:

    @staticmethod
    def get_all():

        queues = QueueRepository.get_all()

        return {
            "success": True,
            "message": "Queues fetched successfully.",
            "data": schemas.dump(queues)
        }, 200

    @staticmethod
    def get_by_id(queue_id):

        queue = QueueRepository.get_by_id(queue_id)

        if not queue:
            return {
                "success": False,
                "message": "Queue not found."
            }, 404

        return {
            "success": True,
            "message": "Queue fetched successfully.",
            "data": schema.dump(queue)
        }, 200

    @staticmethod
    def create(data):

        try:
            validated_data = schema.load(data)

        except ValidationError as err:

            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        queue = QueueRepository.create(validated_data)

        return {
            "success": True,
            "message": "Queue created successfully.",
            "data": schema.dump(queue)
        }, 201

    @staticmethod
    def update(queue_id, data):

        queue = QueueRepository.get_by_id(queue_id)

        if not queue:

            return {
                "success": False,
                "message": "Queue not found."
            }, 404

        try:
            validated_data = QueueSchema(partial=True).load(data)

        except ValidationError as err:

            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        queue = QueueRepository.update(queue, validated_data)

        return {
            "success": True,
            "message": "Queue updated successfully.",
            "data": schema.dump(queue)
        }, 200

    @staticmethod
    def delete(queue_id):

        queue = QueueRepository.get_by_id(queue_id)

        if not queue:

            return {
                "success": False,
                "message": "Queue not found."
            }, 404

        QueueRepository.delete(queue)

        return {
            "success": True,
            "message": "Queue deleted successfully."
        }, 200

    @staticmethod
    def pause(queue_id):

        queue = QueueRepository.get_by_id(queue_id)

        if not queue:

            return {
                "success": False,
                "message": "Queue not found."
            }, 404

        queue = QueueRepository.pause(queue)

        return {
            "success": True,
            "message": "Queue paused successfully.",
            "data": schema.dump(queue)
        }, 200

    @staticmethod
    def resume(queue_id):

        queue = QueueRepository.get_by_id(queue_id)

        if not queue:

            return {
                "success": False,
                "message": "Queue not found."
            }, 404

        queue = QueueRepository.resume(queue)

        return {
            "success": True,
            "message": "Queue resumed successfully.",
            "data": schema.dump(queue)
        }, 200