from datetime import datetime
import uuid

from sqlalchemy.dialects.postgresql import UUID
from app.core.extensions import db


class Organization(db.Model):
    __tablename__ = "organizations"

    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name = db.Column(
        db.String(150),
        nullable=False,
        unique=True
    )

    description = db.Column(db.Text)

    email = db.Column(
        db.String(255),
        unique=True
    )

    phone = db.Column(db.String(20))

    website = db.Column(db.String(255))

    logo = db.Column(db.String(500))

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    is_deleted = db.Column(
        db.Boolean,
        default=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # Relationship with Projects
    projects = db.relationship(
        "Project",
        back_populates="organization",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "email": self.email,
            "website": self.website,
            "is_active": self.is_active
        }

    def __repr__(self):
        return f"<Organization {self.name}>"