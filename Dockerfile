# --- Build stage ---
    FROM node:20-alpine AS build
    WORKDIR /app
    
    # Устанавливаем зависимости
    COPY package.json package-lock.json* ./
    RUN npm ci
    
    # Копируем весь проект
    COPY . .
    
    # Собираем админку
    RUN npm run build
    
    # Этот контейнер тоже НЕ запускается — билд забирает nginx
    