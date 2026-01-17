from typing import Optional

from pydantic import BaseModel


class UserCreate(BaseModel):
    telegram_id: Optional[int]
    name: Optional[str]
    email: Optional[str]
    referral_code: Optional[str]
    init_data: Optional[str] = None


class SubscriptionOut(BaseModel):
    plan: str
    price: int
    remaining_washes: int
    started_at: datetime
    expires_at: Optional[datetime] = None
    active: bool
    is_night_only: bool

    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    telegram_id: Optional[int] = None
    email: Optional[str] = None
    name: Optional[str] = None
    level: int
    exp: int
    referral_code: Optional[str] = None
    is_admin: bool = False
    subscriptions: List[SubscriptionOut] = []
    total_remaining_washes: int = 0
    active_until: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    user: UserOut


class SubscriptionCreate(BaseModel):
    plan_id: str
    payment_id: Optional[str] = None


class CarWashCreate(BaseModel):
    network_id: int
    name: str
    ip: str
    port: int


class PaymentCreateRequest(BaseModel):
    plan_id: str
    return_url: Optional[str] = None
