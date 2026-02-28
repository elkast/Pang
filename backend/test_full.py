import asyncio
from database import AsyncSessionLocal, engine, Base
from models import User
from services.authentification_service import get_password_hash, verify_password


async def test():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Create user
        user = User(
            email="test@example.com",
            username="testuser",
            hashed_password=get_password_hash("password123"),
            nom_complet="Test User",
            preferences=[],
            is_active=True,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        print(f"Created user: {user.email}")

        # Verify password
        result = verify_password("password123", user.hashed_password)
        print(f"Password verify: {result}")


asyncio.run(test())
