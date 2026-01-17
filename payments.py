from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.dependencies import get_current_user, get_db
from app.schemas import PaymentCreateRequest
from app.services.subscription_service import create_subscription_for_plan, get_plan
from app.services.yookassa_service import create_payment, get_payment
from app.utils import publish_event

router = APIRouter()


def _ensure_yookassa_configured():
    if not settings.YOOKASSA_SHOP_ID or not settings.YOOKASSA_SECRET_KEY:
        raise HTTPException(status_code=503, detail="YooKassa credentials are not configured")


@router.post("/create")
async def create_yookassa_payment(payload: PaymentCreateRequest, user=Depends(get_current_user)):
    _ensure_yookassa_configured()
    plan = get_plan(payload.plan_id)
    if not plan:
        raise HTTPException(status_code=400, detail="Unknown subscription plan")

    payment = await create_payment(
        amount=Decimal(plan["price"]),
        description=plan["description"],
        return_url=payload.return_url,
        metadata={
            "user_id": user.id,
            "plan_id": payload.plan_id,
        },
    )
    confirmation = payment.get("confirmation") or {}
    return {
        "payment_id": payment.get("id"),
        "status": payment.get("status"),
        "confirmation_url": confirmation.get("confirmation_url"),
    }


@router.get("/{payment_id}")
async def fetch_payment(payment_id: str):
    _ensure_yookassa_configured()
    payment = await get_payment(payment_id)
    return payment


@router.post("/webhook")
async def payment_webhook(payload: dict, db: AsyncSession = Depends(get_db)):
    event = payload.get("event")
    obj = payload.get("object") or {}
    if event == "payment.succeeded":
        metadata = obj.get("metadata") or {}
        user_id = metadata.get("user_id")
        plan_id = metadata.get("plan_id")
        payment_id = obj.get("id")
        if user_id and plan_id:
            await create_subscription_for_plan(
                db,
                user_id=int(user_id),
                plan_id=plan_id,
                payment_id=payment_id,
            )
        await publish_event("payments", obj)
    return {"status": "ok"}
