
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Spinner, Text, Card, Title, Button } from "@telegram-apps/telegram-ui";
import client from "../api/client";
import Navbar from "../components/Navbar";
import { QrCode, Camera, CheckCircle, AlertCircle } from "lucide-react";

export default function QRScanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const qrRef = useRef<Html5Qrcode | null>(null);
  const primaryColor = "var(--tg-theme-button-color, #0077ff)";

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  const startScanner = async () => {
    if (started) return;
    setStarted(true);
    setIsReady(false);
    setError(null);
    setSuccess(false);

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setError("Камера не найдена. Разрешите доступ к камере.");
        setStarted(false);
        return;
      }

      const html5Qr = new Html5Qrcode("reader");
      qrRef.current = html5Qr;

      await html5Qr.start(
        cameras[0].id,
        { 
          fps: 10, 
          qrbox: { 
            width: 250, 
            height: 250 
          },
          aspectRatio: 1.0
        },
        async (qrText) => {
          setIsLoading(true);
          try {
            await client.post("/api/carwash/scan_and_trigger", { qr: qrText });
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              stopScanner();
              setTimeout(() => startScanner(), 500);
            }, 2000);
          } catch (e: any) {
            setError(e?.response?.data?.detail || e.message || "Ошибка активации");
            setTimeout(() => {
              setError(null);
            }, 3000);
          } finally {
            setIsLoading(false);
          }
        },
        () => {}
      );

      setTimeout(() => setIsReady(true), 500);
    } catch (err: any) {
      console.error("Ошибка запуска:", err);
      setError(err.message || "Ошибка запуска камеры");
      setStarted(false);
    }
  };

  const stopScanner = async () => {
    if (qrRef.current) {
      try { await qrRef.current.stop(); } catch {}
      try { await qrRef.current.clear(); } catch {}
    }
    qrRef.current = null;
    setStarted(false);
    setIsReady(false);
  };

  const restartScanner = () => {
    stopScanner();
    setTimeout(() => startScanner(), 300);
  };

  return (
    <div
      style={{
        padding: "20px 16px 100px 16px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)"
      }}
    >
      <div style={{
        maxWidth: "500px",
        margin: "0 auto"
      }}>
        <Card
          mode="outline"
          style={{
            padding: "28px 24px",
            borderRadius: "24px",
            border: "none",
            background: "white",
            boxShadow: "0 8px 32px rgba(0, 119, 255, 0.08)",
            marginBottom: "20px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Декоративные элементы */}
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "150px",
            height: "150px",
            borderRadius: "75px",
            background: `linear-gradient(135deg, ${primaryColor}10 0%, #00a8ff10 100%)`,
            filter: "blur(20px)"
          }} />
          
          <div style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "100px",
            height: "100px",
            borderRadius: "50px",
            background: `linear-gradient(135deg, ${primaryColor}05 0%, #00a8ff05 100%)`,
            filter: "blur(15px)"
          }} />

          {/* Заголовок */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "24px",
            position: "relative",
            zIndex: "1"
          }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${primaryColor} 0%, #00a8ff 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <QrCode size={28} color="white" />
            </div>
            <div>
              <Title level={2} style={{
                margin: 0,
                fontSize: "28px",
                background: `linear-gradient(135deg, ${primaryColor} 0%, #00a8ff 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700"
              }}>
                Сканирование QR
              </Title>
              <Text style={{
                fontSize: "14px",
                color: "var(--tg-theme-hint-color, #8e8e93)",
                marginTop: "4px"
              }}>
                Наведите камеру на QR-код у мойки
              </Text>
            </div>
          </div>

          {/* Сообщения об ошибке/успехе */}
          {error && (
            <div style={{
              padding: "16px",
              background: "rgba(255, 59, 48, 0.1)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 59, 48, 0.2)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              position: "relative",
              zIndex: "1"
            }}>
              <AlertCircle size={20} color="#ff3b30" />
              <Text style={{
                fontSize: "14px",
                color: "#ff3b30",
                fontWeight: "500"
              }}>
                {error}
              </Text>
            </div>
          )}

          {success && (
            <div style={{
              padding: "16px",
              background: "rgba(46, 204, 113, 0.1)",
              borderRadius: "16px",
              border: "1px solid rgba(46, 204, 113, 0.2)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              position: "relative",
              zIndex: "1"
            }}>
              <CheckCircle size={20} color="#2ecc71" />
              <Text style={{
                fontSize: "14px",
                color: "#2ecc71",
                fontWeight: "500"
              }}>
                ✅ Мойка успешно активирована!
              </Text>
            </div>
          )}

          {/* Камера */}
          <div style={{
            width: "100%",
            height: "400px",
            borderRadius: "20px",
            overflow: "hidden",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            marginBottom: "24px",
            border: `3px solid ${primaryColor}30`
          }}>
            <div
              id="reader"
              style={{
                width: "100%",
                height: "100%",
                opacity: isReady ? 1 : 0,
                transition: "opacity 0.3s ease"
              }}
            />

            {/* Загрузка */}
            {!isReady && (
              <div
                style={{
                  position: "absolute",
                  color: "white",
                  textAlign: "center",
                  zIndex: "2"
                }}
              >
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "40px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto"
                }}>
                  <Spinner size="l" style={{ color: "white" }} />
                </div>
                <Text style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "white"
                }}>
                  Запуск камеры...
                </Text>
              </div>
            )}

            {/* Рамка сканирования */}
            {isReady && !isLoading && !success && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "250px",
                height: "250px",
                border: `2px solid ${primaryColor}`,
                borderRadius: "16px",
                pointerEvents: "none",
                boxShadow: `0 0 0 1000px rgba(0, 0, 0, 0.5)`
              }}>
                {/* Угловые элементы */}
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "30px",
                  height: "30px",
                  borderTop: `4px solid ${primaryColor}`,
                  borderLeft: `4px solid ${primaryColor}`,
                  borderTopLeftRadius: "12px"
                }} />
                <div style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  width: "30px",
                  height: "30px",
                  borderTop: `4px solid ${primaryColor}`,
                  borderRight: `4px solid ${primaryColor}`,
                  borderTopRightRadius: "12px"
                }} />
                <div style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "30px",
                  height: "30px",
                  borderBottom: `4px solid ${primaryColor}`,
                  borderLeft: `4px solid ${primaryColor}`,
                  borderBottomLeftRadius: "12px"
                }} />
                <div style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "30px",
                  height: "30px",
                  borderBottom: `4px solid ${primaryColor}`,
                  borderRight: `4px solid ${primaryColor}`,
                  borderBottomRightRadius: "12px"
                }} />
              </div>
            )}

            {/* Анимация сканирования */}
            {isReady && !isLoading && !success && (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "250px",
                height: "3px",
                background: primaryColor,
                animation: "scan 2s ease-in-out infinite",
                boxShadow: `0 0 10px ${primaryColor}`
              }} />
            )}

            {/* Загрузка активации */}
            {isLoading && (
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.8)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: "3"
                }}
              >
                <div style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px"
                }}>
                  <Spinner size="l" style={{ color: "white" }} />
                </div>
                <Text style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "white",
                  marginBottom: "8px"
                }}>
                  Активация...
                </Text>
                <Text style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                  textAlign: "center"
                }}>
                  Подождите, идет обработка
                </Text>
              </div>
            )}
          </div>

          {/* Кнопка перезапуска */}
          <Button
            size="m"
            stretched
            mode="outline"
            onClick={restartScanner}
            style={{
              borderRadius: "16px",
              height: "48px",
              borderColor: `${primaryColor}40`,
              color: primaryColor,
              fontWeight: "600",
              fontSize: "16px",
              position: "relative",
              zIndex: "1"
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}>
              <Camera size={20} />
              Перезапустить сканер
            </div>
          </Button>

          {/* Инструкция */}
          <div style={{
            marginTop: "24px",
            padding: "20px",
            background: "var(--tg-theme-secondary-bg-color, #f8f9fa)",
            borderRadius: "16px",
            border: "1px solid rgba(0, 119, 255, 0.1)",
            position: "relative",
            zIndex: "1"
          }}>
            <Text style={{
              fontSize: "14px",
              color: "var(--tg-theme-text-color, #000)",
              lineHeight: "1.6",
              textAlign: "center"
            }}>
              📸 <b>Инструкция:</b> Наведите камеру на QR-код, 
              расположенный на мойке. Убедитесь, что код хорошо освещен и находится в рамке.
            </Text>
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
          <i data-lucide="qr-code" style={{ width: "24px", height: "24px" }}></i>
          QR
        </a>
      </div>

      <style>
        {`
          #reader video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          
          @keyframes scan {
            0% {
              top: 50%;
            }
            50% {
              top: calc(50% + 120px);
            }
            100% {
              top: 50%;
            }
          }
        `}
      </style>
    </div>
  );
}