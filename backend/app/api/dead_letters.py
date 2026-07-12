from flask import Blueprint, jsonify, request

from app.services.dead_letter_service import DeadLetterService


dead_letter_bp = Blueprint(
    "dead_letters",
    __name__
)


@dead_letter_bp.route("/", methods=["GET"])
def get_dead_letters():

    response, status = DeadLetterService.get_all()

    return jsonify(response), status


@dead_letter_bp.route("/<uuid:dead_letter_id>", methods=["GET"])
def get_dead_letter(dead_letter_id):

    response, status = DeadLetterService.get_by_id(
        dead_letter_id
    )

    return jsonify(response), status


@dead_letter_bp.route("/", methods=["POST"])
def create_dead_letter():

    data = request.get_json()

    response, status = DeadLetterService.create(
        data
    )

    return jsonify(response), status


@dead_letter_bp.route("/<uuid:dead_letter_id>/retry", methods=["POST"])
def retry_dead_letter(dead_letter_id):

    response, status = DeadLetterService.retry(
        dead_letter_id
    )

    return jsonify(response), status


@dead_letter_bp.route("/<uuid:dead_letter_id>", methods=["DELETE"])
def delete_dead_letter(dead_letter_id):

    response, status = DeadLetterService.delete(
        dead_letter_id
    )

    return jsonify(response), status