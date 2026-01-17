
import React from "react";
import { Card, Title, Text } from "@telegram-apps/telegram-ui";
import Navbar from "../components/Navbar";
import { TrendingUp, Users, Award, Target, Star, Zap } from "lucide-react";

export default function Levels() {
  const primaryColor = "var(--tg-theme-button-color, #0077ff)";
  
  const levels = [
    { level: 1, exp: 0, reward: "Базовый доступ", icon: "👶" },
    { level: 5, exp: 500, reward: "+10% к EXP за рефералов", icon: "🚀" },
    { level: 10, exp: 1000, reward: "VIP статус + скидка 5%", icon: "👑" },
    { level: 20, exp: 2000, reward: "Персональная скидка 10%", icon: "💎" },
    { level: 30, exp: 3000, reward: "Эксклюзивный доступ", icon: "🌟" },
  ];

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
          {/* Заголовок */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px"
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
              <TrendingUp size={24} color="white" />
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
                Уровни и опыт
              </Title>
              <Text style={{
                fontSize: "14px",
                color: "var(--tg-theme-hint-color, #8e8e93)",
                marginTop: "4px"
              }}>
                Повышайте уровень и получайте бонусы
              </Text>
            </div>
          </div>

          {/* Формула расчета */}
          <div style={{
            background: `linear-gradient(135deg, ${primaryColor}08 0%, #00a8ff08 100%)`,
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
            border: `1px solid ${primaryColor}20`,
            textAlign: "center"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "16px"
            }}>
              <Target size={24} color={primaryColor} />
              <Title level={3} style={{
                margin: 0,
                fontSize: "20px",
                color: primaryColor,
                fontWeight: "600"
              }}>
                Формула расчета
              </Title>
            </div>
            <div style={{
              fontSize: "32px",
              fontWeight: "800",
              color: primaryColor,
              marginBottom: "8px"
            }}>
              Уровень = EXP ÷ 100
            </div>
            <Text style={{
              fontSize: "16px",
              color: "var(--tg-theme-text-color, #000)"
            }}>
              Каждые 100 EXP повышают ваш уровень на 1
            </Text>
          </div>

          {/* Бонусы */}
          <div style={{
            background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
            border: "1px solid rgba(0, 119, 255, 0.1)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px"
            }}>
              <Users size={24} color={primaryColor} />
              <Title level={3} style={{
                margin: 0,
                fontSize: "20px",
                color: primaryColor,
                fontWeight: "600"
              }}>
                Реферальные бонусы
              </Title>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              padding: "20px",
              background: "white",
              borderRadius: "16px",
              border: `2px solid ${primaryColor}20`
            }}>
              <div style={{
                fontSize: "48px",
                fontWeight: "800",
                color: primaryColor,
                lineHeight: "1"
              }}>
                +50
              </div>
              <div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px"
                }}>
                  <Star size={24} color={primaryColor} />
                  <div style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: primaryColor
                  }}>
                    EXP
                  </div>
                </div>
                <Text style={{
                  fontSize: "14px",
                  color: "var(--tg-theme-hint-color, #8e8e93)"
                }}>
                  за каждого друга
                </Text>
              </div>
            </div>
          </div>

          {/* Уровни */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px"
            }}>
              <Award size={24} color={primaryColor} />
              <Title level={3} style={{
                margin: 0,
                fontSize: "20px",
                color: primaryColor,
                fontWeight: "600"
              }}>
                Уровни и награды
              </Title>
            </div>
            
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              {levels.map((item, index) => (
                <div 
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px",
                    background: index % 2 === 0 ? "white" : "var(--tg-theme-secondary-bg-color, #f8f9fa)",
                    borderRadius: "16px",
                    border: `1px solid ${primaryColor}${index < 2 ? "20" : "40"}`,
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Декоративная полоска */}
                  <div style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    bottom: "0",
                    width: "4px",
                    background: index < 2 
                      ? primaryColor 
                      : `linear-gradient(180deg, ${primaryColor} 0%, #00a8ff 100%)`
                  }} />
                  
                  <div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "4px"
                    }}>
                      <div style={{
                        fontSize: "24px"
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <Text style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "var(--tg-theme-text-color, #000)"
                        }}>
                          Уровень {item.level}
                        </Text>
                        <Text style={{
                          fontSize: "14px",
                          color: "var(--tg-theme-hint-color, #8e8e93)"
                        }}>
                          {item.reward}
                        </Text>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    textAlign: "right"
                  }}>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: primaryColor,
                      marginBottom: "4px"
                    }}>
                      {item.exp.toLocaleString("ru-RU")} EXP
                    </div>
                    <Text style={{
                      fontSize: "12px",
                      color: "var(--tg-theme-hint-color, #8e8e93)"
                    }}>
                      требуется
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Советы */}
          <div style={{
            marginTop: "32px",
            padding: "20px",
            background: `linear-gradient(135deg, ${primaryColor}08 0%, #00a8ff08 100%)`,
            borderRadius: "16px",
            border: `1px solid ${primaryColor}20`
          }}>
            <Text style={{
              fontSize: "14px",
              color: "var(--tg-theme-text-color, #000)",
              lineHeight: "1.6",
              textAlign: "center"
            }}>
              <Zap size={16} color={primaryColor} style={{ marginRight: "8px", verticalAlign: "middle" }} />
              <b>Совет:</b> Приглашайте друзей и используйте мойки чаще, 
              чтобы быстрее повышать уровень и получать эксклюзивные бонусы!
            </Text>
          </div>
        </Card>
        
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
            <i data-lucide="trending-up" style={{ width: "24px", height: "24px" }}></i>
            Уровни
          </a>
          <a href="/ref" style={{
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
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/lucide/1.3.0/lucide.min.js"></script>
      <script>lucide.createIcons();</script>
    </div>
  );
}