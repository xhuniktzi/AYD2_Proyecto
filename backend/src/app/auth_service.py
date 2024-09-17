from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from app.models import TokenCheckin, User, db
from app.utils import generar_nombre_usuario, read_config, generar_token_verificacion, obtener_fechas
from datetime import datetime  # Import necesario para manejar fechas

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def auth_login():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

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

@auth.route('/register', methods=['POST'])
def auth_register():
    data = request.get_json()
    fullname = data['fullname']
    fecha_nac_str = data['fecha_nac']  # Fecha de nacimiento en formato de cadena
    password = data['password']
    genero = data['genero']
    email = data['email']
    phone = data['phone']

    # Convertir la fecha de nacimiento al formato datetime
    try:
        fecha_nac = datetime.strptime(fecha_nac_str, '%d/%m/%Y')
    except ValueError:
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

    return jsonify({"msg": "Usuario registrado"})
