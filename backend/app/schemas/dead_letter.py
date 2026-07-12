from marshmallow import Schema, fields


class DeadLetterSchema(Schema):

    id = fields.UUID(dump_only=True)

    job_id = fields.UUID(required=True)

    worker_id = fields.UUID(allow_none=True)

    reason = fields.String(required=True)

    retry_count = fields.Integer(required=True)

    payload = fields.Dict()

    failed_at = fields.DateTime(dump_only=True)

    created_at = fields.DateTime(dump_only=True)