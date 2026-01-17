from datetime import datetime, timedelta
from typing import Dict, List, Optional

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models

SUBSCRIPTION_PLANS: Dict[str, Dict] = {
    "plan_5": {
        "label": "5 моек",
        "washes": 5,
        "price": 4000,
        "duration_days": 30,
        "description": "Тариф на 5 моек",
        "order": 1,
        "is_night_only": False,
    },
    "plan_10": {
        "label": "10 моек",
        "washes": 10,
        "price": 7000,
        "duration_days": 60,
        "description": "Тариф на 10 моек",
        "order": 2,
        "is_night_only": False,
    },
    "plan_15": {
        "label": "15 моек",
        "washes": 15,
        "price": 10000,
        "duration_days": 90,
        "description": "Тариф на 15 моек",
        "order": 3,
        "is_night_only": False,
    },
    "plan_30": {
        "label": "30 моек",
        "washes": 30,
        "price": 20000,
        "duration_days": 180,
        "description": "Тариф на 30 моек",
        "order": 4,
        "is_night_only": False,
    },
    "plan_5_night": {
        "label": "5 моек (ночной)",
        "washes": 5,
        "price": 3000,
        "duration_days": 30,
        "description": "Ночной тариф на 5 моек (00:00-06:00 МСК)",
        "order": 5,
        "is_night_only": True,
    },
    "plan_10_night": {
        "label": "10 моек (ночной)",
        "washes": 10,
        "price": 5500,
        "duration_days": 60,
        "description": "Ночной тариф на 10 моек (00:00-06:00 МСК)",
        "order": 6,
        "is_night_only": True,
    },
    "plan_15_night": {
        "label": "15 моек (ночной)",
        "washes": 15,
        "price": 8000,
        "duration_days": 90,
        "description": "Ночной тариф на 15 моек (00:00-06:00 МСК)",
        "order": 7,
        "is_night_only": True,
    },
    "plan_30_night": {
        "label": "30 моек (ночной)",
        "washes": 30,
        "price": 15000,
        "duration_days": 180,
        "description": "Ночной тариф на 30 моек (00:00-06:00 МСК)",
        "order": 8,
        "is_night_only": True,
    },
}


def list_subscription_plans() -> List[Dict]:
    return [
        {"id": plan_id, **data}
        for plan_id, data in sorted(SUBSCRIPTION_PLANS.items(), key=lambda item: item[1]["order"])
    ]


def get_plan(plan_id: str) -> Optional[Dict]:
    return SUBSCRIPTION_PLANS.get(plan_id)


async def create_subscription_for_plan(
    db: AsyncSession,
    user_id: int,
    plan_id: str,
    payment_id: Optional[str] = None,
) -> models.Subscription:
    plan = get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=400, detail="Unknown subscription plan")

    if payment_id:
        existing = await db.execute(select(models.Subscription).where(models.Subscription.payment_id == payment_id))
        found = existing.scalar_one_or_none()
        if found:
            return found

    expires_at = datetime.utcnow() + timedelta(days=plan.get("duration_days", 30))

    subscription = models.Subscription(
        user_id=user_id,
        plan=plan_id,
        price=plan["price"],
        remaining_washes=plan["washes"],
        expires_at=expires_at,
        payment_id=payment_id,
        is_night_only=plan.get("is_night_only", False),
    )
    db.add(subscription)
    await db.commit()
    await db.refresh(subscription)
    return subscription

