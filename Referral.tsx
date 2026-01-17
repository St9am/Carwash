
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Title, Text, Input, Button, Spinner } from "@telegram-apps/telegram-ui";
import Navbar from "../components/Navbar";
import { me } from "../api/auth";
import { Copy, Link, Users } from "lucide-react";

export default function Referral() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: me,
  });

  const link = user?.referral_code ? `https://t.me/YOUR_BOT?start=${user.referral_code}` : "";
  const primaryColor = "var(--tg-theme-button-color, #0077ff)";

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      alert("✅ Ссылка скопирована в буфер");
    } catch {
      alert("📋 Скопируйте ссылку вручную");
    }
  }

  return (
    <div style={{
      padding: "20px 16px 100px 16px",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)"
    }}>
      <div style={{
        maxWidth: "500px",
        margin: "0 auto"
      }}>
        <Card mode="outline" style={{
          padding: "28px 24px",
          borderRadius: "24px",
          border: "none",
          background: "white",
          boxShadow: "0 8px 32px rgba(0, 119, 255, 0.08)",
          marginBottom: "20px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: `linear-gradient(135deg, ${primaryColor} 0%, #00a8ff 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Users size={24} color="white" />
            </div>
            <div>
              <Title level={2} style={{
                margin: 0,
                fontSize: "24px",
                background: `linear-gradient(135deg, ${primaryColor} 0%, #00a8ff 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700"
              }}>
                Реферальная система
              </Title>
              <Text style={{
                fontSize: "14px",
                color: "var(--tg-theme-hint-color, #8e8e93)",
                marginTop: "4px"
              }}>
                Приглашайте друзей и получайте бонусы
              </Text>
            </div>
          </div>

          {isLoading && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px 0"
            }}>
              <Spinner size="m" style={{ color: primaryColor }} />
            </div>
          )}

          {!isLoading && user && (
            <>
              {/* Код */}
              <div style={{
                background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "20px",
                border: "1px solid rgba(0, 119, 255, 0.1)"
              }}>
                <Text style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "var(--tg-theme-hint-color, #8e8e93)",
                  marginBottom: "8px"
                }}>
                  <Link size={16} />
                  Ваш реферальный код
                </Text>
                <div style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  color: primaryColor,
                  textAlign: "center",
                  padding: "12px",
                  background: "white",
                  borderRadius: "12px",
                  border: `2px dashed ${primaryColor}20`,
                  fontFamily: "'Courier New', monospace"
                }}>
                  {user.referral_code || "—"}
                </div>
              </div>

              {/* Ссылка */}
              <div style={{
                background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "24px",
                border: "1px solid rgba(0, 119, 255, 0.1)"
              }}>
                <Text style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "var(--tg-theme-hint-color, #8e8e93)",
                  marginBottom: "12px"
                }}>
                  <Link size={16} />
                  Реферальная ссылка
                </Text>
                <div style={{ position: "relative" }}>
                  <Input
                    value={link}
                    readOnly
                    style={{
                      paddingRight: "50px",
                      borderRadius: "12px",
                      border: "1px solid rgba(0, 119, 255, 0.2)",
                      background: "white",
                      fontSize: "14px"
                    }}
                  />
                  <Button
                    size="s"
                    mode="filled"
                    style={{
                      position: "absolute",
                      right: "4px",
                      top: "4px",
                      bottom: "4px",
                      background: primaryColor,
                      borderRadius: "8px",
                      padding: "0 16px"
                    }}
                    onClick={copyLink}
                    disabled={!link}
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </div>

              {/* Инфо блок */}
              <div style={{
                background: `linear-gradient(135deg, ${primaryColor}10 0%, #00a8ff10 100%)`,
                borderRadius: "16px",
                padding: "20px",
                border: `1px solid ${primaryColor}20`
              }}>
                <Text style={{
                  fontSize: "14px",
                  color: "var(--tg-theme-text-color, #000)",
                  lineHeight: "1.5",
                  textAlign: "center"
                }}>
                  📈 Отправьте ссылку другу и получите <span style={{
                    color: primaryColor,
                    fontWeight: "600"
                  }}>+50 EXP</span> за каждого приглашенного
                </Text>
              </div>
            </>
          )}
        </Card>
      </div>
      
      {/* Навбар */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        right: "20px",
        background: "white",
        borderRadius: "20px",
        padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(0, 119, 255, 0.15)",
        display: "flex",
        justifyContent: "space-between",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 119, 255, 0.1)",
        zIndex: 1000
      }}>
        <a href="/" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "#8e8e93",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          padding: "4px 8px",
          borderRadius: "10px",
          minWidth: "60px"
        }}>
          <i data-lucide="home" style={{ width: "24px", height: "24px" }}></i>
          Главная
        </a>
        <a href="/levels" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "#8e8e93",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          padding: "4px 8px",
          borderRadius: "10px",
          minWidth: "60px"
        }}>
          <i data-lucide="trending-up" style={{ width: "24px", height: "24px" }}></i>
          Уровни
        </a>
        <a href="#" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "#0077ff",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: "600",
          background: "linear-gradient(135deg, rgba(0, 119, 255, 0.1) 0%, rgba(0, 168, 255, 0.1) 100%)",
          padding: "4px 8px",
          borderRadius: "10px",
          minWidth: "60px"
        }}>
          <i data-lucide="users" style={{ width: "24px", height: "24px" }}></i>
          Рефералы
        </a>
        <a href="/profile" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "#8e8e93",
          textDecoration: "none",
          fontSize: "12px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          padding: "4px 8px",
          borderRadius: "10px",
          minWidth: "60px"
        }}>
          <i data-lucide="user" style={{ width: "24px", height: "24px" }}></i>
          Профиль
        </a>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/lucide/1.3.0/lucide.min.js"></script>
      <script>lucide.createIcons();</script>
    </div>
  );
}