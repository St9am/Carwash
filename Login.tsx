
import React, { useEffect } from "react";
import { Card, Title, Text, Spinner } from "@telegram-apps/telegram-ui";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { LogIn, CheckCircle, Shield } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const primaryColor = "var(--tg-theme-button-color, #0077ff)";

  useEffect(() => {
    async function run() {
      try {
        const tg = (window as any).Telegram?.WebApp;
        if (!tg) throw new Error("Telegram WebApp не инициализирован");
        tg.ready();

        const initData = tg.initData || "";
        const refCode = new URLSearchParams(window.location.search).get("ref");
        const user = tg.initDataUnsafe?.user;

        await registerUser(initData, refCode || undefined, {
          id: user?.id,
          name: [user?.first_name, user?.last_name].filter(Boolean).join(" "),
        });
        setTimeout(() => navigate("/home"), 1000);
      } catch (e: any) {
        alert("Ошибка входа: " + (e?.response?.data?.detail || e.message));
      }
    }

    run();
  }, []);

  return (
    <div style={{
      padding: "20px 16px",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f8fbff 0%, #ffffff 100%)"
    }}>
      <div style={{
        maxWidth: "400px",
        width: "100%"
      }}>
        <Card mode="outline" style={{
          padding: "48px 32px",
          borderRadius: "28px",
          border: "none",
          background: "white",
          boxShadow: "0 20px 60px rgba(0, 119, 255, 0.15)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Декоративные элементы */}
          <div style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "200px",
            height: "200px",
            borderRadius: "100px",
            background: `linear-gradient(135deg, ${primaryColor}10 0%, #00a8ff10 100%)`,
            filter: "blur(40px)"
          }} />
          
          <div style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "160px",
            height: "160px",
            borderRadius: "80px",
            background: `linear-gradient(135deg, ${primaryColor}05 0%, #00a8ff05 100%)`,
            filter: "blur(30px)"
          }} />

          {/* Иконка */}
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "24px",
            background: `linear-gradient(135deg, ${primaryColor} 0%, #00a8ff 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px auto",
            boxShadow: `0 12px 32px ${primaryColor}40`,
            position: "relative",
            zIndex: "1"
          }}>
            <LogIn size={36} color="white" />
          </div>

          {/* Текст */}
          <div style={{
            marginBottom: "32px",
            position: "relative",
            zIndex: "1"
          }}>
            <Title level={2} style={{
              marginBottom: "12px",
              fontSize: "32px",
              background: `linear-gradient(135deg, ${primaryColor} 0%, #00a8ff 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "800"
            }}>
              AutoWash+
            </Title>
            
            <Title level={3} style={{
              marginBottom: "16px",
              fontSize: "24px",
              color: "var(--tg-theme-text-color, #000)",
              fontWeight: "600"
            }}>
              Входим через Telegram…
            </Title>
            
            <Text style={{
              fontSize: "16px",
              color: "var(--tg-theme-hint-color, #8e8e93)",
              lineHeight: "1.6"
            }}>
              Авторизация в один клик. Это займет всего несколько секунд.
            </Text>
          </div>

          {/* Спиннер */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            position: "relative",
            zIndex: "1"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "30px",
              background: `linear-gradient(135deg, ${primaryColor}15 0%, #00a8ff15 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${primaryColor}30`
            }}>
              <Spinner size="m" style={{ color: primaryColor }} />
            </div>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "4px",
                background: primaryColor,
                animation: "pulse 1.4s ease-in-out infinite"
              }} />
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "4px",
                background: primaryColor,
                animation: "pulse 1.4s ease-in-out infinite 0.2s"
              }} />
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "4px",
                background: primaryColor,
                animation: "pulse 1.4s ease-in-out infinite 0.4s"
              }} />
            </div>
          </div>

          {/* Подсказка */}
          <div style={{
            marginTop: "40px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(0, 119, 255, 0.1)",
            position: "relative",
            zIndex: "1"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "8px"
            }}>
              <Shield size={16} color={primaryColor} />
              <Text style={{
                fontSize: "12px",
                color: "var(--tg-theme-hint-color, #8e8e93)",
                fontWeight: "500"
              }}>
                Безопасная авторизация
              </Text>
            </div>
            <Text style={{
              fontSize: "12px",
              color: "var(--tg-theme-hint-color, #8e8e93)",
              opacity: 0.7
            }}>
              Ваши данные защищены протоколом Telegram
            </Text>
          </div>
        </Card>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.4;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}