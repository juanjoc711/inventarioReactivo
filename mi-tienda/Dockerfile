# Etapa 1: build
FROM node:20 AS build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: servidor
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copia archivo de configuración NGINX si lo necesitas
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
