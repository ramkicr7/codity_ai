from marshmallow import Schema, fields


class JobExecutionSchema(Schema):

    id = fields.UUID(dump_only=True)

    job_id = fields.UUID(required=True)

    worker_id = fields.UUID(allow_none=True)

    status = fields.String(dump_only=True)

    attempt_number = fields.Integer()

    started_at = fields.DateTime(dump_only=True)

    completed_at = fields.DateTime(dump_only=True)

    duration = fields.Float(dump_only=True)

    result = fields.Dict(dump_only=True)

    error_message = fields.String(dump_only=True)

    created_at = fields.DateTime(dump_only=True)