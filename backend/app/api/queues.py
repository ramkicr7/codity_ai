from flask import Blueprint, jsonify, request

from app.services.queue_service import QueueService

queue_bp = Blueprint(
    "queues",
    __name__
)


# ==========================
# GET ALL QUEUES
# ==========================

@queue_bp.route("", methods=["GET"])
def get_queues():

    response, status = QueueService.get_all()

    return jsonify(response), status


# ==========================
# GET SINGLE QUEUE
# ==========================

@queue_bp.route("/<uuid:queue_id>", methods=["GET"])
def get_queue(queue_id):

    response, status = QueueService.get_by_id(queue_id)

    return jsonify(response), status


# ==========================
# CREATE QUEUE
# ==========================

@queue_bp.route("", methods=["POST"])
def create_queue():

    data = request.get_json()

    response, status = QueueService.create(data)

    return jsonify(response), status


# ==========================
# UPDATE QUEUE
# ==========================

@queue_bp.route("/<uuid:queue_id>", methods=["PUT"])
def update_queue(queue_id):

    data = request.get_json()

    response, status = QueueService.update(queue_id, data)

    return jsonify(response), status


# ==========================
# DELETE QUEUE
# ==========================

@queue_bp.route("/<uuid:queue_id>", methods=["DELETE"])
def delete_queue(queue_id):

    response, status = QueueService.delete(queue_id)

    return jsonify(response), status


# ==========================
# PAUSE QUEUE
# ==========================

@queue_bp.route("/<uuid:queue_id>/pause", methods=["PUT"])
def pause_queue(queue_id):

    response, status = QueueService.pause(queue_id)

    return jsonify(response), status


# ==========================
# RESUME QUEUE
# ==========================

@queue_bp.route("/<uuid:queue_id>/resume", methods=["PUT"])
def resume_queue(queue_id):

    response, status = QueueService.resume(queue_id)

    return jsonify(response), status