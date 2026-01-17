from app.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException
from app.core.security import decode_jwt
from app.models.user import User
from app.models.subscription import Subscription
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def get_current_user(token_payload = Depends(decode_jwt), db: AsyncSession = Depends(get_db)):
    
    subquery = (
        select(
            func.sum(Subscription.remaining_washes).label("total_remaining_washes"),
            func.max(Subscription.expires_at).label("active_until")
        )
        .where(
            Subscription.user_id == token_payload.sub,
            Subscription.active == True
        )
        .subquery()
    )
    
    stmt = (
        select(
            User,
            func.coalesce(subquery.c.total_remaining_washes, 0).label("total_remaining_washes"),
            subquery.c.active_until
        )
        .outerjoin(subquery, User.id == token_payload.sub)
        .where(User.id == token_payload.sub)
        .options(selectinload(User.subscriptions))
    )
    
    result = await db.execute(stmt)
    row = result.fetchone()
    
    if not row:
        raise HTTPException(status_code=401, detail="User not found")
    
    user, total_remaining_washes, active_until = row
    
    user.total_remaining_washes = total_remaining_washes or 0
    user.active_until = active_until
    
    return user

async def admin_required(user = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin required")
    return user
