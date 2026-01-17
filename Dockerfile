# --- Build stage ---
    FROM node:20-alpine AS build
    WORKDIR /app
    
    # Устанавливаем зависимости
    COPY package.json package-lock.json* ./
    RUN npm ci --silent
    
    # Копируем проект
    COPY . .
    
    # Сборка мини-аппа
    RUN npm run build
    
    # Этот контейнер НЕ запускается — передаёт dist в nginx
    