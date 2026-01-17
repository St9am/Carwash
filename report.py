from sqlalchemy import Column, Integer, String, DateTime, func
from app.database import Base

class ReportFile(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    filename = Column(String)
    created_at = Column(DateTime, default=func.now())
