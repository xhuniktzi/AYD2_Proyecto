# Usar una imagen oficial de Node.js como imagen base
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar dependencias de desarrollo
RUN npm install
# Si usas Yarn:
# RUN yarn install

# Copiar el resto del código del proyecto al contenedor
COPY . .

# Exponer el puerto en el que correrá la aplicación (3000 para Next.js)
EXPOSE 3000

# Comando para ejecutar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]
# Si usas Yarn:
# CMD ["yarn", "dev"]
