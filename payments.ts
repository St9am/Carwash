import client from "./client";

export async function createPayment(planId: string) {
  const res = await client.post("/api/payments/create", { plan_id: planId });
  return res.data as {
    payment_id: string;
    status: string;
    confirmation_url?: string;
  };
}

