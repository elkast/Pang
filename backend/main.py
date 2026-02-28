# =============================================================================
# IvoCulture — Point d'entrée FastAPI
# Backend modulaire (style microservices via routers)
# =============================================================================

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from database import engine, Base
from admin import setup_admin
from routers import (
    authentification_routeur,
    regions_routeur,
    contenus_routeur,
    interactions_routeur,
    recommandations_routeur,
    profil_routeur,
    favoris_routeur,
    admin_routeur,
    categories_routeur,
    promotions_routeur,
    signalements_routeur,
)


# ─── CYCLE DE VIE ────────────────────────────────────────────────────────────


@asynccontextmanager
async def duree_de_vie(app: FastAPI):
    """Création des tables au démarrage (prototypage / si Alembic pas lancé)."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


# ─── APPLICATION ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="IvoCulture API",
    description="API intelligente pour la présentation et transmission de la culture ivoirienne.",
    version="2.0.0",
    lifespan=duree_de_vie,
)


# ─── MIDDLEWARES ─────────────────────────────────────────────────────────────

app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "ivo-culture-super-secret-key-123"),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── ADMIN ───────────────────────────────────────────────────────────────────

setup_admin(app)


# ─── ROUTEURS ────────────────────────────────────────────────────────────────

app.include_router(authentification_routeur)
app.include_router(regions_routeur)
app.include_router(contenus_routeur)
app.include_router(interactions_routeur)
app.include_router(recommandations_routeur)
app.include_router(profil_routeur)
app.include_router(favoris_routeur)
app.include_router(admin_routeur)
app.include_router(categories_routeur)
app.include_router(promotions_routeur)
app.include_router(signalements_routeur)


# ─── ROUTE RACINE ────────────────────────────────────────────────────────────


@app.get("/", tags=["Santé"])
async def racine():
    return {"message": "Bienvenue sur l'API IvoCulture", "version": "2.0.0"}
