#!/usr/bin/env python3
import asyncio
from app.database import AsyncSessionLocal, init_db
from app import models
from passlib.context import CryptContext

pwd = CryptContext(schemes=['bcrypt'], deprecated='auto')

async def main():
    await init_db()
    async with AsyncSessionLocal() as session:
        q = await session.execute(models.User.__table__.select().where(models.User.email=='admin@washapp.local'))
        row = q.first()
        if row:
            user = row[0]
            user.is_admin = True
            # Обрезаем пароль до 72 символов
            user.password_hash = pwd.hash('AdminPassword123'[:72])
            print('Admin exists; promoted and password set.')
        else:
            # Обрезаем пароль до 72 символов
            u = models.User(
                email='admin@washapp.local', 
                name='Admin', 
                is_admin=True, 
                password_hash=pwd.hash('AdminPassword123'[:72])  # ← обрезаем
            )
            session.add(u)
            print('Admin created with default password admin@washapp.local / AdminPassword123')
        await session.commit()

if __name__ == '__main__':
    asyncio.run(main())