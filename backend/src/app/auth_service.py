from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from app.models import Driver, TokenCheckin, User, db
from app.models import Administrador, db
from app.utils import (
    generar_nombre_usuario,
    read_config,
    generar_token_verificacion,
    obtener_fechas,
    formatear_fecha,
)
from datetime import datetime  # Import necesario para manejar fechas

auth = Blueprint("auth", __name__)


# Realiza un hola server
@auth.route("/hello", methods=["GET"])
def hello():
    return jsonify({"msg": "Hello, server!"})

# Endpoint para login de administrador
@auth.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Buscar al administrador por correo
    admin = Administrador.query.filter_by(Correo=email).first()
    print(admin)

    if not admin:
        return jsonify({"msg": "Administrador no encontrado"}), 404

    # Verificar contraseña
    if admin.Contraseña != password:
        return jsonify({"msg": "Credenciales incorrectaszzz"}), 401

    # Si las credenciales son correctas, generar un token de acceso
    access_token = create_access_token(identity=admin.ID_Administrador)
    return jsonify(access_token=access_token), 200


@auth.route("/login", methods=["POST"])
def auth_login():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter(
        or_(User.username == username, User.email == email)
    ).first()

    if not user:
        return jsonify({"msg": "Bad credentials"}), 401

    if user.state_id == int(read_config("user-not-checkin")):
        return jsonify({"msg": "Usuario no verificado"}), 401

    if check_password_hash(user.password, password) and user.state_id == int(
        read_config("user-active")
    ):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad credentials"}), 401


@auth.route("/register", methods=["POST"])
def auth_register():
    data = request.get_json()
    fullname = data["fullname"]
    fecha_nac_str = data["fecha_nac"]  # Fecha de nacimiento en formato de cadena
    password = data["password"]
    genero = data["genero"]
    email = data["email"]
    phone = data["phone"]

    fecha_nac = formatear_fecha(fecha_nac_str)

    if not fecha_nac:
        return jsonify({"msg": "Formato de fecha inválido. Utiliza dd/mm/yyyy"}), 400

    user_exists = User.query.filter(
        or_(User.email == email, User.phone_number == phone)
    ).first()

    if user_exists:
        return jsonify({"msg": "User exists"}), 400

    new_user = User()
    new_user.username = generar_nombre_usuario()
    new_user.fullname = fullname
    new_user.fecha_nac = fecha_nac
    new_user.password = generate_password_hash(password)
    new_user.genero_id = genero  # 0: ninguno, 1: femenino, 2: masculino
    new_user.email = email
    new_user.phone_number = phone
    new_user.state_id = int(read_config("user-not-checkin"))

    db.session.add(new_user)
    db.session.commit()

    new_token = TokenCheckin()
    new_token.token = generar_token_verificacion()
    new_token.user_id = int(new_user.id)
    new_token.created_at, new_token.expires_at = obtener_fechas()

    db.session.add(new_token)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado", "username": new_user.username})


