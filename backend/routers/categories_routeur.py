# =============================================================================
# IvoCulture — Routeur Catégories
# CRUD des catégories de contenus culturels
# =============================================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

import schemas
from models import Categorie, User
from database import get_db
from routers.deps import get_current_admin

router = APIRouter(prefix="/api/categories", tags=["Catégories"])


@router.get("/", response_model=List[schemas.CategorieOut])
async def lister_categories(db: AsyncSession = Depends(get_db)):
    """Liste toutes les catégories actives, triées par ordre."""
    result = await db.execute(
        select(Categorie).where(Categorie.is_active == True).order_by(Categorie.ordre)
    )
    return result.scalars().all()


@router.post("/", response_model=schemas.CategorieOut, status_code=201)
async def creer_categorie(
    categorie: schemas.CategorieCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Crée une catégorie (admin)."""
    nouvelle = Categorie(**categorie.model_dump())
    db.add(nouvelle)
    await db.commit()
    await db.refresh(nouvelle)
    return nouvelle


@router.put("/{categorie_id}", response_model=schemas.CategorieOut)
async def modifier_categorie(
    categorie_id: int,
    update: schemas.CategorieCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Modifie une catégorie (admin)."""
    result = await db.execute(select(Categorie).where(Categorie.id == categorie_id))
    cat = result.scalars().first()
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie introuvable")
    for key, value in update.model_dump().items():
        setattr(cat, key, value)
    await db.commit()
    await db.refresh(cat)
    return cat


@router.delete("/{categorie_id}", response_model=schemas.MessageReponse)
async def supprimer_categorie(
    categorie_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Désactive une catégorie (admin)."""
    result = await db.execute(select(Categorie).where(Categorie.id == categorie_id))
    cat = result.scalars().first()
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie introuvable")
    cat.is_active = False
    await db.commit()
    return {"message": f"Catégorie '{cat.nom}' désactivée", "success": True}
