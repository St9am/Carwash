from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan = Column(String, nullable=False)
    price = Column(Integer, nullable=False, default=0)
    remaining_washes = Column(Integer, nullable=False, default=0)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    active = Column(Boolean, default=True)
    payment_id = Column(String, unique=True, nullable=True)
    is_night_only = Column(Boolean, default=False)

    user = relationship("User", back_populates="subscriptions")
