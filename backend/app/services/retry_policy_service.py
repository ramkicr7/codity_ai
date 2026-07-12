from marshmallow import ValidationError

from app.repositories.retry_policy_repository import RetryPolicyRepository
from app.schemas.retry_policy import RetryPolicySchema


class RetryPolicyService:

    @staticmethod
    def get_all():
        """
        Get all retry policies.
        """

        policies = RetryPolicyRepository.get_all()

        return {
            "success": True,
            "message": "Retry policies fetched successfully.",
            "data": RetryPolicySchema(many=True).dump(policies)
        }, 200

    @staticmethod
    def get_by_id(policy_id):
        """
        Get a retry policy by ID.
        """

        policy = RetryPolicyRepository.get_by_id(policy_id)

        if not policy:
            return {
                "success": False,
                "message": "Retry policy not found."
            }, 404

        return {
            "success": True,
            "message": "Retry policy fetched successfully.",
            "data": RetryPolicySchema().dump(policy)
        }, 200

    @staticmethod
    def create(data):
        """
        Create a retry policy.
        """

        try:
            validated_data = RetryPolicySchema().load(data)

        except ValidationError as err:
            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        policy = RetryPolicyRepository.create(validated_data)

        return {
            "success": True,
            "message": "Retry policy created successfully.",
            "data": RetryPolicySchema().dump(policy)
        }, 201

    @staticmethod
    def update(policy_id, data):
        """
        Update a retry policy.
        """

        policy = RetryPolicyRepository.get_by_id(policy_id)

        if not policy:
            return {
                "success": False,
                "message": "Retry policy not found."
            }, 404

        try:
            validated_data = RetryPolicySchema(partial=True).load(data)

        except ValidationError as err:
            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        policy = RetryPolicyRepository.update(policy, validated_data)

        return {
            "success": True,
            "message": "Retry policy updated successfully.",
            "data": RetryPolicySchema().dump(policy)
        }, 200

    @staticmethod
    def delete(policy_id):
        """
        Delete a retry policy.
        """

        policy = RetryPolicyRepository.get_by_id(policy_id)

        if not policy:
            return {
                "success": False,
                "message": "Retry policy not found."
            }, 404

        RetryPolicyRepository.delete(policy)

        return {
            "success": True,
            "message": "Retry policy deleted successfully."
        }, 200

    @staticmethod
    def calculate_next_retry(policy, retry_count):
        """
        Calculate the delay before the next retry.
        """

        strategy = policy.strategy.upper()

        if strategy == "FIXED":
            delay = policy.initial_delay

        elif strategy == "LINEAR":
            delay = policy.initial_delay * retry_count

        elif strategy == "EXPONENTIAL":
            delay = policy.initial_delay * (
                policy.backoff_multiplier ** (retry_count - 1)
            )

        else:
            delay = policy.initial_delay

        if delay > policy.max_delay:
            delay = policy.max_delay

        return delay