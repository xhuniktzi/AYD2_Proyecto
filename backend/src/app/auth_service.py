from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from app.models import TokenCheckin, User, db
from app.utils import (
    generar_nombre_usuario,
    read_config,
    generar_token_verificacion,
    obtener_fechas,
    formatear_fecha
)
from datetime import datetime  # Import necesario para manejar fechas

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def auth_login():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user:
        user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "Bad credentials"}), 401

    if check_password_hash(user.password, password):
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
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User.query.filter_by(username=username).first()

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
