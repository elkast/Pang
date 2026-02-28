# =============================================================================
# IvoCulture — Routeur Régions
# CRUD des régions culturelles
# =============================================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

import schemas
from models import Region, User
from database import get_db
from routers.deps import get_current_user, get_current_admin

router = APIRouter(prefix="/api/regions", tags=["Régions"])


@router.get("/", response_model=List[schemas.RegionOut])
async def lister_regions(db: AsyncSession = Depends(get_db)):
    """Liste toutes les régions actives."""
    result = await db.execute(select(Region).where(Region.is_active == True))
    return result.scalars().all()


@router.get("/{region_id}", response_model=schemas.RegionOut)
async def obtenir_region(region_id: int, db: AsyncSession = Depends(get_db)):
    """Détail d'une région."""
    result = await db.execute(select(Region).where(Region.id == region_id))
    region = result.scalars().first()
    if not region:
        raise HTTPException(status_code=404, detail="Région introuvable")
    return region


@router.post("/", response_model=schemas.RegionOut, status_code=201)
async def creer_region(
    region: schemas.RegionCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Crée une nouvelle région (admin uniquement)."""
    nouvelle = Region(**region.model_dump())
    db.add(nouvelle)
    await db.commit()
    await db.refresh(nouvelle)
    return nouvelle


@router.put("/{region_id}", response_model=schemas.RegionOut)
async def modifier_region(
    region_id: int,
    region_update: schemas.RegionCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Modifie une région (admin uniquement)."""
    result = await db.execute(select(Region).where(Region.id == region_id))
    region = result.scalars().first()
    if not region:
        raise HTTPException(status_code=404, detail="Région introuvable")
    for key, value in region_update.model_dump().items():
        setattr(region, key, value)
    await db.commit()
    await db.refresh(region)
    return region


@router.delete("/{region_id}", response_model=schemas.MessageReponse)
async def supprimer_region(
    region_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Désactive une région (admin, soft delete)."""
    result = await db.execute(select(Region).where(Region.id == region_id))
    region = result.scalars().first()
    if not region:
        raise HTTPException(status_code=404, detail="Région introuvable")
    region.is_active = False
    await db.commit()
    return {"message": f"Région '{region.nom}' désactivée", "success": True}
