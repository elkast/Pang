# =============================================================================
# IvoCulture — Routeur Favoris
# Gestion des contenus favoris de l'utilisateur connecté
# =============================================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

import schemas
from models import ContenuCulturel, InteractionUtilisateur, User
from database import get_db
from routers.deps import get_current_user

router = APIRouter(prefix="/api/favoris", tags=["Favoris"])


@router.get("/", response_model=List[schemas.ContenuOut])
async def lister_mes_favoris(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Sert : EcranFavoris — retourne tous les contenus favoris de l'utilisateur."""
    result = await db.execute(
        select(ContenuCulturel)
        .join(InteractionUtilisateur, InteractionUtilisateur.contenu_id == ContenuCulturel.id)
        .where(InteractionUtilisateur.utilisateur_id == current_user.id)
        .where(InteractionUtilisateur.type_interaction == "FAVORI")
    )
    return result.scalars().all()


@router.post("/{contenu_id}", response_model=schemas.InteractionOut)
async def ajouter_aux_favoris(
    contenu_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Ajoute un contenu aux favoris (crée une interaction FAVORI)."""
    # Vérifier l'existence du contenu
    res = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    if not res.scalars().first():
        raise HTTPException(status_code=404, detail="Contenu introuvable")

    # Vérifier si déjà en favoris
    existant = await db.execute(
        select(InteractionUtilisateur)
        .where(InteractionUtilisateur.utilisateur_id == current_user.id)
        .where(InteractionUtilisateur.contenu_id == contenu_id)
        .where(InteractionUtilisateur.type_interaction == "FAVORI")
    )
    if existant.scalars().first():
        raise HTTPException(status_code=400, detail="Déjà dans vos favoris")

    favori = InteractionUtilisateur(
        utilisateur_id=current_user.id,
        contenu_id=contenu_id,
        type_interaction="FAVORI",
    )
    db.add(favori)
    await db.commit()
    await db.refresh(favori)
    return favori


@router.delete("/{contenu_id}", response_model=schemas.MessageReponse)
async def retirer_des_favoris(
    contenu_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retire un contenu des favoris."""
    result = await db.execute(
        select(InteractionUtilisateur)
        .where(InteractionUtilisateur.utilisateur_id == current_user.id)
        .where(InteractionUtilisateur.contenu_id == contenu_id)
        .where(InteractionUtilisateur.type_interaction == "FAVORI")
    )
    favori = result.scalars().first()
    if not favori:
        raise HTTPException(status_code=404, detail="Ce contenu n'est pas dans vos favoris")
    await db.delete(favori)
    await db.commit()
    return {"message": "Retiré des favoris"}
