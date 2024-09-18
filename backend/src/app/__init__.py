from flask import Flask

from app.extensions import db, jwt, migrate, cors
from app.auth_service import auth


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


    return app
