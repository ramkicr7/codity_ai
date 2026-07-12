from flask import Blueprint, jsonify, request

from app.services.job_service import JobService


job_bp = Blueprint(
    "jobs",
    __name__
    
)


@job_bp.route("", methods=["GET"])
def get_jobs():

    response, status = JobService.get_all()

    return jsonify(response), status


@job_bp.route("/<uuid:job_id>", methods=["GET"])
def get_job(job_id):

    response, status = JobService.get_by_id(job_id)

    return jsonify(response), status


@job_bp.route("", methods=["POST"])
def create_job():

    data = request.get_json()

    response, status = JobService.create(data)

    return jsonify(response), status


@job_bp.route("/<uuid:job_id>", methods=["DELETE"])
def delete_job(job_id):

    response, status = JobService.delete(job_id)

    return jsonify(response), status


@job_bp.route("/<uuid:job_id>/retry", methods=["POST"])
def retry_job(job_id):

    response, status = JobService.retry(job_id)

    return jsonify(response), status


@job_bp.route("/<uuid:job_id>/cancel", methods=["POST"])
def cancel_job(job_id):

    response, status = JobService.cancel(job_id)

    return jsonify(response), status