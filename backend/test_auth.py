# =============================================================================
# IvoCulture — Tests d'authentification (pytest + httpx)
# Couvre : inscription, connexion, accès profil protégé
# =============================================================================

import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.fixture(autouse=True)
async def reinitialiser_base():
    """Recrée les tables avant chaque test pour un environnement propre."""
    from database import engine, Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield


@pytest.mark.asyncio
async def test_inscription_reussie():
    """Un nouvel utilisateur peut s'inscrire avec email, username et mot de passe."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reponse = await client.post("/api/auth/register", json={
            "email": "test@ivoculture.ci",
            "username": "GardienTest",
            "password": "motdepasse123"
        })
        assert reponse.status_code == 200
        donnees = reponse.json()
        assert donnees["email"] == "test@ivoculture.ci"
        assert donnees["username"] == "GardienTest"
        assert "id" in donnees


@pytest.mark.asyncio
async def test_inscription_doublon_refuse():
    """L'inscription avec un email déjà utilisé doit échouer."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        await client.post("/api/auth/register", json={
            "email": "doublon@ivoculture.ci",
            "username": "Utilisateur1",
            "password": "motdepasse123"
        })
        reponse = await client.post("/api/auth/register", json={
            "email": "doublon@ivoculture.ci",
            "username": "Utilisateur2",
            "password": "motdepasse456"
        })
        assert reponse.status_code == 400


@pytest.mark.asyncio
async def test_connexion_reussie():
    """Un utilisateur inscrit peut se connecter et recevoir un JWT."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        await client.post("/api/auth/register", json={
            "email": "login@ivoculture.ci",
            "username": "LoginTest",
            "password": "motdepasse123"
        })
        reponse = await client.post("/api/auth/login", data={
            "username": "login@ivoculture.ci",
            "password": "motdepasse123"
        })
        assert reponse.status_code == 200
        donnees = reponse.json()
        assert "access_token" in donnees
        assert donnees["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_connexion_identifiants_incorrects():
    """Des identifiants incorrects retournent une erreur 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reponse = await client.post("/api/auth/login", data={
            "username": "inexistant@test.ci",
            "password": "faux"
        })
        assert reponse.status_code == 401


@pytest.mark.asyncio
async def test_profil_protege_sans_token():
    """L'accès au profil sans JWT doit retourner 401."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        reponse = await client.get("/api/auth/me")
        assert reponse.status_code == 401


@pytest.mark.asyncio
async def test_profil_protege_avec_token():
    """L'accès au profil avec un JWT valide retourne les données utilisateur."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        await client.post("/api/auth/register", json={
            "email": "profil@ivoculture.ci",
            "username": "ProfilTest",
            "password": "motdepasse123"
        })
        login = await client.post("/api/auth/login", data={
            "username": "profil@ivoculture.ci",
            "password": "motdepasse123"
        })
        token = login.json()["access_token"]
        reponse = await client.get("/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert reponse.status_code == 200
        assert reponse.json()["email"] == "profil@ivoculture.ci"
