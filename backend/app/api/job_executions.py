from flask import Blueprint, jsonify, request

from app.services.job_execution_service import JobExecutionService


job_execution_bp = Blueprint(
    "job_executions",
    __name__
)


@job_execution_bp.route("/", methods=["GET"])
def get_executions():

    response, status = JobExecutionService.get_all()

    return jsonify(response), status


@job_execution_bp.route("/<uuid:execution_id>", methods=["GET"])
def get_execution(execution_id):

    response, status = JobExecutionService.get_by_id(execution_id)

    return jsonify(response), status


@job_execution_bp.route("/job/<uuid:job_id>", methods=["GET"])
def get_job_history(job_id):

    response, status = JobExecutionService.get_by_job(job_id)

    return jsonify(response), status


@job_execution_bp.route("/", methods=["POST"])
def create_execution():

    data = request.get_json()

    response, status = JobExecutionService.create(data)

    return jsonify(response), status