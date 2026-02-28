# =============================================================================
# IvoCulture — Routeur Promotions
# CRUD complet : Sites, Mosquées, Musiques, Légendes, Tourisme
# avec notation de notoriété et gestion admin
# =============================================================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func as sql_func
from typing import List, Optional

import schemas
from models import Promotion
from database import get_db
from routers.deps import get_current_user, get_current_admin
from models import User

router = APIRouter(prefix="/api/promotions", tags=["Promotions"])


# ─── LECTURE PUBLIQUE ────────────────────────────────────────────────────────

@router.get("/", response_model=List[schemas.PromotionOut])
async def lister_promotions(
    type_promotion: Optional[str] = None,
    featured: Optional[bool] = None,
    limite: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Liste les promotions actives, triées par notoriété décroissante."""
    query = select(Promotion).where(Promotion.is_active == True)
    if type_promotion:
        query = query.where(Promotion.type_promotion == type_promotion)
    if featured is not None:
        query = query.where(Promotion.is_featured == featured)
    query = query.order_by(Promotion.note_popularite.desc()).limit(limite).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{promotion_id}", response_model=schemas.PromotionOut)
async def obtenir_promotion(
    promotion_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Récupère une promotion par ID et incrémente ses vues."""
    result = await db.execute(select(Promotion).where(Promotion.id == promotion_id))
    promotion = result.scalars().first()
    if not promotion:
        raise HTTPException(status_code=404, detail="Promotion introuvable")
    promotion.vues += 1
    db.add(promotion)
    await db.commit()
    await db.refresh(promotion)
    return promotion


# ─── CRÉATION (admin) ────────────────────────────────────────────────────────

@router.post("/", response_model=schemas.PromotionOut, status_code=201)
async def creer_promotion(
    promotion: schemas.PromotionCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Crée une nouvelle promotion (admin uniquement)."""
    nouvelle = Promotion(**promotion.model_dump())
    db.add(nouvelle)
    await db.commit()
    await db.refresh(nouvelle)
    return nouvelle


# ─── MODIFICATION (admin) ────────────────────────────────────────────────────

@router.patch("/{promotion_id}", response_model=schemas.PromotionOut)
async def modifier_promotion(
    promotion_id: int,
    update: schemas.PromotionUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Modifie une promotion existante (admin uniquement)."""
    result = await db.execute(select(Promotion).where(Promotion.id == promotion_id))
    promotion = result.scalars().first()
    if not promotion:
        raise HTTPException(status_code=404, detail="Promotion introuvable")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(promotion, key, value)
    db.add(promotion)
    await db.commit()
    await db.refresh(promotion)
    return promotion


@router.patch("/{promotion_id}/featured", response_model=schemas.PromotionOut)
async def toggle_featured_promotion(
    promotion_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Active/désactive la mise en avant d'une promotion."""
    result = await db.execute(select(Promotion).where(Promotion.id == promotion_id))
    promotion = result.scalars().first()
    if not promotion:
        raise HTTPException(status_code=404, detail="Promotion introuvable")
    promotion.is_featured = not promotion.is_featured
    await db.commit()
    await db.refresh(promotion)
    return promotion


# ─── SUPPRESSION (admin) ─────────────────────────────────────────────────────

@router.delete("/{promotion_id}", response_model=schemas.MessageReponse)
async def supprimer_promotion(
    promotion_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Supprime une promotion définitivement (admin uniquement)."""
    result = await db.execute(select(Promotion).where(Promotion.id == promotion_id))
    promotion = result.scalars().first()
    if not promotion:
        raise HTTPException(status_code=404, detail="Promotion introuvable")
    await db.delete(promotion)
    await db.commit()
    return {"message": f"Promotion '{promotion.titre}' supprimée", "success": True}
