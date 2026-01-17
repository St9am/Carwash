from sqlalchemy import Column, Integer, ForeignKey, DateTime, func, String
from sqlalchemy.orm import relationship
from app.database import Base

class WashSession(Base):
    __tablename__ = "wash_sessions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    carwash_id = Column(Integer, ForeignKey("carwashes.id"))
    qr = Column(String)
    started_at = Column(DateTime, default=func.now())

    user = relationship("User")
    carwash = relationship("CarWash")
