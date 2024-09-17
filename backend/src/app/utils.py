from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models import User, ConfigControl

def get_current_user():
    verify_jwt_in_request()
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id)

def read_config(name: str) -> str:
    config = ConfigControl.query.filter_by(name=name).first()

    if config:
        return config.value
    else:
        return None