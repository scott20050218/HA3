from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, configure_database, engine
from . import models  # ensure models are registered before create_all
from .routers.tasks import router as tasks_router
from .routers.auth import router as auth_router


def create_app() -> FastAPI:
    # reconfigure engine with current env (DATABASE_URL)
    configure_database()
    Base.metadata.create_all(bind=engine)

    app = FastAPI(title="Todo API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(tasks_router)
    app.include_router(auth_router)

    @app.get("/health")
    def health_check():
        return {"status": "ok"}

    return app


app = create_app()


