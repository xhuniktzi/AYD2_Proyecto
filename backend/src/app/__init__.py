from flask import Flask
from app.auth_service import auth

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    app.register_blueprint(auth, url_prefix='/api/auth')

    return app