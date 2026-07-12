import uuid

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import db


class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    title = db.Column(
        db.String(255),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="PENDING"
    )

    priority = db.Column(
        db.Integer,
        nullable=False,
        default=5
    )

    input_data = db.Column(
        db.JSON
    )

    result = db.Column(
        db.JSON
    )

    error_message = db.Column(
        db.Text
    )

    retry_count = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    queue_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey(
            "queues.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    project_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey(
            "projects.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    worker_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey(
            "workers.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    claimed_at = db.Column(
        db.DateTime
    )

    started_at = db.Column(
        db.DateTime
    )

    completed_at = db.Column(
        db.DateTime
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

    queue = db.relationship(
        "Queue",
        back_populates="jobs"
    )

    project = db.relationship(
        "Project"
    )

    worker = db.relationship(
        "Worker",
        foreign_keys=[worker_id],
        back_populates="jobs"
    )