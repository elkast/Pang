from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

import schemas
from models import InteractionUtilisateur, User, ContenuCulturel
from database import get_db
from routers.deps import get_current_user

router = APIRouter(prefix="/api/interactions", tags=["Interactions"])


@router.post("/", response_model=schemas.InteractionOut)
async def creer_interaction(
    interaction: schemas.InteractionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crée une interaction (like, favori, commentaire, vue, partage)."""
    res = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == interaction.contenu_id))
    contenu = res.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable pour cette interaction")

    if interaction.type_interaction == "LIKE":
        contenu.likes += 1
        db.add(contenu)

    nouvelle_interaction = InteractionUtilisateur(
        utilisateur_id=current_user.id,
        contenu_id=interaction.contenu_id,
        type_interaction=interaction.type_interaction,
        commentaire=interaction.commentaire,
    )
    db.add(nouvelle_interaction)
    await db.commit()
    await db.refresh(nouvelle_interaction)
    return nouvelle_interaction
