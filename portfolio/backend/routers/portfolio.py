from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import PortfolioMeta, Skill, Experience, Project, Education, Certification
from schemas import (
    MetaBase, MetaResponse,
    SkillCreate, SkillResponse,
    ExperienceCreate, ExperienceResponse,
    ProjectCreate, ProjectResponse,
    EducationCreate, EducationResponse,
    CertificationCreate, CertificationResponse,
    PortfolioResponse,
)

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])


# ── Full portfolio (public) ──────────────────────────────────────────────────
@router.get("", response_model=PortfolioResponse)
def get_portfolio(db: Session = Depends(get_db)):
    return PortfolioResponse(
        meta=db.query(PortfolioMeta).filter(PortfolioMeta.id == 1).first(),
        skills=db.query(Skill).all(),
        experience=db.query(Experience).order_by(Experience.order_index).all(),
        projects=db.query(Project).order_by(Project.order_index).all(),
        education=db.query(Education).all(),
        certifications=db.query(Certification).all(),
    )


# ── Meta ─────────────────────────────────────────────────────────────────────
@router.get("/meta", response_model=MetaResponse)
def get_meta(db: Session = Depends(get_db)):
    row = db.query(PortfolioMeta).filter(PortfolioMeta.id == 1).first()
    if not row:
        row = PortfolioMeta(id=1)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row


@router.put("/meta", response_model=MetaResponse)
def update_meta(data: MetaBase, db: Session = Depends(get_db)):
    row = db.query(PortfolioMeta).filter(PortfolioMeta.id == 1).first()
    if not row:
        row = PortfolioMeta(id=1, **data.model_dump())
        db.add(row)
    else:
        for k, v in data.model_dump().items():
            setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


# ── Skills ───────────────────────────────────────────────────────────────────
@router.get("/skills", response_model=List[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()


@router.post("/skills", response_model=SkillResponse)
def create_skill(data: SkillCreate, db: Session = Depends(get_db)):
    row = Skill(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/skills/{skill_id}", response_model=SkillResponse)
def update_skill(skill_id: int, data: SkillCreate, db: Session = Depends(get_db)):
    row = db.query(Skill).filter(Skill.id == skill_id).first()
    if not row:
        raise HTTPException(404, "Skill not found")
    for k, v in data.model_dump().items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/skills/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db)):
    row = db.query(Skill).filter(Skill.id == skill_id).first()
    if not row:
        raise HTTPException(404, "Skill not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


# ── Experience ────────────────────────────────────────────────────────────────
@router.get("/experience", response_model=List[ExperienceResponse])
def get_experience(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.order_index).all()


@router.post("/experience", response_model=ExperienceResponse)
def create_experience(data: ExperienceCreate, db: Session = Depends(get_db)):
    row = Experience(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/experience/{exp_id}", response_model=ExperienceResponse)
def update_experience(exp_id: int, data: ExperienceCreate, db: Session = Depends(get_db)):
    row = db.query(Experience).filter(Experience.id == exp_id).first()
    if not row:
        raise HTTPException(404, "Experience not found")
    for k, v in data.model_dump().items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/experience/{exp_id}")
def delete_experience(exp_id: int, db: Session = Depends(get_db)):
    row = db.query(Experience).filter(Experience.id == exp_id).first()
    if not row:
        raise HTTPException(404, "Experience not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


# ── Projects ──────────────────────────────────────────────────────────────────
@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.order_index).all()


@router.post("/projects", response_model=ProjectResponse)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    row = Project(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, data: ProjectCreate, db: Session = Depends(get_db)):
    row = db.query(Project).filter(Project.id == project_id).first()
    if not row:
        raise HTTPException(404, "Project not found")
    for k, v in data.model_dump().items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    row = db.query(Project).filter(Project.id == project_id).first()
    if not row:
        raise HTTPException(404, "Project not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


# ── Education ─────────────────────────────────────────────────────────────────
@router.get("/education", response_model=List[EducationResponse])
def get_education(db: Session = Depends(get_db)):
    return db.query(Education).all()


@router.post("/education", response_model=EducationResponse)
def create_education(data: EducationCreate, db: Session = Depends(get_db)):
    row = Education(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/education/{edu_id}", response_model=EducationResponse)
def update_education(edu_id: int, data: EducationCreate, db: Session = Depends(get_db)):
    row = db.query(Education).filter(Education.id == edu_id).first()
    if not row:
        raise HTTPException(404, "Education not found")
    for k, v in data.model_dump().items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/education/{edu_id}")
def delete_education(edu_id: int, db: Session = Depends(get_db)):
    row = db.query(Education).filter(Education.id == edu_id).first()
    if not row:
        raise HTTPException(404, "Education not found")
    db.delete(row)
    db.commit()
    return {"ok": True}


# ── Certifications ────────────────────────────────────────────────────────────
@router.get("/certifications", response_model=List[CertificationResponse])
def get_certifications(db: Session = Depends(get_db)):
    return db.query(Certification).all()


@router.post("/certifications", response_model=CertificationResponse)
def create_certification(data: CertificationCreate, db: Session = Depends(get_db)):
    row = Certification(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.put("/certifications/{cert_id}", response_model=CertificationResponse)
def update_certification(cert_id: int, data: CertificationCreate, db: Session = Depends(get_db)):
    row = db.query(Certification).filter(Certification.id == cert_id).first()
    if not row:
        raise HTTPException(404, "Certification not found")
    for k, v in data.model_dump().items():
        setattr(row, k, v)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/certifications/{cert_id}")
def delete_certification(cert_id: int, db: Session = Depends(get_db)):
    row = db.query(Certification).filter(Certification.id == cert_id).first()
    if not row:
        raise HTTPException(404, "Certification not found")
    db.delete(row)
    db.commit()
    return {"ok": True}
