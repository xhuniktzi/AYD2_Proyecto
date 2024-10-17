# Usar una imagen oficial de Python como imagen base
FROM python:3.11-slim

# Instalar dependencias necesarias para compilar psycopg2 y otras herramientas
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

# Copiar el resto del código del proyecto al contenedor
COPY . .

# Configurar el PYTHONPATH
ENV PYTHONPATH=/app/src

# Exponer el puerto en el que correrá el servidor
EXPOSE 5000

# Ejecutar migraciones antes de iniciar el servidor usando Gunicorn
CMD ["sh", "-c", "pipenv run flask db upgrade && pipenv run gunicorn -w 4 -b 0.0.0.0:5000 src.run:app"]
