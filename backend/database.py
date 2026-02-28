from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import os

# Chemin absolu pour éviter les problèmes de répertoire de travail
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ivo.db")
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{DB_PATH}")

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL, 
    echo=False
)

AsyncSessionLocal = async_sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
