from flask import Blueprint, jsonify, request
from app.models import User, db
from werkzeug.security import generate_password_hash

user = Blueprint('user', __name__)

@user.route('/list', methods=['GET'])
def list_users():
    users = User.query.all()
    
    return jsonify([{"id": user.id, "username": user.username} for user in users]), 200

@user.route('/create', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(
        username = data['username'],
        password = generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201
