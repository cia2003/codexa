from flask import Flask

from config import Config
from app.extensions import db, migrate, jwt, cors


def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": ["http://localhost:3000"]
            }
        }
    )

    from app.routes.health import health_bp

    app.register_blueprint(
        health_bp,
        url_prefix="/api"
    )

    return app