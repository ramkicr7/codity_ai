from marshmallow import ValidationError
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
)

from werkzeug.security import (
    generate_password_hash,
    check_password_hash,
)

from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterSchema, LoginSchema


class AuthService:

    @staticmethod
    def register(data):
        """
        Register a new user.
        """

        try:
            validated_data = RegisterSchema().load(data)

        except ValidationError as err:
            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        username = validated_data["username"]
        email = validated_data["email"]
        password = validated_data["password"]
        confirm_password = validated_data["confirm_password"]

        if password != confirm_password:
            return {
                "success": False,
                "message": "Passwords do not match."
            }, 400

        if UserRepository.email_exists(email):
            return {
                "success": False,
                "message": "Email already registered."
            }, 409

        if UserRepository.username_exists(username):
            return {
                "success": False,
                "message": "Username already taken."
            }, 409

        password_hash = generate_password_hash(password)

        user = UserRepository.create_user(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
            password_hash=password_hash
        )

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return {
            "success": True,
            "message": "User registered successfully.",
            "data": {
                "user": user.to_dict(),
                "tokens": {
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }
            }
        }, 201

    @staticmethod
    def login(data):
        """
        Login an existing user.
        """

        print("=" * 60)
        print("LOGIN REQUEST DATA:")
        print(data)
        print("=" * 60)

        try:
            validated_data = LoginSchema().load(data)

        except ValidationError as err:
            print("LOGIN VALIDATION ERROR:")
            print(err.messages)

            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        print("VALIDATED DATA:")
        print(validated_data)

        email = validated_data["email"].strip().lower()
        password = validated_data["password"]

        user = UserRepository.get_by_email(email)

        if not user:
            print("USER NOT FOUND")

            return {
                "success": False,
                "message": "Invalid email or password."
            }, 401

        if not check_password_hash(user.password_hash, password):
            print("PASSWORD DOES NOT MATCH")

            return {
                "success": False,
                "message": "Invalid email or password."
            }, 401

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        print("LOGIN SUCCESSFUL")

        return {
            "success": True,
            "message": "Login successful.",
            "data": {
                "user": user.to_dict(),
                "tokens": {
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }
            }
        }, 200

    @staticmethod
    def me():
        """
        Return currently authenticated user.
        """

        user_id = get_jwt_identity()

        user = UserRepository.get_by_id(user_id)

        if not user:
            return {
                "success": False,
                "message": "User not found."
            }, 404

        return {
            "success": True,
            "message": "User fetched successfully.",
            "data": {
                "user": user.to_dict()
            }
        }, 200

    @staticmethod
    def refresh():
        """
        Refresh access token.
        """

        user_id = get_jwt_identity()

        access_token = create_access_token(identity=user_id)

        return {
            "success": True,
            "message": "Token refreshed successfully.",
            "data": {
                "access_token": access_token
            }
        }, 200

    @staticmethod
    def logout():
        """
        Logout endpoint.

        Since you're using JWTs without a token blacklist,
        logout simply tells the frontend to remove the tokens.
        """

        return {
            "success": True,
            "message": "Logged out successfully."
        }, 200