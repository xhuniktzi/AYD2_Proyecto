from flask import Flask

from app.extensions import db, jwt, migrate, cors
from app.auth_service import auth
from app.user_service import user
from app.assistant_service import assistant
from app.driver_service import driver

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)

    # Registrar blueprints
    app.register_blueprint(auth, url_prefix='/api/auth')
    app.register_blueprint(user, url_prefix='/api/user')
    app.register_blueprint(assistant, url_prefix='/api/assistant')
    app.register_blueprint(driver, url_prefix='/api/driver')

    return app
