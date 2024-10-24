from flask import Flask, jsonify
from app.extensions import db, jwt, migrate, cors
from app.auth_service import auth
from app.user_service import user
from app.assistant_service import assistant
from app.driver_service import driver
from sqlalchemy.exc import NoResultFound

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

    @app.errorhandler(NoResultFound)
    def handle_no_result(e: NoResultFound):
        return jsonify({
            'msg': str(e),
        }), 404

    return app
