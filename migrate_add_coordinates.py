#!/usr/bin/env python3
"""
Миграция: добавление колонок latitude и longitude в таблицу carwashes
и is_night_only в таблицу subscriptions
"""
import asyncio
from sqlalchemy import text
from app.database import engine


async def migrate():
    """Добавляет недостающие колонки в БД"""
    async with engine.begin() as conn:
        # Проверяем и добавляем колонки в carwashes
        try:
            await conn.execute(text("""
                ALTER TABLE carwashes 
                ADD COLUMN IF NOT EXISTS latitude FLOAT;
            """))
            print("✓ Колонка carwashes.latitude добавлена")
        except Exception as e:
            print(f"⚠ Ошибка при добавлении latitude: {e}")

        try:
            await conn.execute(text("""
                ALTER TABLE carwashes 
                ADD COLUMN IF NOT EXISTS longitude FLOAT;
            """))
            print("✓ Колонка carwashes.longitude добавлена")
        except Exception as e:
            print(f"⚠ Ошибка при добавлении longitude: {e}")

        # Проверяем и добавляем колонку в subscriptions
        try:
            await conn.execute(text("""
                ALTER TABLE subscriptions 
                ADD COLUMN IF NOT EXISTS is_night_only BOOLEAN DEFAULT FALSE;
            """))
            print("✓ Колонка subscriptions.is_night_only добавлена")
        except Exception as e:
            print(f"⚠ Ошибка при добавлении is_night_only: {e}")

    print("\n✅ Миграция завершена!")


if __name__ == '__main__':
    asyncio.run(migrate())

