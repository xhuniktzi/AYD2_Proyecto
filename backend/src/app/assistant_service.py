from flask import Blueprint, jsonify
from app.models import User, Gender, UserState

assistant = Blueprint('assistant', __name__)

@assistant.route('/users', methods=['GET'])
def getUsers():
    '''
    Endpoint to get the list of users
    '''
    users: list[User] = User.query.all()
    return jsonify(list(map(lambda user: {
        'id': user.id,
        'fullname': user.fullname,
        'email': user.email
    }, users)))

@assistant.route('/users/<id>', methods=['GET'])
def getUser(id: str):
    '''
    Endpoint to get a user's info
    '''
    user: User = User.query.get(id)
    return jsonify({
        'id': user.id,
        'fullname': user.fullname,
        'username': user.username,
        'fecha_nac': user.fecha_nac,
        'genero': Gender.query.get(user.genero_id).name,
        'email': user.email,
        'phone_number': user.phone_number,
        'state': UserState.query.get(user.state_id).name
    })
