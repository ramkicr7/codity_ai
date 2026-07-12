import uuid

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import db


class DeadLetter(db.Model):
    __tablename__ = "dead_letters"

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

    reason = db.Column(
        db.Text,
        nullable=False
    )

    retry_count = db.Column(
        db.Integer,
        nullable=False,
        default=0
    )

    payload = db.Column(
        db.JSON
    )

    failed_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
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