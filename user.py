from sqlalchemy import BigInteger, Boolean, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    telegram_id = Column(BigInteger, unique=True, nullable=True)
    email = Column(String, unique=True, nullable=True)
    name = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    referral_code = Column(String(16), unique=True, nullable=True, index=True)
    referred_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    level = Column(Integer, default=0)
    exp = Column(Integer, default=0)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    subscriptions = relationship("Subscription", back_populates="user")
    referrals_made = relationship("ReferralEvent", foreign_keys="ReferralEvent.inviter_id", back_populates="inviter")
    referrals_received = relationship(
        "ReferralEvent", foreign_keys="ReferralEvent.invited_id", back_populates="invited"
    )
    