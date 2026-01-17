from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

def create_monthly_pdf(path: str, data: dict):
    c = canvas.Canvas(path, pagesize=A4)

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 800, "AutoWash+ — Monthly Report")

    c.setFont("Helvetica", 12)
    c.drawString(50, 760, f"Network ID: {data['network']}")
    c.drawString(50, 740, f"Total Washes: {data['washes']}")
    c.drawString(50, 720, f"Active Users: {data['users']}")

    c.showPage()
    c.save()
