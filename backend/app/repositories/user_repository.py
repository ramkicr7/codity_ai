from app.core.extensions import db
from app.models.user import User


class UserRepository:

    @staticmethod
    def get_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def get_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def get_by_username(username):
        return User.query.filter_by(username=username).first()

    @staticmethod
    def email_exists(email):
        return User.query.filter_by(email=email).first() is not None

    @staticmethod
    def username_exists(username):
        return User.query.filter_by(username=username).first() is not None

    @staticmethod
    def create_user(
        first_name,
        last_name,
        username,
        email,
        password_hash
    ):
        """
        Create and persist a new user.
        """

        user = User(
            first_name=first_name,
            last_name=last_name,
            username=username,
            email=email,
            password_hash=password_hash
        )

        db.session.add(user)
        db.session.commit()

        return user

    @staticmethod
    def update_user(user):
        db.session.commit()
        return user

    @staticmethod
    def delete_user(user):
        db.session.delete(user)
        db.session.commit()