from flask import Blueprint, jsonify, request

from app.services.retry_policy_service import RetryPolicyService


retry_policy_bp = Blueprint(
    "retry_policies",
    __name__
)


@retry_policy_bp.route("/", methods=["GET"])
def get_retry_policies():
    """
    Get all retry policies.
    """

    response, status = RetryPolicyService.get_all()

    return jsonify(response), status


@retry_policy_bp.route("/<uuid:policy_id>", methods=["GET"])
def get_retry_policy(policy_id):
    """
    Get a retry policy by ID.
    """

    response, status = RetryPolicyService.get_by_id(policy_id)

    return jsonify(response), status


@retry_policy_bp.route("/", methods=["POST"])
def create_retry_policy():
    """
    Create a retry policy.
    """

    data = request.get_json()

    response, status = RetryPolicyService.create(data)

    return jsonify(response), status


@retry_policy_bp.route("/<uuid:policy_id>", methods=["PUT"])
def update_retry_policy(policy_id):
    """
    Update a retry policy.
    """

    data = request.get_json()

    response, status = RetryPolicyService.update(
        policy_id,
        data
    )

    return jsonify(response), status


@retry_policy_bp.route("/<uuid:policy_id>", methods=["DELETE"])
def delete_retry_policy(policy_id):
    """
    Delete a retry policy.
    """

    response, status = RetryPolicyService.delete(policy_id)

    return jsonify(response), status