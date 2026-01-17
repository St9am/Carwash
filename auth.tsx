import client from "./client";

type TelegramUserPayload = {
  id?: number;
  name?: string;
};

export async function registerUser(initData: string, refCode?: string, tgUser?: TelegramUserPayload) {
  const payload = {
    init_data: initData,
    referral_code: refCode || null,
    telegram_id: tgUser?.id,
    name: tgUser?.name || null,
  };

  const res = await client.post("/api/auth/register", payload);
  const token = res.data.access_token;

  if (token) {
    localStorage.setItem("tg_token", token);
  }
  return res.data;
}

export async function me() {
  const res = await client.get("/api/auth/me");
  return res.data;
}
