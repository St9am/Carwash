import asyncio
from decimal import Decimal
from typing import Any, Dict, Optional
from uuid import uuid4

from yookassa import Configuration, Payment

from app.core.config import settings


def _ensure_configuration() -> None:
    """
    Lazily set YooKassa credentials so we can call it from any worker/request.
    """
    if not Configuration.account_id or Configuration.account_id != settings.YOOKASSA_SHOP_ID:
        Configuration.account_id = settings.YOOKASSA_SHOP_ID
        Configuration.secret_key = settings.YOOKASSA_SECRET_KEY


async def create_payment(
    amount: Decimal,
    description: str,
    return_url: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Spawn blocking YooKassa client in a thread and return the raw payment dict.
    """

    def _create():
        _ensure_configuration()
        payload = {
            "amount": {"value": f"{amount:.2f}", "currency": "RUB"},
            "confirmation": {
                "type": "redirect",
                "return_url": return_url or settings.YOOKASSA_RETURN_URL,
            },
            "capture": True,
            "description": description[:128],
        }
        if metadata:
            payload["metadata"] = metadata
        return Payment.create(payload, idempotence_key=str(uuid4()))

    payment = await asyncio.to_thread(_create)
    return payment.to_dict()


async def get_payment(payment_id: str) -> Dict[str, Any]:
    def _get():
        _ensure_configuration()
        return Payment.find_one(payment_id)

    payment = await asyncio.to_thread(_get)
    return payment.to_dict()

