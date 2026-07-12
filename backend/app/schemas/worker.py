from marshmallow import Schema, fields, validate


class WorkerSchema(Schema):
    """
    Worker Schema
    """

    id = fields.UUID(dump_only=True)

    name = fields.String(
        required=True,
        validate=validate.Length(
            min=2,
            max=100,
            error="Worker name must be between 2 and 100 characters."
        )
    )

    hostname = fields.String(
        required=True,
        validate=validate.Length(
            min=2,
            max=255,
            error="Hostname must be between 2 and 255 characters."
        )
    )

    status = fields.String(dump_only=True)

    current_job_id = fields.UUID(
        allow_none=True,
        dump_only=True
    )

    last_heartbeat = fields.DateTime(
        dump_only=True
    )

    created_at = fields.DateTime(
        dump_only=True
    )

    updated_at = fields.DateTime(
        dump_only=True
    )