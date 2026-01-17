
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Title, Text, Button, Spinner } from "@telegram-apps/telegram-ui";
import Navbar from "../components/Navbar";
import { createPayment } from "../api/payments";
import { fetchPlans, SubscriptionPlan } from "../api/subscriptions";
import { Sparkles, Zap, Crown, Moon, Sun, Gem } from "lucide-react";

const FALLBACK_PLANS: SubscriptionPlan[] = [
  { id: "plan_10", label: "10 моек", washes: 10, price: 7000 },
  { id: "plan_15", label: "15 моек", washes: 15, price: 10000 },
  { id: "plan_30", label: "30 моек", washes: 30, price: 20000 },
];

export default function Subscriptions() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["subscription_plans"],
    queryFn: fetchPlans,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const allPlans = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }
    return FALLBACK_PLANS;
  }, [data]);

  const plans = useMemo(() => {
    return allPlans.filter(plan => 
      isNightMode ? plan.is_night_only : !plan.is_night_only
    );
  }, [allPlans, isNightMode]);

  const primaryColor = isNightMode ? "#9b59b6" : "var(--tg-theme-button-color, #0077ff)";
  const shadowColor = isNightMode ? "rgba(155, 89, 182, 0.25)" : "rgba(0, 119, 255, 0.15)";

  async function buy(planId: string) {
    setLoadingPlan(planId);
    try {
      const res = await createPayment(planId);
      if (res.confirmation_url) {
        window.location.href = res.confirmation_url;
      } else {
        alert("Не удалось получить ссылку на оплату");
      }
    } catch (e: any) {
      alert(e?.response?.data?.detail || e.message);
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div style={{ 
      padding: "20px 16px 100px 16px", 
      minHeight: "100vh", 
      boxSizing: "border-box",
      background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)"
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <Card style={{ 
          marginBottom: 16, 
          padding: "28px 24px",
          width: "100%",
          boxSizing: "border-box",
          background: "white",
          borderRadius: "24px",
          border: "none",
          boxShadow: "0 8px 32px rgba(0, 119, 255, 0.08)"
        }}>
          {/* Заголовок */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "24px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${isNightMode ? "#8e44ad" : "#00a8ff"} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Crown size={24} color="white" />
            </div>
            <Title level="2" style={{ 
              margin: 0,
              fontSize: "28px",
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${isNightMode ? "#8e44ad" : "#00a8ff"} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "700"
            }}>
              Тарифы
            </Title>
          </div>

          {/* Тумблер переключения */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
            padding: "16px",
            background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
            borderRadius: "16px",
            border: "1px solid rgba(0, 119, 255, 0.1)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: !isNightMode ? 1 : 0.5,
              transition: "all 0.3s ease"
            }}>
              <Sun size={20} color={!isNightMode ? primaryColor : "#999"} />
              <Text style={{
                fontSize: "15px",
                color: !isNightMode ? primaryColor : "var(--tg-theme-hint-color, #999)",
                fontWeight: !isNightMode ? "600" : "400",
              }}>
                Полные
              </Text>
            </div>
            
            <div
              onClick={() => setIsNightMode(!isNightMode)}
              style={{
                width: "60px",
                height: "32px",
                borderRadius: "16px",
                background: isNightMode ? primaryColor : "#ddd",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: `2px solid ${isNightMode ? primaryColor + "40" : "#ddd"}`
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: "2px",
                  left: isNightMode ? "calc(100% - 26px)" : "2px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {isNightMode ? 
                  <Moon size={12} color={primaryColor} /> : 
                  <Sun size={12} color="#0077ff" />
                }
              </div>
            </div>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: isNightMode ? 1 : 0.5,
              transition: "all 0.3s ease"
            }}>
              <Moon size={20} color={isNightMode ? primaryColor : "#999"} />
              <Text style={{
                fontSize: "15px",
                color: isNightMode ? primaryColor : "var(--tg-theme-hint-color, #999)",
                fontWeight: isNightMode ? "600" : "400",
              }}>
                Ночные
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
          
          {isError && (
            <div style={{ 
              padding: "20px", 
              textAlign: "center",
              background: "rgba(255, 59, 48, 0.1)",
              borderRadius: "16px",
              marginBottom: "24px",
              border: "1px solid rgba(255, 59, 48, 0.2)"
            }}>
              <Text style={{
                color: "#ff3b30",
                fontSize: "14px"
              }}>
                ⚠️ Ошибка загрузки тарифов. Используются базовые тарифы.
              </Text>
            </div>
          )}
          
          {/* Планы */}
          <div style={{ 
            display: "grid", 
            gap: "20px",
            marginBottom: "32px"
          }}>
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                style={{ 
                  position: "relative",
                  padding: "24px 20px",
                  textAlign: "center",
                  background: "white",
                  borderRadius: "20px",
                  border: `2px solid ${hoveredPlan === plan.id ? primaryColor + "80" : primaryColor + "20"}`,
                  boxShadow: hoveredPlan === plan.id 
                    ? `0 12px 40px ${shadowColor}`
                    : `0 4px 20px ${shadowColor}`,
                  transform: hoveredPlan === plan.id ? "translateY(-4px) scale(1.02)" : "translateY(0)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  overflow: "hidden"
                }}
              >
                {/* Декоративный элемент */}
                <div style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  width: "60px",
                  height: "60px",
                  background: `linear-gradient(135deg, ${primaryColor}10 0%, ${primaryColor}05 100%)`,
                  borderRadius: "0 20px 0 60px"
                }} />
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "16px"
                }}>
                  <Zap size={20} color={primaryColor} />
                  <Title level="3" style={{ 
                    margin: 0,
                    fontSize: "20px",
                    color: primaryColor,
                    fontWeight: "700"
                  }}>
                    {plan.label}
                  </Title>
                </div>
                
                <div style={{
                  marginBottom: "20px"
                }}>
                  <div style={{
                    fontSize: "32px",
                    fontWeight: "800",
                    color: primaryColor,
                    marginBottom: "4px",
                    lineHeight: "1"
                  }}>
                    {plan.price.toLocaleString("ru-RU")} ₽
                  </div>
                  <Text style={{
                    fontSize: "14px",
                    color: "var(--tg-theme-hint-color, #8e8e93)"
                  }}>
                    {plan.washes} моек • {Math.round(plan.price / plan.washes)} ₽/мойка
                  </Text>
                </div>
                
                <Button
                  size="m"
                  stretched
                  mode="filled"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${isNightMode ? "#8e44ad" : "#00a8ff"} 100%)`,
                    color: "white",
                    borderRadius: "12px",
                    fontWeight: "600",
                    fontSize: "16px",
                    height: "48px",
                    border: "none",
                    boxShadow: hoveredPlan === plan.id 
                      ? `0 8px 20px ${shadowColor}` 
                      : `0 4px 12px ${shadowColor}`,
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => buy(plan.id)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? (
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      gap: "8px"
                    }}>
                      <Spinner size="s" style={{ color: "white" }} />
                      Ожидание...
                    </div>
                  ) : (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}>
                      💳 Оплатить
                    </div>
                  )}
                </Button>
                
                {plan.washes >= 30 && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${isNightMode ? "#8e44ad" : "#00a8ff"} 100%)`,
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <Sparkles size={10} /> Выгодно
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Информационная панель */}
          <div style={{ 
            padding: "20px",
            background: isNightMode 
              ? `linear-gradient(135deg, ${primaryColor}10 0%, #8e44ad10 100%)`
              : `linear-gradient(135deg, ${primaryColor}08 0%, #00a8ff08 100%)`,
            borderRadius: "16px",
            border: `1px solid ${primaryColor}20`
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px"
            }}>
              {isNightMode ? (
                <>
                  <Moon size={20} color={primaryColor} />
                  <Text style={{ 
                    textAlign: "center", 
                    color: primaryColor,
                    fontSize: "15px",
                    fontWeight: "600"
                  }}>
                    🌙 Ночной тариф действует с 00:00 до 06:00 (МСК)
                  </Text>
                </>
              ) : (
                <>
                  <Gem size={20} color={primaryColor} />
                  <Text style={{ 
                    textAlign: "center", 
                    color: primaryColor,
                    fontSize: "15px",
                    fontWeight: "600"
                  }}>
                    💰 Выгоднее покупать больше — экономьте до 30%
                  </Text>
                </>
              )}
            </div>
          </div>
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
        <a href="/referral" style={{
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
          <i data-lucide="users" style={{ width: "24px", height: "24px" }}></i>
          Рефералы
        </a>
        <a href="/profile" style={{
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
          <i data-lucide="user" style={{ width: "24px", height: "24px" }}></i>
          Профиль
        </a>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/lucide/1.3.0/lucide.min.js"></script>
      <script>lucide.createIcons();</script>
    </div>
  );
}