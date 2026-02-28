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
    EXPLORATEUR = "explorateur"
    CONTRIBUTEUR = "contributeur"
    GARDIEN = "gardien"
    ADMIN = "admin"


class TypeUtilisateur(str, Enum):
    LOCAL = "local"
    TOURISTE = "touriste"


class TypeContenu(str, Enum):
    MASQUE = "masque"
    GASTRONOMIE = "gastronomie"
    LEGENDE = "legende"
    SITE = "site"
    MUSIQUE = "musique"
    RITUEL = "rituel"
    CONTE = "conte"
    DANSE = "danse"
    ART = "art"


class TypePromotion(str, Enum):
    SITE = "site"
    MOSQUEE = "mosquee"
    MUSIQUE = "musique"
    LEGENDE = "legende"
    TOURISTE = "touriste"
    TALENT = "talent"


# ─── UTILISATEURS ────────────────────────────────────────────────────────────


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    nom_complet: Optional[str] = None
    telephone: Optional[str] = None
    pays: Optional[str] = "Côte d'Ivoire"
    ville: Optional[str] = None
    type_utilisateur: TypeUtilisateur = TypeUtilisateur.LOCAL


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
    type_utilisateur: TypeUtilisateur = TypeUtilisateur.LOCAL
    is_premium: bool = False
    is_admin: bool = False
    is_active: bool = True
    is_verrouille: bool = False
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
    username: Optional[str] = None
    nom_complet: Optional[str] = None
    email: Optional[str] = None
    is_premium: Optional[bool] = None
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None
    role: Optional[RoleUtilisateur] = None
    type_utilisateur: Optional[TypeUtilisateur] = None


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
    couleur_theme: str = "#E67E22"
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
    is_premium: bool = False


class ContenuCreate(ContenuBase):
    pass


class ContenuOut(ContenuBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    auteur_id: Optional[int] = None
    vues: int = 0
    likes: int = 0
    nb_signalements: int = 0
    is_verrouille: bool = False
    is_published: bool = True
    is_featured: bool = False
    created_at: Optional[datetime] = None


class SignalementCreate(BaseModel):
    motif: Optional[str] = None


class SignaleurOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    nom_complet: Optional[str] = None


# ─── PROMOTIONS ──────────────────────────────────────────────────────────────


class PromotionBase(BaseModel):
    titre: str
    type_promotion: TypePromotion
    description: Optional[str] = None
    texte_complet: Optional[str] = None
    numero_contact: Optional[str] = None
    image_url: Optional[str] = None
    adresse: Optional[str] = None
    note_popularite: int = 50


class PromotionCreate(PromotionBase):
    pass


class PromotionUpdate(BaseModel):
    titre: Optional[str] = None
    type_promotion: Optional[TypePromotion] = None
    description: Optional[str] = None
    texte_complet: Optional[str] = None
    numero_contact: Optional[str] = None
    image_url: Optional[str] = None
    adresse: Optional[str] = None
    note_popularite: Optional[int] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None


class PromotionOut(PromotionBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    vues: int = 0
    is_featured: bool = False
    is_active: bool = True
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
    total_promotions: int = 0
    contenus_par_type: Dict[str, int] = {}
    utilisateurs_premium: int = 0
    utilisateurs_touristes: int = 0
    utilisateurs_locaux: int = 0
