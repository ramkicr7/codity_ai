from flask import Blueprint, jsonify, request

from app.services.project_service import ProjectService

project_bp = Blueprint(
    "projects",
    __name__
)


# =====================================
# GET ALL PROJECTS
# =====================================

@project_bp.route("", methods=["GET"])
@project_bp.route("/", methods=["GET"])
def get_projects():
    """
    Get all projects.
    """

    response, status = ProjectService.get_all_projects()

    return jsonify(response), status


# =====================================
# GET PROJECT BY ID
# =====================================

@project_bp.route("/<uuid:project_id>", methods=["GET"])
def get_project(project_id):
    """
    Get project by ID.
    """

    response, status = ProjectService.get_project(project_id)

    return jsonify(response), status


# =====================================
# CREATE PROJECT
# =====================================

@project_bp.route("", methods=["POST"])
@project_bp.route("/", methods=["POST"])
def create_project():
    """
    Create a project.
    """

    data = request.get_json()

    response, status = ProjectService.create_project(data)

    return jsonify(response), status


# =====================================
# UPDATE PROJECT
# =====================================

@project_bp.route("/<uuid:project_id>", methods=["PUT"])
def update_project(project_id):
    """
    Update project.
    """

    data = request.get_json()

    response, status = ProjectService.update_project(
        project_id,
        data
    )

    return jsonify(response), status


# =====================================
# DELETE PROJECT
# =====================================

@project_bp.route("/<uuid:project_id>", methods=["DELETE"])
def delete_project(project_id):
    """
    Delete project.
    """

    response, status = ProjectService.delete_project(project_id)

    return jsonify(response), status