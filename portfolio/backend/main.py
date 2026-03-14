import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from database import engine, DATA_DIR
from models import Base
from routers import resume, portfolio
from sqlalchemy import text, inspect as sa_inspect

# Create all tables
Base.metadata.create_all(bind=engine)

# Migration: add resume_filename if missing
with engine.connect() as conn:
    cols = [c["name"] for c in sa_inspect(engine).get_columns("portfolio_meta")]
    if "resume_filename" not in cols:
        conn.execute(text("ALTER TABLE portfolio_meta ADD COLUMN resume_filename TEXT DEFAULT ''"))
        conn.commit()

app = FastAPI(title="Portfolio API", version="1.0.0")

# CORS — allow all origins (public portfolio) or restrict via FRONTEND_URL
frontend_url = os.getenv("FRONTEND_URL", "*")
origins = ["*"] if frontend_url == "*" else [frontend_url, "http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=frontend_url != "*",
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(resume.router)
app.include_router(portfolio.router)

# Serve uploaded files from DATA_DIR
uploads_dir = DATA_DIR / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")


@app.get("/health")
def health():
    return {"status": "ok"}


# Serve React frontend — must be mounted LAST so API routes take priority
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
else:
    @app.get("/")
    def root():
        return {"message": "Portfolio API is running.", "docs": "/docs"}
