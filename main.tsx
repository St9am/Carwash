import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRoot } from "@telegram-apps/telegram-ui";
import "@telegram-apps/telegram-ui/dist/styles.css";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import QRScanner from "./pages/QRScanner.tsx";
import Subscriptions from "./pages/Subscriptions.tsx";
import Profile from "./pages/Profile.tsx";
import Referral from "./pages/Referral.tsx";
import Levels from "./pages/Levels.tsx";
import "./styles.css";
import { getTelegramAppearance, initTelegramApp } from "./lib/telegram.ts";

const queryClient = new QueryClient();
initTelegramApp();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppRoot appearance={getTelegramAppearance()}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/qr" element={<QRScanner />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ref" element={<Referral />} />
          <Route path="/levels" element={<Levels />} />
        </Routes>
      </BrowserRouter>
    </AppRoot>
  </QueryClientProvider>
);
