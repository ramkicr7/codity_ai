from flask import Flask
from flasgger import Swagger

from app.core.config import Config
from app.core.extensions import (
    db,
    migrate,
    jwt,
    bcrypt,
    cors,
    limiter
)

# ==========================
# Import Models
# ==========================
import app.models

# ==========================
# API Blueprints
# ==========================
from app.api.auth import auth_bp
from app.api.organizations import organization_bp
from app.api.projects import project_bp
from app.api.queues import queue_bp
from app.api.jobs import job_bp
from app.api.workers import worker_bp
from app.api.metrics import metrics_bp
from app.api.retry_policies import retry_policy_bp
from app.api.scheduled_jobs import scheduled_job_bp
from app.api.job_executions import job_execution_bp
from app.api.dead_letters import dead_letter_bp


def create_app():

    app = Flask(__name__)

    # IMPORTANT
    app.url_map.strict_slashes = False

    app.config.from_object(Config)

    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": "apispec",
                "route": "/apispec.json",
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/apidocs/"
    }

    Swagger(
        app,
        config=swagger_config,
        template={
            "info": {
                "title": "Codity AI Backend API",
                "description": "Distributed AI Job Scheduler Backend",
                "version": "1.0.0"
            }
        }
    )

    # ==========================
    # Extensions
    # ==========================

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)
    limiter.init_app(app)

    # ==========================
    # Register Blueprints
    # ==========================

    app.register_blueprint(
        auth_bp,
        url_prefix="/api/auth"
    )

    app.register_blueprint(
        organization_bp,
        url_prefix="/api/organizations"
    )

    app.register_blueprint(
        project_bp,
        url_prefix="/api/projects"
    )

    app.register_blueprint(
        queue_bp,
        url_prefix="/api/queues"
    )

    app.register_blueprint(
        job_bp,
        url_prefix="/api/jobs"
    )

    app.register_blueprint(
        worker_bp,
        url_prefix="/api/workers"
    )

    app.register_blueprint(
        metrics_bp,
        url_prefix="/api/metrics"
    )

    app.register_blueprint(
        retry_policy_bp,
        url_prefix="/api/retry-policies"
    )

    app.register_blueprint(
        scheduled_job_bp,
        url_prefix="/api/scheduled-jobs"
    )

    app.register_blueprint(
        job_execution_bp,
        url_prefix="/api/job-executions"
    )

    app.register_blueprint(
        dead_letter_bp,
        url_prefix="/api/dead-letters"
    )

    # ==========================
    # Home
    # ==========================

    @app.get("/")
    def home():
        return {
            "success": True,
            "message": "🚀 Codity AI Backend Running Successfully",
            "version": "1.0.0"
        }, 200

    @app.get("/api")
    def api_home():
        return {
            "success": True,
            "message": "Codity AI REST API",
            "swagger": "/apidocs"
        }, 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )