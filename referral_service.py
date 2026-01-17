from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.referral import ReferralEvent
from app.models.user import User
from app.services.level_service import calc_level

REFERRAL_REWARD = 50

async def apply_referral(db: AsyncSession, inviter_id: int, invited_id: int):
    event = ReferralEvent(inviter_id=inviter_id, invited_id=invited_id, reward=REFERRAL_REWARD)
    db.add(event)

    inviter = await db.get(User, inviter_id)
    inviter.exp = (inviter.exp or 0) + REFERRAL_REWARD
    inviter.level = calc_level(inviter.exp)

    await db.commit()

