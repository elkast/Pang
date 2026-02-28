# =============================================================================
# IvoCulture — Routeur Signalements
# 5 signalements = verrouillage du contenu et de l'auteur
# =============================================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

import schemas
from models import ContenuCulturel, User, Signalement
from database import get_db
from routers.deps import get_current_user

router = APIRouter(prefix="/api/signalements", tags=["Signalements"])
SEUIL_VERROUILLAGE = 5


@router.post("/contenu/{contenu_id}")
async def signaler_contenu(
    contenu_id: int,
    body: schemas.SignalementCreate | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Signaler un contenu. À 5 signalements: verrouillage contenu + auteur."""
    res = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    contenu = res.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable")
    if contenu.is_verrouille:
        raise HTTPException(status_code=400, detail="Contenu déjà verrouillé")

    # Éviter doublon
    existing = await db.execute(
        select(Signalement)
        .where(Signalement.contenu_id == contenu_id, Signalement.signaleur_id == current_user.id)
    )
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Vous avez déjà signalé ce contenu")

    signalement = Signalement(
        contenu_id=contenu_id,
        signaleur_id=current_user.id,
        motif=body.motif if body and body.motif else "fausse_info",
    )
    db.add(signalement)
    contenu.nb_signalements += 1

    if contenu.nb_signalements >= SEUIL_VERROUILLAGE:
        contenu.is_verrouille = True
        contenu.is_published = False
        if contenu.auteur_id:
            author_res = await db.execute(select(User).where(User.id == contenu.auteur_id))
            auteur = author_res.scalars().first()
            if auteur:
                auteur.is_verrouille = True

    await db.commit()
    return {"message": "Signalement enregistré", "nb_signalements": contenu.nb_signalements}


@router.get("/contenu/{contenu_id}/signaleurs")
async def liste_signaleurs(
    contenu_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Liste les profils des signaleurs (admin ou modérateur)."""
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Réservé aux administrateurs")

    result = await db.execute(
        select(Signalement, User.username, User.nom_complet)
        .join(User, Signalement.signaleur_id == User.id)
        .where(Signalement.contenu_id == contenu_id)
    )
    rows = result.all()
    return {
        "contenu_id": contenu_id,
        "nb_signalements": len(rows),
        "signaleurs": [{"username": r[1], "nom_complet": r[2]} for r in rows],
    }
