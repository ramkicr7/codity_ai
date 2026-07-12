from flask import Blueprint, jsonify, request

from app.services.auth_service import AuthService
from flask_jwt_extended import jwt_required

auth_bp = Blueprint(
    "auth",
    __name__
)


@auth_bp.get("/")
def auth_home():
    """
    Health check endpoint.
    """

    return jsonify({
        "success": True,
        "message": "Authentication API is running."
    }), 200


@auth_bp.post("/register")
def register():
    """
    Register a new user.
    """

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    response, status = AuthService.register(data)

    return jsonify(response), status


@auth_bp.post("/login")
def login():
    """
    Login user.
    """

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    response, status = AuthService.login(data)

    return jsonify(response), status


@auth_bp.post("/refresh")
def refresh():
    """
    Refresh access token.
    """

    response, status = AuthService.refresh()

    return jsonify(response), status


@auth_bp.post("/logout")
def logout():
    """
    Logout current user.
    """

    response, status = AuthService.logout()

    return jsonify(response), status


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    response, status = AuthService.me()
    return jsonify(response), status