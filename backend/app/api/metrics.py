from flask import Blueprint, jsonify

from app.services.metrics_service import MetricsService


metrics_bp = Blueprint(
    "metrics",
    __name__
)


@metrics_bp.route("/dashboard", methods=["GET"])
def dashboard():

    response, status = MetricsService.dashboard()

    return jsonify(response), status


@metrics_bp.route("/jobs", methods=["GET"])
def jobs():

    response, status = MetricsService.jobs()

    return jsonify(response), status


@metrics_bp.route("/workers", methods=["GET"])
def workers():

    response, status = MetricsService.workers()

    return jsonify(response), status


@metrics_bp.route("/system", methods=["GET"])
def system():

    response, status = MetricsService.system()

    return jsonify(response), status