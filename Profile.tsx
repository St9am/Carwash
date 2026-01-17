import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Title, Text, Spinner } from "@telegram-apps/telegram-ui";
import { me } from "../api/auth";
import Navbar from "../components/Navbar";
import { User, Award, Star, Hash, Car, Info, Calendar } from "lucide-react";

export default function Profile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: me,
  });

  const primaryColor = "var(--tg-theme-button-color, #0077ff)";
  
  // Получаем данные о мойках
  const washesRemaining = user?.total_remaining_washes || 0;
  const activeUntil = user?.active_until 
    ? new Date(user.active_until).toLocaleDateString('ru-RU')
    : "Не указано";

  const getLevelColor = (level: number) => {
    if (level >= 10) return "#ff6b6b";
    if (level >= 5) return "#ffa726";
    return primaryColor;
  };

  // Вычисляем процент до следующего уровня
  const levelProgress = user?.exp ? (user.exp % 100) : 0;

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
              width: "64px",
              height: "64px",
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${primaryColor} 0%, #00a8ff 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <User size={32} color="white" />
            </div>
            <div>
              <Title level={2} style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: "700",
                color: "var(--tg-theme-text-color, #000)"
              }}>
                Профиль
              </Title>
              <Text style={{
                fontSize: "14px",
                color: "var(--tg-theme-hint-color, #8e8e93)",
                marginTop: "4px"
              }}>
                Ваша статистика и баланс
              </Text>
            </div>
          </div>

          {isLoading && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px 0"
            }}>
              <Spinner size="m" style={{ color: primaryColor }} />
            </div>
          )}

          {!isLoading && user && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              {/* Имя */}
              <div style={{
                background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid rgba(0, 119, 255, 0.1)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px"
                }}>
                  <User size={20} color={primaryColor} />
                  <Text style={{
                    fontSize: "14px",
                    color: "var(--tg-theme-hint-color, #8e8e93)"
                  }}>
                    Имя
                  </Text>
                </div>
                <Text style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "var(--tg-theme-text-color, #000)"
                }}>
                  {user.name || "Не указано"}
                </Text>
              </div>

              {/* Уровень, EXP и Мойки */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px"
              }}>
                {/* Уровень */}
                <div style={{
                  background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(0, 119, 255, 0.1)",
                  textAlign: "center"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    <Award size={20} color={getLevelColor(user.level || 0)} />
                    <Text style={{
                      fontSize: "14px",
                      color: "var(--tg-theme-hint-color, #8e8e93)"
                    }}>
                      Уровень
                    </Text>
                  </div>
                  <div style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: getLevelColor(user.level || 0),
                    lineHeight: "1"
                  }}>
                    {user.level || 0}
                  </div>
                </div>

                {/* EXP */}
                <div style={{
                  background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(0, 119, 255, 0.1)",
                  textAlign: "center"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    <Star size={20} color={primaryColor} />
                    <Text style={{
                      fontSize: "14px",
                      color: "var(--tg-theme-hint-color, #8e8e93)"
                    }}>
                      EXP
                    </Text>
                  </div>
                  <div style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: primaryColor,
                    lineHeight: "1"
                  }}>
                    {user.exp || 0}
                  </div>
                </div>

                {/* Оставшиеся мойки */}
                <div style={{
                  background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid rgba(0, 119, 255, 0.1)",
                  textAlign: "center",
                  gridColumn: "span 2"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    <Car size={20} color="#2ecc71" />
                    <Text style={{
                      fontSize: "14px",
                      color: "var(--tg-theme-hint-color, #8e8e93)"
                    }}>
                      Осталось моек
                    </Text>
                  </div>
                  <div style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#2ecc71",
                    lineHeight: "1",
                    marginBottom: "4px"
                  }}>
                    {washesRemaining}
                  </div>
                  <Text style={{
                    fontSize: "14px",
                    color: "#8e8e93"
                  }}>
                    {washesRemaining > 0 ? "Действует до " + activeUntil : "Нет активной подписки"}
                  </Text>
                </div>
              </div>

              {/* Прогресс бар уровня */}
              <div style={{
                marginTop: "12px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px"
                }}>
                  <Text style={{
                    fontSize: "12px",
                    color: "var(--tg-theme-hint-color, #8e8e93)"
                  }}>
                    Прогресс до уровня {user.level + 1}
                  </Text>
                  <Text style={{
                    fontSize: "12px",
                    color: primaryColor,
                    fontWeight: "600"
                  }}>
                    {levelProgress} / 100 EXP
                  </Text>
                </div>
                <div style={{
                  height: "8px",
                  background: "var(--tg-theme-secondary-bg-color, #f0f0f0)",
                  borderRadius: "4px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${levelProgress}%`,
                    background: `linear-gradient(90deg, ${primaryColor} 0%, #00a8ff 100%)`,
                    borderRadius: "4px",
                    transition: "width 0.3s ease"
                  }} />
                </div>
              </div>

              {/* Реферальный код */}
              <div style={{
                background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid rgba(0, 119, 255, 0.1)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px"
                }}>
                  <Hash size={20} color={primaryColor} />
                  <Text style={{
                    fontSize: "14px",
                    color: "var(--tg-theme-hint-color, #8e8e93)"
                  }}>
                    Реферальный код
                  </Text>
                </div>
                <div style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: primaryColor,
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: "1px",
                  textAlign: "center",
                  padding: "12px",
                  background: "white",
                  borderRadius: "12px",
                  border: `2px solid ${primaryColor}20`
                }}>
                  {user.referral_code || "-"}
                </div>
              </div>

              {/* Информация о подписке */}
              {washesRemaining > 0 ? (
                <div style={{
                  marginTop: "12px",
                  padding: "16px",
                  background: "rgba(46, 204, 113, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(46, 204, 113, 0.2)"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <Info size={16} color="#2ecc71" />
                    <div>
                      <Text style={{
                        fontSize: "13px",
                        color: "#27ae60",
                        fontWeight: "600",
                        marginBottom: "4px"
                      }}>
                        Активная подписка
                      </Text>
                      <Text style={{
                        fontSize: "13px",
                        color: "#27ae60",
                        lineHeight: "1.5"
                      }}>
                        Осталось <span style={{ fontWeight: "600" }}>{washesRemaining} моек</span>. 
                        Действует до <span style={{ fontWeight: "600" }}>{activeUntil}</span>
                      </Text>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  marginTop: "12px",
                  padding: "16px",
                  background: "rgba(255, 107, 107, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 107, 107, 0.2)"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}>
                    <Info size={16} color="#ff6b6b" />
                    <div>
                      <Text style={{
                        fontSize: "13px",
                        color: "#e74c3c",
                        fontWeight: "600",
                        marginBottom: "4px"
                      }}>
                        Нет активной подписки
                      </Text>
                      <Text style={{
                        fontSize: "13px",
                        color: "#e74c3c",
                        lineHeight: "1.5"
                      }}>
                        Приобретите подписку в разделе "Тарифы"
                      </Text>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && !user && (
            <div style={{
              padding: "40px 20px",
              textAlign: "center"
            }}>
              <Text style={{
                color: "#ff6b6b",
                fontSize: "16px"
              }}>
                Не удалось получить профиль. Попробуйте войти заново.
              </Text>
            </div>
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
          <i data-lucide="user" style={{ width: "24px", height: "24px" }}></i>
          Профиль
        </a>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/lucide/1.3.0/lucide.min.js"></script>
      <script>lucide.createIcons();</script>
    </div>
  );
}

