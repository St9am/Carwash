from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/autowash_db"
    RABBITMQ_URL: str = "amqp://guest:guest@rabbitmq:5672/"
    JWT_SECRET: str = "change_me_to_secure_random"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXP_SECONDS: int = 86400
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASS: str = ""
    SMTP_FROM: str = "noreply@yourdomain"
    BOT_TOKEN: str = ""
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    ENVIRONMENT: str = "development"
    REPORTS_PATH: str = "/app/reports"
    YOOKASSA_SHOP_ID: str = ""
    YOOKASSA_SECRET_KEY: str = ""
    YOOKASSA_RETURN_URL: str = "https://example.com/payments/return"

    class Config:
        env_file = ".env"

settings = Settings()
