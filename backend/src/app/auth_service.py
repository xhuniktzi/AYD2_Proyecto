from flask import Blueprint, jsonify

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def auth_login():
    return jsonify({"msg": "OK"})