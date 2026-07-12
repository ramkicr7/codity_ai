from flask import Blueprint, jsonify, request

from app.services.scheduled_job_service import ScheduledJobService


scheduled_job_bp = Blueprint(
    "scheduled_jobs",
    __name__
)


@scheduled_job_bp.route("/", methods=["GET"])
def get_scheduled_jobs():

    response, status = ScheduledJobService.get_all()

    return jsonify(response), status


@scheduled_job_bp.route("/<uuid:scheduled_job_id>", methods=["GET"])
def get_scheduled_job(scheduled_job_id):

    response, status = ScheduledJobService.get_by_id(
        scheduled_job_id
    )

    return jsonify(response), status


@scheduled_job_bp.route("/", methods=["POST"])
def create_scheduled_job():

    data = request.get_json()

    response, status = ScheduledJobService.create(data)

    return jsonify(response), status


@scheduled_job_bp.route("/<uuid:scheduled_job_id>", methods=["PUT"])
def update_scheduled_job(scheduled_job_id):

    data = request.get_json()

    response, status = ScheduledJobService.update(
        scheduled_job_id,
        data
    )

    return jsonify(response), status


@scheduled_job_bp.route("/<uuid:scheduled_job_id>", methods=["DELETE"])
def delete_scheduled_job(scheduled_job_id):

    response, status = ScheduledJobService.delete(
        scheduled_job_id
    )

    return jsonify(response), status


@scheduled_job_bp.route("/<uuid:scheduled_job_id>/cancel", methods=["POST"])
def cancel_scheduled_job(scheduled_job_id):

    response, status = ScheduledJobService.cancel(
        scheduled_job_id
    )

    return jsonify(response), status