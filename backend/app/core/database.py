from app.core.extensions import db


def init_db(app):
    """
    Initialize SQLAlchemy with Flask application.
    """
    db.init_app(app)