from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

from config import Config
from app.extensions import db, migrate, jwt, cors
from app.routes.auth import auth_bp
from app.routes.health import health_bp
from app.routes.manuscript import manuscript_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    Config.validate()

    # DomCloud Passenger berada di belakang nginx.
    app.wsgi_app = ProxyFix(
        app.wsgi_app,
        x_for=1,
        x_proto=1,
        x_host=1,
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["CORS_ORIGINS"],
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "supports_credentials": False,
            }
        },
    )

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(manuscript_bp, url_prefix="/api")

    return app