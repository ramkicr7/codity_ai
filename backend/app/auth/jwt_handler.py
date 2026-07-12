from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    verify_jwt_in_request
)

from datetime import timedelta


class JWTHandler:
    """
    Handles JWT token generation and validation.
    """

    @staticmethod
    def generate_access_token(identity, role):
        return create_access_token(
            identity=str(identity),
            additional_claims={
                "role": role
            },
            expires_delta=timedelta(hours=1)
        )

    @staticmethod
    def generate_refresh_token(identity):

        return create_refresh_token(
            identity=str(identity)
        )

    @staticmethod
    def current_user():

        verify_jwt_in_request()

        return get_jwt_identity()