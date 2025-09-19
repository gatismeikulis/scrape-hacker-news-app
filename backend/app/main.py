from flask import Flask
from sqlalchemy import text

from .database import get_session, initialize_database


def create_app():
    app = Flask(__name__)

    initialize_database()

    @app.get("/")
    def testing() -> str:
        return "Testing"

    @app.get("/db-test")
    def test_db():
        with get_session() as session:
            result = session.execute(text("SELECT 1")).scalar()
            return {"database": "connected", "result": result}

    return app


app = create_app()
