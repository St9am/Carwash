# app/api/admin/deps.py
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_jwt
from app.database import AsyncSessionLocal
from app.models.user import User


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


async def admin_required(
    token_payload = Depends(decode_jwt),
    db: AsyncSession = Depends(get_db)
):
    print(f"🔐 [DEPS] admin_required: sub={token_payload.sub}, is_admin={token_payload.is_admin}")
    
    if not token_payload.is_admin:
        raise HTTPException(status_code=403, detail="Admin rights required")
    
    # Преобразуем string sub в int для запроса в базу
    user_id = int(token_payload.sub)
    
    q = await db.execute(select(User).where(User.id == user_id))
    user = q.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user