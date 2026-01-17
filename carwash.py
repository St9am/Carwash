from sqlalchemy import Boolean, Column, Integer, String, Float

from app.database import Base


class CarWash(Base):
    __tablename__ = "carwashes"

    id = Column(Integer, primary_key=True)
    network_id = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    ip = Column(String, nullable=False)
    port = Column(Integer, nullable=False)
    fernet_key = Column(String, nullable=False)
    active = Column(Boolean, default=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
