from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api.admin.deps import admin_required, get_db
from app.models.user import User

router = APIRouter(prefix="/users")

@router.get("")
async def list_users(admin = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(User))
    rows = q.scalars().all()
    return rows
