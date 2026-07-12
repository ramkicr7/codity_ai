from flask import Blueprint, jsonify

from app.core.extensions import db
from app.models.organization import Organization

organization_bp = Blueprint(
    "organizations",
    __name__
)


# =====================================
# GET ALL ORGANIZATIONS
# =====================================

@organization_bp.route("/", methods=["GET"])
def get_organizations():

    organizations = Organization.query.all()

    return jsonify([
        org.to_dict()
        for org in organizations
    ])


# =====================================
# CREATE DEFAULT ORGANIZATION
# =====================================

@organization_bp.route("/seed", methods=["POST"])
def seed():

    existing = Organization.query.first()

    if existing:

        return jsonify({
            "success": True,
            "message": "Organization already exists.",
            "data": existing.to_dict()
        }), 200

    org = Organization(
        name="Codity AI",
        description="Default Organization",
        email="admin@codity.ai"
    )

    db.session.add(org)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Organization created successfully.",
        "data": org.to_dict()
    }), 201