from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = "hello"
    app.config["JWT_SECRET_KEY"] = "super-secret"

    # SQLAlchemy Database Configuration
    # app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///posts.db"  # SQLite database file
    # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Avoid unnecessary overhead
    # sql_db.init_app(app)

    jwt = JWTManager(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

    from .auth import auth
    # import other routes here

    app.register_blueprint(auth, url_prefix="/")

    """
    with app.app_context():
        sql_db.create_all()
    """

    return app