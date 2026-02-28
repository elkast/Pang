import pytest
from httpx import AsyncClient
from main import app
from database import Base, engine, AsyncSessionLocal

@pytest.fixture(autouse=True)
async def prepare_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_create_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/users/",
            json={"username": "testuser", "email": "test@ivoire.ci", "password": "securepassword"}
        )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert response.json()["is_active"] is True

@pytest.mark.asyncio
async def test_list_regions():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/regions/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_add_region():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/regions/",
            json={
                "name": "Lagunes",
                "description": "Region de l'eau",
                "image_url": "http://img",
                "color_theme": "#0000FF"
            }
        )
    assert response.status_code == 200
    assert response.json()["name"] == "Lagunes"
