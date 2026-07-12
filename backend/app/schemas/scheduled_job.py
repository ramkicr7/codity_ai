from marshmallow import Schema, fields


class ScheduledJobSchema(Schema):

    id = fields.UUID(dump_only=True)

    title = fields.String(required=True)

    description = fields.String()

    status = fields.String(dump_only=True)

    schedule_type = fields.String(required=True)

    run_at = fields.DateTime(allow_none=True)

    cron_expression = fields.String(allow_none=True)

    payload = fields.Dict()

    project_id = fields.UUID(required=True)

    queue_id = fields.UUID(required=True)

    created_by = fields.UUID(allow_none=True)

    created_at = fields.DateTime(dump_only=True)

    updated_at = fields.DateTime(dump_only=True)