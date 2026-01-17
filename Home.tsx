import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Title, Text, Spinner } from "@telegram-apps/telegram-ui";
import client from "../api/client";
import { MapPin, Navigation, QrCode, CreditCard } from "lucide-react";

declare global {
  interface Window {
    ymaps: any;
  }
}

interface CarWash {
  id: number;
  name: string;
  network_id: number;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [carwashes, setCarwashes] = useState<CarWash[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const primaryColor = "var(--tg-theme-button-color, #0077ff)";

  useEffect(() => {
    loadCarwashes();
  }, []);

  useEffect(() => {
    if (mapReady && mapRef.current && window.ymaps && !mapInstanceRef.current) {
      initMap();
    }
  }, [mapReady, carwashes]);

  async function loadCarwashes() {
    try {
      const res = await client.get("/api/carwash/list");
      setCarwashes(res.data);
    } catch (e: any) {
      console.error("Ошибка загрузки моек:", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => {
        setMapReady(true);
        setMapError(null);
      });
    } else {
      let attempts = 0;
      const maxAttempts = 50;
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.ymaps) {
          window.ymaps.ready(() => {
            setMapReady(true);
            setMapError(null);
          });
          clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
          setMapError("Не удалось загрузить карту. Проверьте подключение к интернету.");
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }
  }, []);

  function initMap() {
    if (!mapRef.current || !window.ymaps || mapInstanceRef.current) return;

    try {
      const center: [number, number] = carwashes.length > 0
        ? [carwashes[0].latitude, carwashes[0].longitude]
        : [55.7558, 37.6173];

      const map = new window.ymaps.Map(mapRef.current, {
        center: center,
        zoom: carwashes.length > 0 ? 12 : 10,
        controls: ['zoomControl', 'fullscreenControl'],
        behaviors: ['drag', 'multiTouch']
      });

      carwashes.forEach((carwash) => {
        try {
          const placemark = new window.ymaps.Placemark(
            [carwash.latitude, carwash.longitude],
            {
              balloonContentHeader: `<b>${carwash.name}</b>`,
              balloonContentBody: `Сеть: ${carwash.network_id}`,
              hintContent: carwash.name,
            },
            {
              preset: 'islands#blueCarWashIcon',
              iconColor: primaryColor
            }
          );

          map.geoObjects.add(placemark);
        } catch (e) {
          console.error("Ошибка добавления маркера:", e);
        }
      });

      if (carwashes.length > 0) {
        try {
          map.setBounds(map.geoObjects.getBounds(), {
            checkZoomRange: true,
            duration: 300
          });
        } catch (e) {
          console.error("Ошибка установки границ:", e);
        }
      }

      mapInstanceRef.current = map;
    } catch (e) {
      console.error("Ошибка инициализации карты:", e);
    }
  }

