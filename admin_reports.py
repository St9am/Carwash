from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.admin.deps import admin_required, get_db
from app.services.report_service import generate_monthly_report
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/reports")

@router.post("/generate")
async def generate_report(network_id: int, admin=Depends(admin_required), db: AsyncSession = Depends(get_db)):
    filename = await generate_monthly_report(db, network_id)
    return {"filename": filename}

@router.get("/download")
async def download(file: str):
    path = f"/app/reports/{file}"
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    return FileResponse(path, media_type="application/pdf")
