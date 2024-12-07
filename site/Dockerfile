#Официальный образ
FROM node:16 as build
#рабочая директория
WORKDIR /app
#копируем js в контейнер
COPY package*.json ./
#зависимости
RUN npm install
#копируем файлы в контейнер
COPY . .
RUN npm run build


FROM nginx:stable-alpine

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранные файлы в директорию, обслуживаемую Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]