# --- Build stage for admin panel ---
    FROM node:20-alpine AS admin-build
    WORKDIR /app
    
    # Копируем и устанавливаем зависимости админки
    COPY admin-panel/package.json admin-panel/package-lock.json* ./
    RUN npm ci
    
    # Копируем и собираем админку
    COPY admin-panel/ .
    RUN npm run build
    
    # --- Build stage for miniapp ---
    FROM node:20-alpine AS miniapp-build
    WORKDIR /app
    
    # Копируем и устанавливаем зависимости мини-приложения
    COPY frontend-miniapp/package.json frontend-miniapp/package-lock.json* ./
    RUN npm ci
    
    # Копируем и собираем мини-приложение
    COPY frontend-miniapp/ .
    RUN npm run build
    
    # --- Final nginx stage ---
    FROM nginx:alpine
    
    # Копируем собранную админку
    COPY --from=admin-build /app/dist /usr/share/nginx/html/admin
    
    # Копируем собранное мини-приложение
    COPY --from=miniapp-build /app/dist /usr/share/nginx/html/miniapp
    
    # Копируем конфигурацию nginx (используем default.conf)
    COPY nginx/default.conf /etc/nginx/conf.d/default.conf
    
    # Создаем директорию для отчетов
    RUN mkdir -p /usr/share/nginx/html/reports
    
    EXPOSE 80 443