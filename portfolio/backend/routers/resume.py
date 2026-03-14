import os
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import get_db
from models import PortfolioMeta, Skill, Experience, Project, Education, Certification
from schemas import ParsedResume
from services.file_service import extract_text
from services.claude_service import parse_resume_with_claude

router = APIRouter(prefix="/api/resume", tags=["resume"])

DATA_DIR = Path(os.getenv("DATA_DIR", str(Path(__file__).parent.parent)))
UPLOAD_DIR = DATA_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def upsert_portfolio_from_parsed(db: Session, parsed: ParsedResume):
    # Meta — single row with id=1
    meta_row = db.query(PortfolioMeta).filter(PortfolioMeta.id == 1).first()
    meta_data = parsed.meta.model_dump()
    if meta_row:
        for k, v in meta_data.items():
            setattr(meta_row, k, v)
    else:
        db.add(PortfolioMeta(id=1, **meta_data))
    # resume_filename is preserved (set separately in upload_resume)

    # Skills — replace all
    db.query(Skill).delete()
    for s in parsed.skills:
        db.add(Skill(**s.model_dump()))

    # Experience — replace all
    db.query(Experience).delete()
    for i, e in enumerate(parsed.experience):
        data = e.model_dump()
        data["order_index"] = i
        db.add(Experience(**data))

    # Projects — replace all
    db.query(Project).delete()
    for i, p in enumerate(parsed.projects):
        data = p.model_dump()
        data["order_index"] = i
        db.add(Project(**data))

    # Education — replace all
    db.query(Education).delete()
    for ed in parsed.education:
        db.add(Education(**ed.model_dump()))

    # Certifications — replace all
    db.query(Certification).delete()
    for c in parsed.certifications:
        db.add(Certification(**c.model_dump()))

    db.commit()


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    allowed = {".pdf", ".docx", ".doc"}
    ext = Path(file.filename).suffix.lower()
    if ext not in allowed:
        raise HTTPException(400, f"Unsupported file type '{ext}'. Upload PDF or DOCX.")

    # Save file
    dest = UPLOAD_DIR / file.filename
    file_bytes = await file.read()
    with open(dest, "wb") as f:
        f.write(file_bytes)

    # Extract text
    try:
        text = extract_text(file.filename, file_bytes)
    except ValueError as e:
        raise HTTPException(422, str(e))

    if not text.strip():
        raise HTTPException(422, "Could not extract text from the file. Try a different format.")

    # Parse with Claude
    try:
        parsed = parse_resume_with_claude(text)
    except ValueError as e:
        raise HTTPException(500, str(e))

    # Save to DB
    upsert_portfolio_from_parsed(db, parsed)

    # Store filename in meta
    meta_row = db.query(PortfolioMeta).filter(PortfolioMeta.id == 1).first()
    if meta_row:
        meta_row.resume_filename = file.filename
        db.commit()

    return {
        "message": "Resume parsed and portfolio updated successfully",
        "filename": file.filename,
        "parsed": parsed.model_dump()
    }


@router.get("/download")
def download_resume(db: Session = Depends(get_db)):
    meta = db.query(PortfolioMeta).filter(PortfolioMeta.id == 1).first()
    if not meta or not meta.resume_filename:
        raise HTTPException(404, "No resume uploaded yet")
    filepath = UPLOAD_DIR / meta.resume_filename
    if not filepath.exists():
        raise HTTPException(404, "Resume file not found on disk")
    return FileResponse(
        path=str(filepath),
        filename=meta.resume_filename,
        media_type="application/octet-stream",
    )
