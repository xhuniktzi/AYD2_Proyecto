from flask import Flask

from app.extensions import db, jwt, migrate, cors
from app.auth_service import auth
from app.trip_service import trip
from app.user_service import user

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
    app.register_blueprint(trip, url_prefix='/api/trip')
    app.register_blueprint(user, url_prefix='/api/user')

    return app
