from app.core.database import db
from app.models.retry_policy import RetryPolicy


class RetryPolicyRepository:

    @staticmethod
    def create(data):
        """
        Create a new retry policy.
        """

        retry_policy = RetryPolicy(**data)

        db.session.add(retry_policy)
        db.session.commit()

        return retry_policy

    @staticmethod
    def get_all():
        """
        Get all retry policies.
        """

        return RetryPolicy.query.order_by(
            RetryPolicy.created_at.desc()
        ).all()

    @staticmethod
    def get_by_id(policy_id):
        """
        Get retry policy by ID.
        """

        return RetryPolicy.query.filter_by(
            id=policy_id
        ).first()

    @staticmethod
    def update(retry_policy, data):
        """
        Update an existing retry policy.
        """

        for key, value in data.items():
            setattr(retry_policy, key, value)

        db.session.commit()

        return retry_policy

    @staticmethod
    def delete(retry_policy):
        """
        Delete a retry policy.
        """

        db.session.delete(retry_policy)
        db.session.commit()

    @staticmethod
    def get_by_project(project_id):
        """
        Get all retry policies for a project.
        """

        return RetryPolicy.query.filter_by(
            project_id=project_id
        ).order_by(
            RetryPolicy.created_at.desc()
        ).all()