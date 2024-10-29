import secrets
import random
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models import User, ConfigControl, Driver
from sqlalchemy.exc import NoResultFound
from typing import Optional, cast

def get_current_user():
    verify_jwt_in_request()
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def get_current_driver():
    verify_jwt_in_request()
    current_driver_id = get_jwt_identity()
    return Driver.query.get(current_driver_id)

def read_config(name: str) -> str:
    config = cast(Optional[ConfigControl], ConfigControl.query.filter_by(name=name).first())
    if not config:
        raise NoResultFound(f'<{name}> not found in config_control table')
    return config.value

def generar_token_verificacion():
    return secrets.token_hex(16)  # Genera un token de 128 bits en hexadecimal


def generar_nombre_usuario():
    adjetivos = ['Amazing', 'Brave', 'Calm', 'Daring', 'Energetic', 'Friendly', 'Gentle']
    sustantivos = ['Lion', 'Tiger', 'Eagle', 'Shark', 'Falcon', 'Panda', 'Dragon']

    adjetivo = random.choice(adjetivos)
    sustantivo = random.choice(sustantivos)
    numero = random.randint(1, 99)  # Puedes agregar un número al final si lo deseas
    return f"{adjetivo}{sustantivo}{numero}"



def obtener_fechas():
    # Crear objeto ZoneInfo para la zona horaria especificada
    zona = ZoneInfo('America/Guatemala')
    
    # Obtener la fecha y hora actual en la zona horaria
    fecha_actual = datetime.now(tz=zona)
    
    # Calcular la fecha y hora dentro de 24 horas
    fecha_mas_24_horas = fecha_actual + timedelta(hours=24)
    
    return fecha_actual, fecha_mas_24_horas

def formatear_fecha(fecha_str: str) -> datetime | None:
    try:
        return datetime.strptime(fecha_str, "%d/%m/%Y")
    except ValueError:
        return None

