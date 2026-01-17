import client from "./client";

export type SubscriptionPlan = {
  id: string;
  label: string;
  washes: number;
  price: number;
  description?: string;
  is_night_only?: boolean;
};

export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  const res = await client.get("/api/subscriptions/plans");
  return res.data;
}

