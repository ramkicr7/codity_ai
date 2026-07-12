from marshmallow import Schema, fields


class RetryPolicySchema(Schema):

    id = fields.UUID(dump_only=True)

    name = fields.String(required=True)

    strategy = fields.String(required=True)

    max_retries = fields.Integer(required=True)

    initial_delay = fields.Integer(required=True)

    backoff_multiplier = fields.Float(required=True)

    max_delay = fields.Integer(required=True)

    project_id = fields.UUID(required=True)

    created_at = fields.DateTime(dump_only=True)

    updated_at = fields.DateTime(dump_only=True)