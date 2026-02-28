# =============================================================================
# IvoCulture — Routeur Authentification
# Inscription, connexion, profil courant
# =============================================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.future import select

import schemas
from models import User
from database import get_db
from services.authentification_service import verify_password, get_password_hash, create_access_token
from routers.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentification"])


@router.post("/register", response_model=schemas.UserOut, status_code=201)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    """Inscription d'un nouvel utilisateur."""
    result = await db.execute(
        select(User).where((User.email == user.email) | (User.username == user.username))
    )
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email ou nom d'utilisateur déjà utilisé")

    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=get_password_hash(user.password),
        nom_complet=user.nom_complet,
        telephone=user.telephone,
        pays=user.pays,
        ville=user.ville,
        type_utilisateur=user.type_utilisateur,
        preferences=[],
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Connexion par email + mot de passe, retourne un JWT."""
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Compte désactivé")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=schemas.UserOut)
async def me(current_user: User = Depends(get_current_user)):
    """Retourne le profil de l'utilisateur connecté."""
    return current_user
