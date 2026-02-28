# =============================================================================
#  — Routeur Profil Utilisateur
# Consultation, modification, suppression du profil
# =============================================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

import schemas
from models import User
from database import get_db
from routers.deps import get_current_user
from services.authentification_service import get_password_hash

router = APIRouter(prefix="/api/profil", tags=["Profil"])


@router.get("/", response_model=schemas.UserOut)
@router.get("/moi", response_model=schemas.UserOut)
async def obtenir_mon_profil(current_user: User = Depends(get_current_user)):
    """Retourne le profil complet de l'utilisateur connecté."""
    return current_user


@router.patch("/moi", response_model=schemas.UserOut)
async def modifier_mon_profil(
    mise_a_jour: schemas.UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Met à jour les champs modifiables du profil."""
    update_data = mise_a_jour.model_dump(exclude_unset=True)
    if "username" in update_data:
        existing = await db.execute(
            select(User).where(User.username == update_data["username"], User.id != current_user.id)
        )
        if existing.scalars().first():
            raise HTTPException(status_code=400, detail="Ce nom d'utilisateur est déjà pris")
    for key, value in update_data.items():
        setattr(current_user, key, value)
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.delete("/moi", response_model=schemas.MessageReponse)
async def supprimer_mon_compte(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Désactive le compte de l'utilisateur (soft delete)."""
    current_user.is_active = False
    db.add(current_user)
    await db.commit()
    return {"message": "Compte désactivé avec succès", "success": True}
