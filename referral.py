from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class ReferralEvent(Base):
    __tablename__ = "referral_events"

    id = Column(Integer, primary_key=True)
    inviter_id = Column(Integer, ForeignKey("users.id"))
    invited_id = Column(Integer, ForeignKey("users.id"))
    reward = Column(Integer)
    created_at = Column(DateTime, default=func.now())

    inviter = relationship("User", foreign_keys=[inviter_id], back_populates="referrals_made")
    invited = relationship("User", foreign_keys=[invited_id], back_populates="referrals_received")
