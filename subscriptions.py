from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_db
from app.schemas import SubscriptionCreate
from app.services.subscription_service import create_subscription_for_plan, list_subscription_plans

router = APIRouter()


@router.get("/plans")
async def subscription_plans():
    return list_subscription_plans()


@router.post("/buy")
async def buy_subscription(
    payload: SubscriptionCreate,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user),
):
    sub = await create_subscription_for_plan(
        db,
        user_id=user.id,
        plan_id=payload.plan_id,
        payment_id=payload.payment_id,
    )
    return {"subscription_id": sub.id, "expires_at": sub.expires_at}
