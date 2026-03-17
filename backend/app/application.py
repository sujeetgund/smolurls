from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router
from app.db import init_db
from app.mcp_server import mcp


def create_api_app() -> FastAPI:
    init_db()
    api = FastAPI(title="smolurls API", version="0.1.0")
    api.include_router(router, prefix="/api/v1")
    return api


api_app = create_api_app()
mcp_app = mcp.http_app(path="/")

app = FastAPI(
    title="smolurls",
    version="0.1.0",
    routes=[*api_app.routes],
    lifespan=mcp_app.lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
app.mount("/mcp", mcp_app)
