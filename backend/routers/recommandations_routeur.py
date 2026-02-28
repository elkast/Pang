from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

import schemas
from models import ContenuCulturel, User
from database import get_db
from routers.deps import get_current_user

router = APIRouter(prefix="/api/recommandations", tags=["Recommandations intelligentes"])

@router.get("/", response_model=List[schemas.ContenuOut])
async def generer_recommandations(db: AsyncSession = Depends(get_db)):
    """ 
    Sert : Accueil + Decouverte (logique : match tags user + popularité) 
    Ici on simule en triant simplement par popularité. 
    L'authentification n'est pas obligatoire ici (pour l'exploration),
    mais peut-être renforcée par un user_id si fourni.
    """
    result = await db.execute(select(ContenuCulturel).order_by(ContenuCulturel.likes.desc(), ContenuCulturel.vues.desc()).limit(10))
    return result.scalars().all()
