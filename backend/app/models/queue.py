import uuid

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import db


class Queue(db.Model):
    __tablename__ = "queues"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    priority = db.Column(
        db.Integer,
        nullable=False,
        default=5
    )

    concurrency_limit = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    max_retries = db.Column(
        db.Integer,
        nullable=False,
        default=3
    )

    is_paused = db.Column(
        db.Boolean,
        default=False
    )

    project_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey(
            "projects.id",
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

    # ==========================
    # Relationships
    # ==========================

    project = db.relationship(
        "Project",
        back_populates="queues"
    )

    jobs = db.relationship(
        "Job",
        back_populates="queue",
        lazy=True,
        cascade="all, delete-orphan"
    )