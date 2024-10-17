# Usar una imagen oficial de Node.js como imagen base para la etapa de construcción
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del proyecto al contenedor
COPY . .

# Compilar la aplicación Next.js para producción
RUN npm run build

# Usar una imagen oficial de Node.js como imagen base para la etapa de producción
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo las dependencias necesarias para producción
COPY package*.json ./
RUN npm install --production

# Copiar los archivos compilados de la etapa de construcción
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./

# Exponer el puerto en el que correrá la aplicación (3000 para Next.js)
EXPOSE 3000

# Comando para ejecutar la aplicación en modo producción
CMD ["npm", "run", "start"]
