# =============================================================================
# IvoCulture — Interface d'administration SQLAdmin
# Accès : http://localhost:8000/admin
# =============================================================================

import os
from sqladmin import Admin, ModelView
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from models import User, Region, ContenuCulturel, InteractionUtilisateur, Promotion
from database import engine
from fastapi import FastAPI


# ─── AUTHENTIFICATION ADMIN ──────────────────────────────────────────────────

class AuthentificationAdmin(AuthenticationBackend):
    """Authentification simple pour protéger le panel d'administration."""

    async def login(self, request: Request) -> bool:
        form = await request.form()
        nom = os.getenv("ADMIN_NOM", "admin")
        mdp = os.getenv("ADMIN_MDP", "ivoculture2024!")
        if form.get("username") == nom and form.get("password") == mdp:
            request.session.update({"admin_connecte": "vrai"})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return request.session.get("admin_connecte") == "vrai"


# ─── VUES D'ADMINISTRATION ──────────────────────────────────────────────────

class UtilisateurAdmin(ModelView, model=User):
    name = "Utilisateur"
    name_plural = "Utilisateurs"
    icon = "fa-solid fa-users"
    column_list = [User.id, User.username, User.email, User.type_utilisateur, User.is_premium, User.created_at]
    column_searchable_list = [User.username, User.email]
    column_sortable_list = [User.id, User.username, User.email, User.created_at]
    column_default_sort = [(User.created_at, True)]
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    page_size = 25


class RegionAdmin(ModelView, model=Region):
    name = "Région"
    name_plural = "Régions"
    icon = "fa-solid fa-map-location-dot"
    column_list = [Region.id, Region.nom, Region.couleur_theme, Region.image_url]
    column_searchable_list = [Region.nom]
    column_sortable_list = [Region.id, Region.nom]
    column_default_sort = [(Region.nom, False)]
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    page_size = 25


class ContenuAdmin(ModelView, model=ContenuCulturel):
    name = "Contenu Culturel"
    name_plural = "Contenus Culturels"
    icon = "fa-solid fa-book-open"
    column_list = [
        ContenuCulturel.id,
        ContenuCulturel.titre,
        ContenuCulturel.type_contenu,
        ContenuCulturel.region_id,
        ContenuCulturel.vues,
        ContenuCulturel.likes,
        ContenuCulturel.is_published,
    ]
    column_searchable_list = [ContenuCulturel.titre, ContenuCulturel.type_contenu]
    column_sortable_list = [
        ContenuCulturel.id,
        ContenuCulturel.titre,
        ContenuCulturel.vues,
        ContenuCulturel.likes,
    ]
    column_default_sort = [(ContenuCulturel.vues, True)]
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    page_size = 25


class InteractionAdmin(ModelView, model=InteractionUtilisateur):
    name = "Interaction"
    name_plural = "Interactions"
    icon = "fa-solid fa-heart"
    column_list = [
        InteractionUtilisateur.id,
        InteractionUtilisateur.type_interaction,
        InteractionUtilisateur.utilisateur_id,
        InteractionUtilisateur.contenu_id,
        InteractionUtilisateur.created_at,
    ]
    column_searchable_list = [InteractionUtilisateur.type_interaction]
    column_sortable_list = [
        InteractionUtilisateur.id,
        InteractionUtilisateur.created_at,
    ]
    column_default_sort = [(InteractionUtilisateur.created_at, True)]
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    page_size = 25


class PromotionAdmin(ModelView, model=Promotion):
    name = "Promotion"
    name_plural = "Promotions"
    icon = "fa-solid fa-star"
    column_list = [
        Promotion.id,
        Promotion.titre,
        Promotion.type_promotion,
        Promotion.numero_contact,
        Promotion.note_popularite,
        Promotion.is_active,
        Promotion.created_at,
    ]
    column_searchable_list = [Promotion.titre, Promotion.type_promotion]
    column_sortable_list = [Promotion.id, Promotion.titre, Promotion.note_popularite]
    column_default_sort = [(Promotion.note_popularite, True)]
    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True
    page_size = 25


# ─── MONTAGE DU PANEL ───────────────────────────────────────────────────────

def setup_admin(app: FastAPI):
    """Enregistre et monte le panel SQLAdmin sur l'application FastAPI."""
    authentification = AuthentificationAdmin(secret_key=os.getenv("SECRET_KEY", "ivo-culture-super-secret-key-123"))
    admin = Admin(app, engine, authentication_backend=authentification, title="IvoCulture Admin")
    admin.add_view(UtilisateurAdmin)
    admin.add_view(RegionAdmin)
    admin.add_view(ContenuAdmin)
    admin.add_view(InteractionAdmin)
    admin.add_view(PromotionAdmin)
    return admin
