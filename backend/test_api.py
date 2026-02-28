import asyncio
from database import AsyncSessionLocal, engine, Base
from models import User


async def test_api():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Tables created successfully!")

    # Test insert
    from services.authentification_service import get_password_hash

    async with AsyncSessionLocal() as session:
        user = User(
            email="admin@ivo.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            nom_complet="Admin",
            preferences=[],
        )
        session.add(user)
        await session.commit()
        print(f"User created: {user.id}")


asyncio.run(test_api())
