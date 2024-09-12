from flask import Blueprint, jsonify
from app.models import User

user = Blueprint('user', __name__)

@user.route('/list', methods=['GET'])
def list_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "username": user.username} for user in users]), 200
