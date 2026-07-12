from app.models.queue import Queue
from app.core.database import db


class QueueRepository:

    @staticmethod
    def create(data):

        queue = Queue(**data)

        db.session.add(queue)

        db.session.commit()

        return queue

    @staticmethod
    def get_all():

        return Queue.query.order_by(
            Queue.created_at.desc()
        ).all()

    @staticmethod
    def get_by_id(queue_id):

        return Queue.query.filter_by(
            id=queue_id
        ).first()

    @staticmethod
    def update(queue, data):

        for key, value in data.items():
            setattr(queue, key, value)

        db.session.commit()

        return queue

    @staticmethod
    def delete(queue):

        db.session.delete(queue)

        db.session.commit()

    @staticmethod
    def pause(queue):

        queue.is_paused = True

        db.session.commit()

        return queue

    @staticmethod
    def resume(queue):

        queue.is_paused = False

        db.session.commit()

        return queue