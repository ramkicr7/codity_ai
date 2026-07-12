import uuid

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import db


class RetryPolicy(db.Model):
    __tablename__ = "retry_policies"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    strategy = db.Column(
        db.String(30),
        nullable=False,
        default="FIXED"
    )

    max_retries = db.Column(
        db.Integer,
        nullable=False,
        default=3
    )

    initial_delay = db.Column(
        db.Integer,
        nullable=False,
        default=5
    )

    backoff_multiplier = db.Column(
        db.Float,
        nullable=False,
        default=2.0
    )

    max_delay = db.Column(
        db.Integer,
        nullable=False,
        default=300
    )

    project_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("projects.id", ondelete="CASCADE"),
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
project = db.relationship(
    "Project"
)