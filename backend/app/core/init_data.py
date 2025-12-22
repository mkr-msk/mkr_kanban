from sqlalchemy.orm import Session
from app.models.user import User
from app.models.project import Project
import uuid

# Hardcoded IDs для MVP
DEFAULT_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")
DEFAULT_PROJECT_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")

def init_default_data(db: Session):
    """Initialize default user and project for MVP"""
    
    # Check if default user exists
    user = db.query(User).filter(User.id == DEFAULT_USER_ID).first()
    if not user:
        user = User(
            id=DEFAULT_USER_ID,
            email="default@mkr-kanban.local",
            hashed_password="not_used_in_mvp",
            full_name="Default User"
        )
        db.add(user)
        db.commit()
        print("✅ Default user created")
    
    # Check if default project exists
    project = db.query(Project).filter(Project.id == DEFAULT_PROJECT_ID).first()
    if not project:
        project = Project(
            id=DEFAULT_PROJECT_ID,
            user_id=DEFAULT_USER_ID,
            name="My Kanban Board",
            description="Default project for MVP"
        )
        db.add(project)
        db.commit()
        print("✅ Default project created")