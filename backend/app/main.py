from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import engine, SessionLocal
from app.core.init_data import init_default_data
from app.models import user, project, card

# Create tables
user.Base.metadata.create_all(bind=engine)
project.Base.metadata.create_all(bind=engine)
card.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize default data
    db = SessionLocal()
    try:
        init_default_data(db)
    finally:
        db.close()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="mkr_kanban API",
    version="0.1.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретный домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "0.1.0"}

@app.get("/")
def root():
    return {"message": "mkr_kanban API", "docs": "/docs"}