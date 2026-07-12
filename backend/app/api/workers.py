from flask import Blueprint, jsonify, request

from app.services.worker_service import WorkerService


worker_bp = Blueprint(
    "workers",
    __name__
)


@worker_bp.route("", methods=["GET"])
def get_workers():

    response, status = WorkerService.get_all()

    return jsonify(response), status


@worker_bp.route("/<uuid:worker_id>", methods=["GET"])
def get_worker(worker_id):

    response, status = WorkerService.get_by_id(worker_id)

    return jsonify(response), status


@worker_bp.route("", methods=["POST"])
def create_worker():

    data = request.get_json()

    response, status = WorkerService.create(data)

    return jsonify(response), status


@worker_bp.route("/<uuid:worker_id>", methods=["PUT"])
def update_worker(worker_id):

    data = request.get_json()

    response, status = WorkerService.update(worker_id, data)

    return jsonify(response), status


@worker_bp.route("/<uuid:worker_id>", methods=["DELETE"])
def delete_worker(worker_id):

    response, status = WorkerService.delete(worker_id)

    return jsonify(response), status


@worker_bp.route("/<uuid:worker_id>/heartbeat", methods=["POST"])
def heartbeat(worker_id):

    response, status = WorkerService.heartbeat(worker_id)

    return jsonify(response), status