  return (
    <div style={{ 
      padding: "20px 16px 100px 16px", 
      display: "flex", 
      flexDirection: "column",
      minHeight: "100vh",
      boxSizing: "border-box",
      background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)"
    }}>
      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        width: "100%"
      }}>
        {/* Заголовок */}
        <Card 
          mode="outline" 
          style={{ 
            marginBottom: "20px", 
            padding: "24px",
            textAlign: "center",
            width: "100%",
            borderRadius: "24px",
            border: "none",
            background: `linear-gradient(135deg, ${primaryColor} 0%, #00a8ff 100%)`,
            boxShadow: "0 8px 32px rgba(0, 119, 255, 0.15)"
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "12px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Navigation size={24} color="white" />
            </div>
          </div>
          <Title level="2" style={{ 
            marginBottom: "8px", 
            color: "white",
            fontSize: "28px",
            fontWeight: "700"
          }}>
            AutoWash+
          </Title>
          <Text style={{ 
            fontSize: "16px", 
            color: "rgba(255, 255, 255, 0.9)",
            marginBottom: "4px"
          }}>
            Найдите ближайшую мойку на карте
          </Text>
        </Card>

        {/* Карта - УВЕЛИЧЕНА */}
        <Card 
          mode="outline" 
          style={{ 
            marginBottom: "20px",
            padding: "0",
            width: "100%",
            height: "480px", // Увеличенная высота карты
            overflow: "hidden",
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 8px 32px rgba(0, 119, 255, 0.08)"
          }}
        >
          <div style={{
            padding: "16px 16px 0 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <MapPin size={16} color={primaryColor} />
            <Text style={{
              fontSize: "14px",
              color: primaryColor,
              fontWeight: "600"
            }}>
              Карта моек
            </Text>
          </div>
          
          {isLoading || (!mapReady && !mapError) ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              flexDirection: "column",
              gap: "16px",
              padding: "20px"
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
              <Text style={{ 
                fontSize: "16px", 
                color: "var(--tg-theme-text-color, #000)",
                fontWeight: "500"
              }}>
                {isLoading ? "Загрузка моек..." : "Загрузка карты..."}
              </Text>
            </div>
          ) : mapError ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              flexDirection: "column",
              gap: "20px",
              padding: "40px",
              textAlign: "center"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "40px",
                background: "rgba(255, 59, 48, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <MapPin size={32} color="#ff3b30" />
              </div>
              <div>
                <Text style={{ 
                  fontSize: "16px", 
                  color: "#ff3b30",
                  fontWeight: "600",
                  marginBottom: "8px"
                }}>
                  Ошибка загрузки карты
                </Text>
                <Text style={{ 
                  fontSize: "14px", 
                  color: "var(--tg-theme-hint-color, #8e8e93)",
                  marginBottom: "20px"
                }}>
                  {mapError}
                </Text>
              </div>
              <Button 
                size="m" 
                style={{
                  background: primaryColor,
                  color: "white",
                  borderRadius: "12px",
                  padding: "12px 24px"
                }}
                onClick={() => window.location.reload()}
              >
                🔄 Обновить
              </Button>
            </div>
          ) : (
            <div 
              ref={mapRef} 
              style={{ 
                width: "100%", 
                height: "calc(100% - 50px)",
                minHeight: "430px" // Увеличенная минимальная высота
              }} 
            />
          )}
        </Card>

        {/* Информация о мойках ПОД картой */}
        {carwashes.length > 0 && (
          <div style={{ 
            marginBottom: "16px",
            background: `linear-gradient(135deg, ${primaryColor}08 0%, #00a8ff08 100%)`,
            borderRadius: "16px",
            border: `1px solid ${primaryColor}20`,
            textAlign: "center",
            padding: "16px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: primaryColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <MapPin size={18} color="white" />
              </div>
              <Text style={{ 
                fontSize: "17px", // Увеличенный текст
                color: primaryColor,
                fontWeight: "600"
              }}>
                Найдено моек: {carwashes.length}
              </Text>
            </div>
          </div>
        )}

        {/* Кнопки QR и Тарифы - ПОД информацией о мойках */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px"
        }}>
          {/* Кнопка сканирования QR */}
          <Card 
            mode="outline" 
            style={{ 
              padding: "20px",
              textAlign: "center",
              borderRadius: "20px",
              border: "none",
              background: "white",
              boxShadow: "0 8px 32px rgba(0, 119, 255, 0.08)"
            }}
          >
            <Button 
              size="m" 
              stretched 
              onClick={() => navigate("/qr")}
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, #00a8ff 100%)`,
                color: "white",
                borderRadius: "16px",
                height: "56px",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                boxShadow: "0 4px 20px rgba(0, 119, 255, 0.2)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 119, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 119, 255, 0.2)";
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}>
                <QrCode size={22} />
                <span>QR-сканер</span>
              </div>
            </Button>
          </Card>

          {/* Кнопка тарифов */}
          <Card 
            mode="outline" 
            style={{ 
              padding: "20px",
              textAlign: "center",
              borderRadius: "20px",
              border: "none",
              background: "white",
              boxShadow: "0 8px 32px rgba(0, 119, 255, 0.08)"
            }}
          >
            <Button 
              size="m" 
              stretched 
              onClick={() => navigate("/subscriptions")}
              style={{
                background: `linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)`,
                color: "white",
                borderRadius: "16px",
                height: "56px",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                boxShadow: "0 4px 20px rgba(46, 204, 113, 0.2)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(46, 204, 113, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(46, 204, 113, 0.2)";
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}>
                <CreditCard size={22} />
                <span>Тарифы</span>
              </div>
            </Button>
          </Card>
        </div>
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
          color: "#0077ff",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: "600",
          background: "linear-gradient(135deg, rgba(0, 119, 255, 0.1) 0%, rgba(0, 168, 255, 0.1) 100%)",
          padding: "6px 10px",
          borderRadius: "12px",
          minWidth: "70px"
        }}>
          <i data-lucide="home" style={{ width: "26px", height: "26px" }}></i>
          Главная
        </a>
        <a href="/qr" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "#8e8e93",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          padding: "6px 10px",
          borderRadius: "12px",
          minWidth: "70px"
        }}>
          <i data-lucide="qr-code" style={{ width: "26px", height: "26px" }}></i>
          QR
        </a>
        <a href="/subscriptions" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "#8e8e93",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          padding: "6px 10px",
          borderRadius: "12px",
          minWidth: "70px"
        }}>
          <i data-lucide="credit-card" style={{ width: "26px", height: "26px" }}></i>
          Тарифы
        </a>
        <a href="/profile" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          color: "#8e8e93",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          padding: "6px 10px",
          borderRadius: "12px",
          minWidth: "70px"
        }}>
          <i data-lucide="user" style={{ width: "26px", height: "26px" }}></i>
          Профиль
        </a>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/lucide/1.3.0/lucide.min.js"></script>
      <script>lucide.createIcons();</script>
    </div>
  );
}