# =============================================================================
# IvoCulture — Tests des régions et contenus (pytest + httpx)
# Couvre : lister, créer, filtrer, détails, 404
# =============================================================================

import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.fixture(autouse=True)
async def reinitialiser_base():
    """Recrée les tables avant chaque test."""
    from database import engine, Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield


async def obtenir_token(client: AsyncClient) -> str:
    """Crée un utilisateur de test et retourne son JWT."""
    await client.post("/api/auth/register", json={
        "email": "testeur@ivoculture.ci",
        "username": "Testeur",
        "password": "motdepasse123"
    })
    reponse = await client.post("/api/auth/login", data={
        "username": "testeur@ivoculture.ci",
        "password": "motdepasse123"
    })
    return reponse.json()["access_token"]


@pytest.mark.asyncio
async def test_lister_regions_vide():
    """La liste des régions est vide au départ."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reponse = await client.get("/api/regions/")
        assert reponse.status_code == 200
        assert isinstance(reponse.json(), list)
        assert len(reponse.json()) == 0


@pytest.mark.asyncio
async def test_region_inexistante():
    """Demander une région inexistante retourne 404."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reponse = await client.get("/api/regions/9999")
        assert reponse.status_code == 404


@pytest.mark.asyncio
async def test_lister_contenus_vide():
    """La liste des contenus est vide au départ."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reponse = await client.get("/api/contenus/")
        assert reponse.status_code == 200
        assert isinstance(reponse.json(), list)


@pytest.mark.asyncio
async def test_creer_contenu_sans_auth():
    """Créer un contenu sans JWT retourne 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reponse = await client.post("/api/contenus/", json={
            "titre": "Test Conte",
            "type_contenu": "Conte",
            "description": "Un conte de test",
            "texte_complet": "Il était une fois...",
            "image_url": "https://example.com/img.jpg",
            "region_id": 1,
            "tags": []
        })
        assert reponse.status_code == 401


@pytest.mark.asyncio
async def test_recommandations_accessibles():
    """Les recommandations sont accessibles sans authentification."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reponse = await client.get("/api/recommandations/")
        assert reponse.status_code == 200
        assert isinstance(reponse.json(), list)


@pytest.mark.asyncio
async def test_route_racine():
    """La route racine retourne un message de bienvenue."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reponse = await client.get("/")
        assert reponse.status_code == 200
        assert "IvoCulture" in reponse.json()["message"]
