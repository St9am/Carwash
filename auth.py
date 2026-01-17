import hashlib
import hmac
import json
import secrets
import string

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app import models
from app.core.config import settings
from app.core.security import create_access_token
from app.database import AsyncSessionLocal
from app.dependencies import get_current_user
from app.schemas import AuthResponse, UserCreate, UserOut

router = APIRouter()


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


def gen_referral_code(n=6):
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(n))


def verify_init_data(init_data: str, bot_token: str) -> dict:
    try:
        items = [kv for kv in init_data.split("\n") if kv and not kv.startswith("hash=")]
        data_check_string = "\n".join(sorted(items))
        secret_key = hashlib.sha256(bot_token.encode()).digest()
        h = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
        provided_hash = None
        for part in init_data.split("\n"):
            if part.startswith("hash="):
                provided_hash = part.split("=", 1)[1]
                break
        if not provided_hash:
            raise ValueError("No hash in init_data")
        if h != provided_hash:
            raise ValueError("Invalid init_data hash")
        data = {}
        for it in items:
            k, v = it.split("=", 1)
            data[k] = v
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid init_data: {e}")


def _extract_user_from_init_data(init_data: str | None) -> dict:
    if not init_data:
        return {}
    parsed = verify_init_data(init_data, settings.BOT_TOKEN)
    raw_user = parsed.get("user")
    if not raw_user:
        return {}
    try:
        return json.loads(raw_user)
    except json.JSONDecodeError:
        return {}


@router.post("/register", response_model=AuthResponse)
async def register(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    tg_user = _extract_user_from_init_data(payload.init_data)
    telegram_id = payload.telegram_id or tg_user.get("id")

    if not telegram_id:
        raise HTTPException(status_code=400, detail="telegram_id is required")

    q = await db.execute(models.User.__table__.select().where(models.User.telegram_id == telegram_id))
    row = q.first()
    if row:
        user = row[0]
    else:
        user = models.User(
            telegram_id=telegram_id,
            name=payload.name or tg_user.get("first_name"),
            email=payload.email,
        )
        user.referral_code = gen_referral_code()
        if payload.referral_code:
            ref_q = await db.execute(
                models.User.__table__.select().where(models.User.referral_code == payload.referral_code)
            )
            ref = ref_q.first()
            if ref:
                user.referred_by = ref[0].id
        db.add(user)
        await db.commit()
        await db.refresh(user)
        if user.referred_by:
            ref_user = await db.get(models.User, user.referred_by)
            if ref_user:
                from app.services.level_service import calc_level
                ref_user.exp = (ref_user.exp or 0) + 50
                ref_user.level = calc_level(ref_user.exp)
                await db.commit()

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "user": user}


@router.get("/me", response_model=UserOut)
async def me(current_user=Depends(get_current_user)):
    return current_user
