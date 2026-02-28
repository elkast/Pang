# =============================================================================
# IvoCulture — Routeur Contenus Culturels
# CRUD complet avec filtrage, recherche, pagination
# =============================================================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func as sql_func
from typing import List, Optional

import schemas
from models import ContenuCulturel, User
from database import get_db
from routers.deps import get_current_user

router = APIRouter(prefix="/api/contenus", tags=["Contenus Culturels"])


@router.get("/mes-contributions", response_model=List[schemas.ContenuOut])
async def mes_contributions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Historique des publications de l'utilisateur connecté."""
    result = await db.execute(
        select(ContenuCulturel)
        .where(ContenuCulturel.auteur_id == current_user.id)
        .order_by(ContenuCulturel.created_at.desc())
    )
    return result.scalars().all()


@router.get("/", response_model=List[schemas.ContenuOut])
async def lister_contenus(
    region_id: Optional[int] = None,
    categorie_id: Optional[int] = None,
    type_contenu: Optional[str] = None,
    recherche: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Liste les contenus avec filtres optionnels."""
    query = select(ContenuCulturel).where(ContenuCulturel.is_published == True, ContenuCulturel.is_verrouille == False)
    if region_id is not None:
        query = query.where(ContenuCulturel.region_id == region_id)
    if categorie_id is not None:
        query = query.where(ContenuCulturel.categorie_id == categorie_id)
    if type_contenu is not None:
        query = query.where(ContenuCulturel.type_contenu == type_contenu)
    if featured is not None:
        query = query.where(ContenuCulturel.is_featured == featured)
    if recherche:
        query = query.where(ContenuCulturel.titre.ilike(f"%{recherche}%"))
    query = query.order_by(ContenuCulturel.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/par-type/{type_contenu}", response_model=List[schemas.ContenuOut])
async def lister_par_type(
    type_contenu: str,
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Liste les contenus d'un type spécifique (masque, gastronomie, etc.)."""
    result = await db.execute(
        select(ContenuCulturel)
        .where(ContenuCulturel.type_contenu == type_contenu, ContenuCulturel.is_published == True)
        .order_by(ContenuCulturel.likes.desc())
        .limit(limit)
    )
    return result.scalars().all()


@router.get("/{contenu_id}", response_model=schemas.ContenuOut)
async def obtenir_contenu(contenu_id: int, db: AsyncSession = Depends(get_db)):
    """Obtient un contenu et incrémente les vues."""
    result = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    contenu = result.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable")
    contenu.vues += 1
    db.add(contenu)
    await db.commit()
    await db.refresh(contenu)
    return contenu


@router.post("/", response_model=schemas.ContenuOut, status_code=201)
async def creer_contenu(
    contenu: schemas.ContenuCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crée un nouveau contenu culturel (utilisateur connecté)."""
    nouveau = ContenuCulturel(**contenu.model_dump(), auteur_id=current_user.id)
    db.add(nouveau)
    current_user.contributions_count += 1
    db.add(current_user)
    await db.commit()
    await db.refresh(nouveau)
    return nouveau


@router.put("/{contenu_id}", response_model=schemas.ContenuOut)
async def modifier_contenu(
    contenu_id: int,
    contenu_update: schemas.ContenuCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Modifie un contenu (auteur ou admin uniquement)."""
    result = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    contenu = result.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable")
    if contenu.auteur_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Non autorisé à modifier ce contenu")
    for key, value in contenu_update.model_dump().items():
        setattr(contenu, key, value)
    await db.commit()
    await db.refresh(contenu)
    return contenu


@router.delete("/{contenu_id}", response_model=schemas.MessageReponse)
async def supprimer_contenu(
    contenu_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Supprime un contenu (auteur ou admin)."""
    result = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    contenu = result.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable")
    if contenu.auteur_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Non autorisé")
    await db.delete(contenu)
    await db.commit()
    return {"message": "Contenu supprimé", "success": True}
