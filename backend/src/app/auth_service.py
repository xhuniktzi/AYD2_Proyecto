import random
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from app.models import User, db
from app.utils import read_config


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
    adjetivos = ['Amazing', 'Brave', 'Calm', 'Daring', 'Energetic', 'Friendly', 'Gentle']
    sustantivos = ['Lion', 'Tiger', 'Eagle', 'Shark', 'Falcon', 'Panda', 'Dragon']

    def generar_nombre_usuario():
        adjetivo = random.choice(adjetivos)
        sustantivo = random.choice(sustantivos)
        numero = random.randint(1, 99)  # Puedes agregar un número al final si lo deseas
        return f"{adjetivo}{sustantivo}{numero}"
    
    data = request.get_json()
    fullname = data['fullname']
    fecha_nac = data['fecha_nac']
    password = data['password']
    genero = data['genero']
    email = data['email']
    phone = data['phone']

    new_user = User()
    new_user.username = generar_nombre_usuario()
    new_user.fullname = fullname
    new_user.fecha_nac = fecha_nac
    new_user.password = generate_password_hash(password)
    new_user.genero_id = genero # 0 is nothing, 1 is female, 2 is male
    new_user.email = email
    new_user.phone_number = phone
    new_user.state_id = int(read_config("user-active"))

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado"})




    



