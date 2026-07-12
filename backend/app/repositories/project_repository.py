from app.models.project import Project
from app.core.database import db


class ProjectRepository:

    @staticmethod
    def create(data):

        project = Project(**data)

        db.session.add(project)

        db.session.commit()

        return project

    @staticmethod
    def get_all():

        return Project.query.order_by(
            Project.created_at.desc()
        ).all()

    @staticmethod
    def get_by_id(project_id):

        return Project.query.filter_by(
            id=project_id
        ).first()

    @staticmethod
    def update(project, data):

        for key, value in data.items():
            setattr(project, key, value)

        db.session.commit()

        return project

    @staticmethod
    def delete(project):

        db.session.delete(project)

        db.session.commit()