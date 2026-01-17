from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.api.admin.deps import admin_required, get_db
from app.models.referral import ReferralEvent

router = APIRouter(prefix="/referrals")

@router.get("")
async def referrals_list(admin = Depends(admin_required), db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(ReferralEvent))
    return q.scalars().all()
