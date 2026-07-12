from marshmallow import Schema, fields, validate


class ProjectSchema(Schema):
    """
    Project Schema
    """

    id = fields.UUID(
        dump_only=True
    )

    name = fields.String(
        required=True,
        validate=validate.Length(min=2, max=150)
    )

    description = fields.String(
        required=False,
        allow_none=True
    )

    organization_id = fields.UUID(
    required=False,
    load_default=None
)

    created_at = fields.DateTime(
        dump_only=True
    )

    updated_at = fields.DateTime(
        dump_only=True
    )