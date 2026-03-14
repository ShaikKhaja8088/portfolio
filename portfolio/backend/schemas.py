from pydantic import BaseModel
from typing import List, Optional


# --- Meta ---
class MetaBase(BaseModel):
    name: str = ""
    title: str = ""
    bio: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    photo_url: str = ""
    linkedin: str = ""
    github: str = ""
    twitter: str = ""
    website: str = ""
    resume_filename: str = ""


class MetaResponse(MetaBase):
    id: int

    class Config:
        from_attributes = True


# --- Skills ---
class SkillBase(BaseModel):
    category: str = "General"
    name: str
    proficiency: int = 3
    icon: str = ""


class SkillCreate(SkillBase):
    pass


class SkillResponse(SkillBase):
    id: int

    class Config:
        from_attributes = True


# --- Experience ---
class ExperienceBase(BaseModel):
    company: str
    role: str
    start_date: str = ""
    end_date: str = ""
    is_current: bool = False
    location: str = ""
    description: str = ""
    order_index: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceResponse(ExperienceBase):
    id: int

    class Config:
        from_attributes = True


# --- Projects ---
class ProjectBase(BaseModel):
    name: str
    description: str = ""
    tech_stack: List[str] = []
    github_url: str = ""
    live_url: str = ""
    image_url: str = ""
    order_index: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True


# --- Education ---
class EducationBase(BaseModel):
    institution: str
    degree: str = ""
    field: str = ""
    start_year: str = ""
    end_year: str = ""
    gpa: str = ""
    description: str = ""


class EducationCreate(EducationBase):
    pass


class EducationResponse(EducationBase):
    id: int

    class Config:
        from_attributes = True


# --- Certifications ---
class CertificationBase(BaseModel):
    name: str
    issuer: str = ""
    date: str = ""
    credential_url: str = ""
    description: str = ""


class CertificationCreate(CertificationBase):
    pass


class CertificationResponse(CertificationBase):
    id: int

    class Config:
        from_attributes = True


# --- Full Portfolio Response ---
class PortfolioResponse(BaseModel):
    meta: Optional[MetaResponse]
    skills: List[SkillResponse]
    experience: List[ExperienceResponse]
    projects: List[ProjectResponse]
    education: List[EducationResponse]
    certifications: List[CertificationResponse]


# --- Claude Parsed Resume ---
class ParsedResume(BaseModel):
    meta: MetaBase
    skills: List[SkillCreate]
    experience: List[ExperienceCreate]
    projects: List[ProjectCreate]
    education: List[EducationCreate]
    certifications: List[CertificationCreate]
