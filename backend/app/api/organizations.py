from flask import Blueprint, jsonify

organization_bp = Blueprint(
    "organizations",
    __name__
)

@organization_bp.route("/", methods=["GET"])
def get_organizations():
    return jsonify([
        {
            "id": 1,
            "name": "Codity AI"
        }
    ])