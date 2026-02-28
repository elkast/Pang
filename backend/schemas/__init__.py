# =============================================================================
# IvoCulture — Schémas Pydantic v2
# Validation entrantes/sortantes pour toute l'API
# =============================================================================

from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


# ─── ENUMS ───────────────────────────────────────────────────────────────────


class RoleUtilisateur(str, Enum):
    """Rôles disponibles pour les utilisateurs"""

    EXPLORATEUR = "explorateur"
    CONTRIBUTEUR = "contributeur"
    GARDIEN = "gardien"
    ADMIN = "admin"


class TypeContenu(str, Enum):
    """Types de contenus culturels"""

    MASQUE = "masque"
    GASTRONOMIE = "gastronomie"
    LEGENDE = "legende"
    SITE = "site"
    MUSIQUE = "musique"
    RITUEL = "rituel"
    CONTE = "conte"
    DANSE = "danse"
    ART = "art"


# ─── UTILISATEURS ────────────────────────────────────────────────────────────


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    nom_complet: Optional[str] = None
    telephone: Optional[str] = None
    pays: Optional[str] = "Côte d'Ivoire"
    ville: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    username: str
    nom_complet: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    telephone: Optional[str] = None
    pays: Optional[str] = None
    ville: Optional[str] = None
    is_premium: bool = False
    is_admin: bool = False
    is_active: bool = True
    role: RoleUtilisateur = RoleUtilisateur.EXPLORATEUR
    preferences: List[str] = []
    contributions_count: int = 0
    created_at: datetime


class UserUpdate(BaseModel):
    username: Optional[str] = None
    nom_complet: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    telephone: Optional[str] = None
    pays: Optional[str] = None
    ville: Optional[str] = None
    preferences: Optional[List[str]] = None


class UserAdminUpdate(BaseModel):
    """Mise à jour admin - peut changer le rôle et le statut"""

    username: Optional[str] = None
    nom_complet: Optional[str] = None
    email: Optional[str] = None
    is_premium: Optional[bool] = None
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None
    role: Optional[RoleUtilisateur] = None


# ─── TOKENS JWT ──────────────────────────────────────────────────────────────


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class TokenData(BaseModel):
    email: Optional[str] = None


# ─── RÉGIONS ─────────────────────────────────────────────────────────────────


class RegionBase(BaseModel):
    nom: str
    description: str
    image_url: str
    couleur_theme: str = "#1E6B45"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    population: Optional[str] = None


class RegionCreate(RegionBase):
    pass


class RegionOut(RegionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool = True


# ─── CATÉGORIES ──────────────────────────────────────────────────────────────


class CategorieBase(BaseModel):
    nom: str
    slug: str
    description: Optional[str] = None
    icone: Optional[str] = None
    couleur: str = "#E67E22"
    ordre: int = 0


class CategorieCreate(CategorieBase):
    pass


class CategorieOut(CategorieBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool = True


# ─── CONTENUS CULTURELS ─────────────────────────────────────────────────────


class ContenuBase(BaseModel):
    titre: str
    type_contenu: TypeContenu
    description: str
    texte_complet: str = ""
    image_url: str = ""
    audio_url: Optional[str] = None
    video_url: Optional[str] = None
    tags: List[str] = []
    metadata_extra: Dict[str, Any] = {}
    region_id: Optional[int] = None
    categorie_id: Optional[int] = None


class ContenuCreate(ContenuBase):
    pass


class ContenuOut(ContenuBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    auteur_id: Optional[int] = None
    vues: int = 0
    likes: int = 0
    is_published: bool = True
    is_featured: bool = False
    created_at: Optional[datetime] = None


# ─── INTERACTIONS ────────────────────────────────────────────────────────────


class InteractionCreate(BaseModel):
    type_interaction: str
    commentaire: Optional[str] = None
    note: Optional[int] = None
    contenu_id: int


class InteractionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    utilisateur_id: int
    contenu_id: int
    type_interaction: str
    commentaire: Optional[str] = None
    note: Optional[int] = None
    created_at: datetime


# ─── UTILITAIRES ─────────────────────────────────────────────────────────────


class MessageReponse(BaseModel):
    message: str
    success: bool = True


class StatsAdmin(BaseModel):
    total_utilisateurs: int
    total_contenus: int
    total_regions: int
    total_interactions: int
    contenus_par_type: Dict[str, int] = {}
    utilisateurs_premium: int = 0
