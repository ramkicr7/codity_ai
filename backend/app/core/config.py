import os
from dotenv import load_dotenv


load_dotenv()


class Config:
    """
    Base Configuration
    """

    
    SECRET_KEY = os.getenv("SECRET_KEY")

    
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 3600)
    )


    REDIS_HOST = os.getenv("REDIS_HOST")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

    
    MAX_WORKERS = int(os.getenv("MAX_WORKERS", 5))
    WORKER_HEARTBEAT = int(os.getenv("WORKER_HEARTBEAT", 15))

    
    DEFAULT_RETRY_COUNT = int(os.getenv("DEFAULT_RETRY_COUNT", 3))
    DEFAULT_RETRY_DELAY = int(os.getenv("DEFAULT_RETRY_DELAY", 10))

    
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")


    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    GROQ_MODEL = os.getenv(
        "GROQ_MODEL",
        "llama-3.1-8b-instant"
    )

    
    RATELIMIT_DEFAULT = os.getenv(
        "RATELIMIT_DEFAULT",
        "100 per minute"
    )

    
    DEFAULT_PAGE_SIZE = int(
        os.getenv("DEFAULT_PAGE_SIZE", 20)
    )