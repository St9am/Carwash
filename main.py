from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, carwash, payments, subscriptions
from app.api.admin import router as admin_router
from app.core.config import settings
from app.database import init_db

app = FastAPI(title="AutoWash+")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else [settings.FRONTEND_ORIGIN],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Public API
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(subscriptions.router, prefix="/api/subscriptions", tags=["subscriptions"])
app.include_router(carwash.router, prefix="/api/carwash", tags=["carwash"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])

# Admin API (mounted under /api/admin)
app.include_router(admin_router, prefix="/api", tags=["Admin"])


@app.on_event("startup")
async def on_startup():
    await init_db()

