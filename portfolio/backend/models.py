from sqlalchemy import Column, Integer, String, Text, Boolean, JSON
from database import Base


class PortfolioMeta(Base):
    __tablename__ = "portfolio_meta"

    id = Column(Integer, primary_key=True, default=1)
    name = Column(String, default="")
    title = Column(String, default="")
    bio = Column(Text, default="")
    email = Column(String, default="")
    phone = Column(String, default="")
    location = Column(String, default="")
    photo_url = Column(String, default="")
    linkedin = Column(String, default="")
    github = Column(String, default="")
    twitter = Column(String, default="")
    website = Column(String, default="")
    resume_filename = Column(String, default="")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category = Column(String, default="General")
    name = Column(String, nullable=False)
    proficiency = Column(Integer, default=3)  # 1-5
    icon = Column(String, default="")


class Experience(Base):
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    start_date = Column(String, default="")
    end_date = Column(String, default="")
    is_current = Column(Boolean, default=False)
    location = Column(String, default="")
    description = Column(Text, default="")
    order_index = Column(Integer, default=0)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(Text, default="")
    tech_stack = Column(JSON, default=list)
    github_url = Column(String, default="")
    live_url = Column(String, default="")
    image_url = Column(String, default="")
    order_index = Column(Integer, default=0)


class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, autoincrement=True)
    institution = Column(String, nullable=False)
    degree = Column(String, default="")
    field = Column(String, default="")
    start_year = Column(String, default="")
    end_year = Column(String, default="")
    gpa = Column(String, default="")
    description = Column(Text, default="")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    issuer = Column(String, default="")
    date = Column(String, default="")
    credential_url = Column(String, default="")
    description = Column(Text, default="")