@auth.route("/verify", methods=["GET"])
def verify_account():
    data = request.args
    token = data.get("token")

    # Buscar el token en la base de datos
    token_checkin = TokenCheckin.query.filter_by(token=token).first()

    if not token_checkin:
        return jsonify({"msg": "Token inválido"}), 400

    # Verificar si el token ha expirado
    if datetime.now() > token_checkin.expires_at:
        return jsonify({"msg": "El token ha expirado"}), 400

    # Actualizar el estado del usuario a 'verificado'
    user = User.query.get(token_checkin.user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user.state_id = int(read_config("user-active"))  # Estado 'verificado'

    db.session.delete(token_checkin)  # Eliminar el token una vez usado
    db.session.commit()

    return jsonify({"msg": "Cuenta verificada exitosamente"}), 200


@auth.route("/forgot_password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")

    # Buscar el usuario por email
    user = user = User.query.filter(
        or_(User.username == username, User.email == email)
    ).first()

    if not user:
        return jsonify({"msg": "No se encontró una cuenta con ese email"}), 404

    # Generar un token de reseteo de contraseña
    reset_token = TokenCheckin()
    reset_token.token = generar_token_verificacion()
    reset_token.user_id = user.id
    reset_token.created_at, reset_token.expires_at = obtener_fechas()

    db.session.add(reset_token)
    db.session.commit()

    return (
        jsonify(
            {
                "msg": "Se ha enviado un email con instrucciones para restablecer su contraseña"
            }
        ),
        200,
    )


@auth.route("/reset_password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("new_password")

    # Buscar el token en la base de datos
    reset_token = TokenCheckin.query.filter_by(token=token).first()
    if not reset_token:
        return jsonify({"msg": "Token inválido"}), 400

    # Verificar si el token ha expirado
    if datetime.now() > reset_token.expires_at:
        return jsonify({"msg": "El token ha expirado"}), 400

    # Restablecer la contraseña del usuario
    user = User.query.get(reset_token.user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user.password = generate_password_hash(new_password)

    db.session.delete(reset_token)  # Eliminar el token una vez usado
    db.session.commit()

    return jsonify({"msg": "Contraseña restablecida exitosamente"}), 200


@auth.route("/register_driver", methods=["POST"])
def register_driver():
    data = request.get_json()
    fullname = data["fullname"]
    age = data["age"]
    dpi_number = data["dpi_number"]
    password = data["password"]
    email = data["email"]
    phone = data["phone"]
    address = data["address"]
    genero_id = data["genero_id"]  # 0: ninguno, 1: femenino, 2: masculino
    estado_civil_id = data["estado_civil_id"]  # Estado civil del conductor
    car_brand = data["car_brand"]
    car_model_year = data["car_model_year"]
    plate_number = data["plate_number"]
    cv_pdf = data["cv_pdf"]
    photo = data["photo"]
    car_photo = data["car_photo"]
    account_number = data["account_number"]

    # Verificar si el DPI, email o número de teléfono ya existen
    driver_exists = Driver.query.filter(
        or_(
            Driver.dpi_number == dpi_number,
            Driver.email == email,
            Driver.phone_number == phone,
        )
    ).first()

    if driver_exists:
        return jsonify({"msg": "El conductor ya está registrado"}), 400

    # Crear una nueva instancia de Driver
    new_driver = Driver()
    new_driver.fullname = fullname
    new_driver.age = age
    new_driver.dpi_number = dpi_number
    new_driver.password = generate_password_hash(password)
    new_driver.email = email
    new_driver.phone_number = phone
    new_driver.address = address
    new_driver.genero_id = genero_id
    new_driver.estado_civil_id = estado_civil_id
    new_driver.car_brand = car_brand
    new_driver.car_model_year = car_model_year
    new_driver.plate_number = plate_number
    new_driver.cv_pdf = cv_pdf
    new_driver.photo = photo
    new_driver.car_photo = car_photo
    new_driver.account_number = account_number
    new_driver.state_id = int(read_config("user-not-checkin")) # Estado inicial del conductor

    # Agregar el nuevo conductor a la base de datos
    db.session.add(new_driver)
    db.session.commit()

    return jsonify({"msg": "Conductor registrado", "driver_id": new_driver.id}), 200


# Endpoint for driver login
@auth.route('/driver/login', methods=['POST'])
def driver_login():
    data = request.get_json()
    dpi_number = data.get('dpi_number')
    email = data.get('email')
    password = data.get('password')

    if not password:
        return jsonify({"msg": "Password is required"}), 400

    # Find driver by DPI number or email
    driver = None
    if dpi_number:
        driver = Driver.query.filter_by(dpi_number=dpi_number).first()
    elif email:
        driver = Driver.query.filter_by(email=email).first()

    if not driver:
        return jsonify({"msg": "Driver not found"}), 404

    # Check if driver is active TODO
    # if driver.state_id != int(read_config("user-active")):
    #     return jsonify({"msg": "Driver is not active"}), 403

    # Check password
    if not check_password_hash(driver.password, password):
        return jsonify({"msg": "Incorrect credentials"}), 401

    # Generate access token
    access_token = create_access_token(identity=driver.id)
    return jsonify(access_token=access_token), 200