from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from cryptography.fernet import Fernet
import json

from app.api.admin.deps import admin_required, get_db
from app.models.carwash import CarWash

router = APIRouter(prefix="/carwashes")


def sign_qr_with_key(carwash_id: int, network_id: int, key: str) -> str:
    f = Fernet(key.encode())
    payload = {'carwash_id': carwash_id, 'network_id': network_id}
    return f.encrypt(json.dumps(payload).encode()).decode()


@router.get("")
async def list_carwashes(admin=Depends(admin_required), db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(CarWash))
    return q.scalars().all()


@router.post("")
async def create_carwash(data: dict, admin=Depends(admin_required), db: AsyncSession = Depends(get_db)):
    required = {"network_id", "name", "ip", "port"}
    missing = required - data.keys()
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {', '.join(sorted(missing))}")
    
    key = Fernet.generate_key().decode()
    cw = CarWash(
        network_id=data["network_id"],
        name=data["name"],
        ip=data["ip"],
        port=data["port"],
        fernet_key=key,
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
    )
    db.add(cw)
    await db.commit()
    await db.refresh(cw)
    return cw


@router.put("/{carwash_id}")
async def update_carwash(
    carwash_id: int,
    data: dict,
    admin=Depends(admin_required),
    db: AsyncSession = Depends(get_db)
):
    cw = await db.get(CarWash, carwash_id)
    if not cw:
        raise HTTPException(status_code=404, detail='Carwash not found')
    
    # Обновляем только переданные поля
    if "name" in data:
        cw.name = data["name"]
    if "ip" in data:
        cw.ip = data["ip"]
    if "port" in data:
        cw.port = data["port"]
    if "network_id" in data:
        cw.network_id = data["network_id"]
    if "latitude" in data:
        cw.latitude = data["latitude"] if data["latitude"] else None
    if "longitude" in data:
        cw.longitude = data["longitude"] if data["longitude"] else None
    if "active" in data:
        cw.active = data["active"]
    
    await db.commit()
    await db.refresh(cw)
    return cw


@router.get("/generate_qr/{carwash_id}")
async def generate_qr(carwash_id: int, admin=Depends(admin_required), db: AsyncSession = Depends(get_db)):
    cw = await db.get(CarWash, carwash_id)
    if not cw:
        raise HTTPException(status_code=404, detail='Carwash not found')
    
    token = sign_qr_with_key(cw.id, cw.network_id, cw.fernet_key)
    return {'qr_token': token}