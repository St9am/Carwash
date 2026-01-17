import aio_pika, json
from app.core.config import settings
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from io import BytesIO

async def get_rabbit_connection():
    return await aio_pika.connect_robust(settings.RABBITMQ_URL)

async def publish_event(routing_key: str, message: dict):
    conn = await get_rabbit_connection()
    async with conn:
        channel = await conn.channel()
        await channel.default_exchange.publish(
            aio_pika.Message(body=json.dumps(message).encode()),
            routing_key=routing_key
        )

def generate_simple_pdf_report(title: str, rows: list[dict]) -> bytes:
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, 800, title)
    c.setFont("Helvetica", 11)
    y = 760
    for r in rows:
        line = ", ".join(f"{k}:{v}" for k,v in r.items())
        c.drawString(72, y, line)
        y -= 16
        if y < 72:
            c.showPage()
            y = 800
    c.save()
    buf.seek(0)
    return buf.read()
