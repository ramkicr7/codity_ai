import uuid

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import db


class ScheduledJob(db.Model):
    __tablename__ = "scheduled_jobs"

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
        default="SCHEDULED"
    )

    schedule_type = db.Column(
        db.String(30),
        nullable=False,
        default="ONCE"
    )

    run_at = db.Column(
        db.DateTime,
        nullable=True
    )

    cron_expression = db.Column(
        db.String(100),
        nullable=True
    )

    payload = db.Column(
        db.JSON
    )

    project_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False
    )

    queue_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("queues.id", ondelete="CASCADE"),
        nullable=False
    )

    created_by = db.Column(
    db.Integer,
    db.ForeignKey("users.id", ondelete="SET NULL"),
    nullable=True
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
project = db.relationship(
    "Project"
)

queue = db.relationship(
    "Queue"
)

user = db.relationship(
    "User"
)