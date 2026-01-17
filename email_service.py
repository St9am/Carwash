import asyncio
import smtplib
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings


async def send_report_email(to_email: str, pdf_path: str):
    def _send():
        msg = MIMEMultipart()
        msg["Subject"] = "AutoWash+ Monthly Report"
        msg["From"] = settings.SMTP_FROM
        msg["To"] = to_email

        msg.attach(MIMEText("Отчёт за месяц прикреплён."))

        with open(pdf_path, "rb") as f:
            attach = MIMEApplication(f.read(), _subtype="pdf")
            attach.add_header("Content-Disposition", "attachment", filename=pdf_path.split("/")[-1])
            msg.attach(attach)

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
            if settings.SMTP_USER:
                smtp.login(settings.SMTP_USER, settings.SMTP_PASS)
            smtp.send_message(msg)

    await asyncio.to_thread(_send)
