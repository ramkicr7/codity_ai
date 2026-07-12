from marshmallow import Schema, fields


class JobSchema(Schema):

    id = fields.UUID(dump_only=True)

    title = fields.String(required=True)

    description = fields.String()

    status = fields.String(dump_only=True)

    priority = fields.Integer()

    input_data = fields.Dict()

    result = fields.Dict(dump_only=True)

    error_message = fields.String(dump_only=True)

    retry_count = fields.Integer(dump_only=True)

    queue_id = fields.UUID(required=True)

    project_id = fields.UUID(required=True)

    created_at = fields.DateTime(dump_only=True)

    updated_at = fields.DateTime(dump_only=True)