import React from "react";
import { useLocation } from "react-router-dom";
import { Home, User, Users, TrendingUp, QrCode, CreditCard } from "lucide-react";

interface NavbarProps {
  activePage?: string;
}

export default function Navbar({ activePage }: NavbarProps) {
  const location = useLocation();
  const currentPath = activePage || location.pathname;
  
  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/" || currentPath === "/home";
    return currentPath === path;
  };

  const navItems = [
    { path: "/", icon: <Home size={26} />, label: "Главная" },
    { path: "/qr", icon: <QrCode size={26} />, label: "QR" },
    { path: "/subscriptions", icon: <CreditCard size={26} />, label: "Тарифы" },
    { path: "/levels", icon: <TrendingUp size={26} />, label: "Уровни" },
    { path: "/referral", icon: <Users size={26} />, label: "Рефералы" },
    { path: "/profile", icon: <User size={26} />, label: "Профиль" },
  ];

  return (
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
      {navItems.map((item) => (
        <a
          key={item.path}
          href={item.path}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            color: isActive(item.path) ? "#0077ff" : "#8e8e93",
            textDecoration: "none",
            fontSize: "13px", // Увеличен размер текста
            fontWeight: isActive(item.path) ? "600" : "500",
            background: isActive(item.path) 
              ? "linear-gradient(135deg, rgba(0, 119, 255, 0.1) 0%, rgba(0, 168, 255, 0.1) 100%)" 
              : "transparent",
            transition: "all 0.2s ease",
            padding: "6px 10px", // Увеличен padding
            borderRadius: "12px",
            minWidth: "70px" // Увеличен минимальная ширина
          }}
          onMouseEnter={(e) => {
            if (!isActive(item.path)) {
              e.currentTarget.style.color = "#0077ff";
              e.currentTarget.style.background = "rgba(0, 119, 255, 0.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive(item.path)) {
              e.currentTarget.style.color = "#8e8e93";
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          {React.cloneElement(item.icon, {
            style: { 
              width: "26px", // Увеличены иконки
              height: "26px",
              color: isActive(item.path) ? "#0077ff" : "#8e8e93"
            }
          })}
          {item.label}
        </a>
      ))}
    </div>
  );
}