from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
)

bcrypt = Bcrypt()


class SecurityManager:

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a plain text password.
        """
        return bcrypt.generate_password_hash(password).decode("utf-8")

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """
        Verify user password.
        """
        return bcrypt.check_password_hash(
            hashed_password,
            password
        )

    @staticmethod
    def create_access(identity):

        return create_access_token(identity=identity)

    @staticmethod
    def create_refresh(identity):

        return create_refresh_token(identity=identity)