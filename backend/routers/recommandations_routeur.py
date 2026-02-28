from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

import schemas
from models import ContenuCulturel
from database import get_db

router = APIRouter(prefix="/api/recommandations", tags=["Recommandations intelligentes"])


@router.get("/", response_model=List[schemas.ContenuOut])
async def generer_recommandations(db: AsyncSession = Depends(get_db)):
    """
    Recommandations basées sur la popularité (likes + vues).
    Retourne les 10 contenus les plus populaires publiés.
    """
    result = await db.execute(
        select(ContenuCulturel)
        .where(ContenuCulturel.is_published == True)
        .order_by(ContenuCulturel.likes.desc(), ContenuCulturel.vues.desc())
        .limit(10)
    )
    return result.scalars().all()
