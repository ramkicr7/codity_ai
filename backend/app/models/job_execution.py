import uuid

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import db


class JobExecution(db.Model):
    __tablename__ = "job_executions"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    job_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False
    )

    worker_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("workers.id", ondelete="SET NULL"),
        nullable=True
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="RUNNING"
    )

    attempt_number = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    started_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    completed_at = db.Column(
        db.DateTime,
        nullable=True
    )

    duration = db.Column(
        db.Float,
        nullable=True
    )

    result = db.Column(
        db.JSON
    )

    error_message = db.Column(
        db.Text
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )
job = db.relationship(
    "Job"
)

worker = db.relationship(
    "Worker"
)