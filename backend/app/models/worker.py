import uuid

from sqlalchemy.dialects.postgresql import UUID

from app.core.database import db


class Worker(db.Model):
    __tablename__ = "workers"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    hostname = db.Column(
        db.String(255),
        nullable=False,
        unique=True
    )

    status = db.Column(
        db.String(30),
        nullable=False,
        default="IDLE"
    )


    last_heartbeat = db.Column(
        db.DateTime,
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

 

    jobs = db.relationship(
        "Job",
        foreign_keys="Job.worker_id",
        back_populates="worker",
        lazy=True
    )