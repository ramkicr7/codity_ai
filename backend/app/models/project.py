import uuid

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import db


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    organization_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey(
            "organizations.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )



    organization = db.relationship(
        "Organization",
        back_populates="projects"
    )

    queues = db.relationship(
        "Queue",
        back_populates="project",
        lazy=True,
        cascade="all, delete-orphan"
    )