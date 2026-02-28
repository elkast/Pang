# =============================================================================
# IvoCulture — Modèles SQLAlchemy
# Base de données relationnelle pour la culture ivoirienne
# =============================================================================

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
    JSON,
    Boolean,
    Float,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


# ─── ENUMS ───────────────────────────────────────────────────────────────────


class RoleUtilisateur(str, enum.Enum):
    """Rôles disponibles pour les utilisateurs"""

    EXPLORATEUR = "explorateur"
    CONTRIBUTEUR = "contributeur"
    GARDIEN = "gardien"
    ADMIN = "admin"


class TypeUtilisateur(str, enum.Enum):
    """Type d'utilisateur : local ou touriste"""

    LOCAL = "local"
    TOURISTE = "touriste"


class TypeContenu(str, enum.Enum):
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


class TypeInteraction(str, enum.Enum):
    """Types d'interactions utilisateur"""

    LIKE = "LIKE"
    FAVORI = "FAVORI"
    COMMENTAIRE = "COMMENTAIRE"
    VUE = "VUE"
    PARTAGE = "PARTAGE"


class TypePromotion(str, enum.Enum):
    """Types d'entités promues sur la plateforme"""

    SITE = "site"
    MOSQUEE = "mosquee"
    MUSIQUE = "musique"
    LEGENDE = "legende"
    TOURISTE = "touriste"


# ─── MODÈLES ─────────────────────────────────────────────────────────────────


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nom_complet = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    telephone = Column(String, nullable=True)
    pays = Column(String, default="Côte d'Ivoire")
    ville = Column(String, nullable=True)
    preferences = Column(JSON, default=list)
    type_utilisateur = Column(SQLEnum(TypeUtilisateur), default=TypeUtilisateur.LOCAL)
    is_premium = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    role = Column(SQLEnum(RoleUtilisateur), default=RoleUtilisateur.EXPLORATEUR)
    contributions_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    interactions = relationship(
        "InteractionUtilisateur",
        back_populates="utilisateur",
        cascade="all, delete-orphan",
    )
    contributions = relationship(
        "ContenuCulturel", back_populates="auteur", cascade="all, delete-orphan"
    )


class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True)
    nom = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    image_url = Column(String)
    couleur_theme = Column(String, default="#E67E22")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    population = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    contenus = relationship("ContenuCulturel", back_populates="region")


class Categorie(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    nom = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    icone = Column(String, nullable=True)
    couleur = Column(String, default="#E67E22")
    ordre = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    contenus = relationship("ContenuCulturel", back_populates="categorie")


class ContenuCulturel(Base):
    __tablename__ = "contenus"
    id = Column(Integer, primary_key=True)
    titre = Column(String, index=True, nullable=False)
    slug = Column(String, index=True, nullable=True)
    type_contenu = Column(SQLEnum(TypeContenu), index=True)
    description = Column(Text)
    texte_complet = Column(Text)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True)
    categorie_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    auteur_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    image_url = Column(String)
    audio_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    metadata_extra = Column(JSON, default=dict)
    vues = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    # Contenu premium : réservé aux touristes abonnés
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    region = relationship("Region", back_populates="contenus")
    categorie = relationship("Categorie", back_populates="contenus")
    auteur = relationship("User", back_populates="contributions")
    interactions = relationship(
        "InteractionUtilisateur", back_populates="contenu", cascade="all, delete-orphan"
    )


class InteractionUtilisateur(Base):
    __tablename__ = "interactions"
    id = Column(Integer, primary_key=True)
    utilisateur_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    contenu_id = Column(Integer, ForeignKey("contenus.id"), nullable=False)
    type_interaction = Column(SQLEnum(TypeInteraction), index=True)
    commentaire = Column(Text, nullable=True)
    note = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    utilisateur = relationship("User", back_populates="interactions")
    contenu = relationship("ContenuCulturel", back_populates="interactions")


class Promotion(Base):
    """Entité promue sur la plateforme : site, mosquée, musique, légende, touriste"""
    __tablename__ = "promotions"
    id = Column(Integer, primary_key=True)
    titre = Column(String, index=True, nullable=False)
    type_promotion = Column(SQLEnum(TypePromotion), index=True, nullable=False)
    description = Column(Text, nullable=True)
    texte_complet = Column(Text, nullable=True)
    numero_contact = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    adresse = Column(String, nullable=True)
    # Note de notoriété de 0 à 100
    note_popularite = Column(Integer, default=50)
    # Nombre de vues / partages enregistrés
    vues = Column(Integer, default=0)
    # Un élément peut être mis en avant sur l'accueil
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
