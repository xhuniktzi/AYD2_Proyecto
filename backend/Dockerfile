# Usar una imagen oficial de Python como imagen base
FROM python:3.11-slim

# Instalar dependencias necesarias para compilar psycopg2
RUN apt-get update && apt-get install -y \
    libpq-dev gcc

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo Pipfile y Pipfile.lock al contenedor
COPY Pipfile Pipfile.lock ./

# Instalar pipenv
RUN pip install pipenv

# Instalar las dependencias del proyecto usando la versión de Python instalada en la imagen
RUN pipenv install --python $(which python3) --dev --deploy --ignore-pipfile

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto en el que el servidor de desarrollo va a correr
EXPOSE 5000

# Comando para iniciar el servidor de desarrollo
CMD ["pipenv", "run", "python", "src/run.py"]
