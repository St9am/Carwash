from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.admin.deps import get_db
from app.core.security import create_access_token, verify_password
from app.models.user import User

router = APIRouter(prefix="/auth")


@router.post("/login")
async def admin_login(payload: dict, db: AsyncSession = Depends(get_db)):
    email = payload.get("email")
    password = payload.get("password")

    q = await db.execute(select(User).where(User.email == email))
    user = q.scalar_one_or_none()

    if not user or not user.is_admin:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Добавляем is_admin в токен!
    token = create_access_token({
        "sub": str(user.id),
        "is_admin": user.is_admin  # ← КЛЮЧЕВОЕ ИЗМЕНЕНИЕ!
    })
    return {"access_token": token, "token_type": "bearer"}