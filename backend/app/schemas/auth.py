"""
Authentication request schemas.

Handles validation for:
- User Registration
- User Login
"""

from marshmallow import Schema, ValidationError, fields, validate, validates


class RegisterSchema(Schema):
    """
    User Registration Schema
    """

    first_name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=50)
    )

    last_name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=50)
    )

    username = fields.Str(
        required=True,
        validate=[
            validate.Length(min=3, max=30),
            validate.Regexp(
                r"^[A-Za-z0-9_]+$",
                error="Username may contain only letters, numbers and underscores."
            )
        ]
    )

    email = fields.Email(required=True)

    password = fields.Str(
        required=True,
        load_only=True,
        validate=validate.Length(min=8)
    )

    confirm_password = fields.Str(
        required=True,
        load_only=True
    )

    @validates("password")
    def validate_password(self, value, **kwargs):
        """
        Password policy:
        - Minimum 8 characters
        - One uppercase
        - One lowercase
        - One digit
        - One special character
        """

        import re

        if not re.search(r"[A-Z]", value):
            raise ValidationError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", value):
            raise ValidationError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", value):
            raise ValidationError(
                "Password must contain at least one number."
            )

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValidationError(
                "Password must contain at least one special character."
            )

    @validates("confirm_password")
    def validate_confirm_password(self, value, **kwargs):
        """
        Placeholder validation.

        Password matching is checked inside AuthService
        after schema validation.
        """
        return value


class LoginSchema(Schema):
    """
    User Login Schema
    """

    email = fields.Email(required=True)

    password = fields.Str(
        required=True,
        load_only=True
    )