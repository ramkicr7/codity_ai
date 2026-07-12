from marshmallow import ValidationError

from app.repositories.project_repository import ProjectRepository
from app.schemas.project_schema import ProjectSchema
from app.models.organization import Organization


class ProjectService:

    @staticmethod
    def get_all_projects():
        """
        Get all projects.
        """

        projects = ProjectRepository.get_all()

        return {
            "success": True,
            "message": "Projects fetched successfully.",
            "data": ProjectSchema(many=True).dump(projects)
        }, 200

    @staticmethod
    def get_project(project_id):
        """
        Get a project by ID.
        """

        project = ProjectRepository.get_by_id(project_id)

        if not project:
            return {
                "success": False,
                "message": "Project not found."
            }, 404

        return {
            "success": True,
            "message": "Project fetched successfully.",
            "data": ProjectSchema().dump(project)
        }, 200

    @staticmethod
    def create_project(data):
        """
        Create a project.
        """

        try:
            validated_data = ProjectSchema().load(data)

        except ValidationError as err:

            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        # ==========================
        # Automatically use the first Organization
        # ==========================

        organization = Organization.query.first()

        if organization is None:

            return {
                "success": False,
                "message": "No organization found. Please create an organization first."
            }, 400

        validated_data["organization_id"] = organization.id

        project = ProjectRepository.create(validated_data)

        return {
            "success": True,
            "message": "Project created successfully.",
            "data": ProjectSchema().dump(project)
        }, 201

    @staticmethod
    def update_project(project_id, data):
        """
        Update a project.
        """

        project = ProjectRepository.get_by_id(project_id)

        if not project:
            return {
                "success": False,
                "message": "Project not found."
            }, 404

        try:
            validated_data = ProjectSchema(
                partial=True
            ).load(data)

        except ValidationError as err:

            return {
                "success": False,
                "message": "Validation failed.",
                "errors": err.messages
            }, 400

        project = ProjectRepository.update(
            project,
            validated_data
        )

        return {
            "success": True,
            "message": "Project updated successfully.",
            "data": ProjectSchema().dump(project)
        }, 200

    @staticmethod
    def delete_project(project_id):
        """
        Delete a project.
        """

        project = ProjectRepository.get_by_id(project_id)

        if not project:

            return {
                "success": False,
                "message": "Project not found."
            }, 404

        ProjectRepository.delete(project)

        return {
            "success": True,
            "message": "Project deleted successfully."
        }, 200