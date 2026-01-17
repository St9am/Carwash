import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.wash import WashSession
from app.models.user import User
from app.models.report import ReportFile
from app.pdf_reports.monthly_report import create_monthly_pdf

async def generate_monthly_report(db: AsyncSession, network_id: int) -> str:
    washes = await db.scalar(select(func.count(WashSession.id)))
    users = await db.scalar(select(func.count(User.id)))

    data = {
        "network": network_id,
        "washes": washes or 0,
        "users": users or 0,
    }

    filename = f"report_network{network_id}.pdf"
    out_path = f"/app/reports/{filename}"
    os.makedirs("/app/reports", exist_ok=True)

    create_monthly_pdf(out_path, data)

    record = ReportFile(filename=filename)
    db.add(record)
    await db.commit()

    return filename
