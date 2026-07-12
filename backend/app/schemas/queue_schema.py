from marshmallow import Schema, fields


class QueueSchema(Schema):

    id = fields.UUID(dump_only=True)

    name = fields.String(required=True)

    description = fields.String()

    priority = fields.Integer(load_default=5)

    concurrency_limit = fields.Integer(load_default=1)

    max_retries = fields.Integer(load_default=3)

    is_paused = fields.Boolean(dump_only=True)

    project_id = fields.UUID(required=True)

    created_at = fields.DateTime(dump_only=True)

    updated_at = fields.DateTime(dump_only=True)