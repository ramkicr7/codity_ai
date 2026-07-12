from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

db = SQLAlchemy()

migrate = Migrate()

jwt = JWTManager()

bcrypt = Bcrypt()

cors = CORS(
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                "https://codity-ai-67bb.vercel.app",
            ]
        }
    },
    supports_credentials=True
)

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[]
)