from enum import Enum


class Roles(str, Enum):

    ADMIN = "Admin"

    PROJECT_MANAGER = "Project Manager"

    WORKER = "Worker"

    VIEWER = "Viewer"