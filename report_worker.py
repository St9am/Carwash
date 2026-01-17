# entrypoint module so docker CMD ["python","-m","app.workers.report_worker"] works
import json
import pika
import os
from app.database import async_session_maker
from app.services.report_service import generate_monthly_report

RABBIT_HOST = os.getenv("RABBIT_HOST", "rabbitmq")

def main():
    conn = pika.BlockingConnection(pika.ConnectionParameters(RABBIT_HOST))
    ch = conn.channel()
    ch.queue_declare(queue="reports", durable=True)

    def callback(ch, method, properties, body):
        payload = json.loads(body)
        network_id = payload.get("network_id")
        import asyncio
        async def run():
            async with async_session_maker() as db:
                await generate_monthly_report(db, network_id)
        asyncio.run(run())
        ch.basic_ack(delivery_tag=method.delivery_tag)

    ch.basic_consume(queue="reports", on_message_callback=callback)
    print("Report worker started, waiting for messages...")
    ch.start_consuming()

if __name__ == "__main__":
    main()

