import asyncio
from database import AsyncSessionLocal, engine, Base
from models import User
from services.authentification_service import get_password_hash


async def test_register():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Try to create a user
    async with AsyncSessionLocal() as session:
        new_user = User(
            email="test@test.com",
            username="testuser",
            hashed_password=get_password_hash("test123"),
            preferences=[],
        )
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        print(f"User created: {new_user.id}, {new_user.email}")


asyncio.run(test_register())
