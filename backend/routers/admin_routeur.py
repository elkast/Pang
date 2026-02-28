# =============================================================================
# IvoCulture — Routeur Administration
# Dashboard, gestion utilisateurs, statistiques, modération contenus, CRUD complet
# =============================================================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func as sql_func
from typing import List

import schemas
from models import User, ContenuCulturel, Region, InteractionUtilisateur, Categorie, Promotion
from database import get_db
from routers.deps import get_current_admin
from services.authentification_service import get_password_hash

router = APIRouter(prefix="/api/admin", tags=["Administration"])


# ══════════════════════════════════════════════════════════════════════════════
# STATISTIQUES
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/stats", response_model=schemas.StatsAdmin)
async def obtenir_statistiques(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Tableau de bord : statistiques globales."""
    total_users = (await db.execute(select(sql_func.count(User.id)))).scalar() or 0
    total_contenus = (await db.execute(select(sql_func.count(ContenuCulturel.id)))).scalar() or 0
    total_regions = (await db.execute(select(sql_func.count(Region.id)))).scalar() or 0
    total_interactions = (await db.execute(select(sql_func.count(InteractionUtilisateur.id)))).scalar() or 0
    total_promotions = (await db.execute(select(sql_func.count(Promotion.id)))).scalar() or 0
    premium = (await db.execute(select(sql_func.count(User.id)).where(User.is_premium == True))).scalar() or 0
    touristes = (await db.execute(select(sql_func.count(User.id)).where(User.type_utilisateur == "touriste"))).scalar() or 0
    locaux = (await db.execute(select(sql_func.count(User.id)).where(User.type_utilisateur == "local"))).scalar() or 0

    type_counts = await db.execute(
        select(ContenuCulturel.type_contenu, sql_func.count(ContenuCulturel.id))
        .group_by(ContenuCulturel.type_contenu)
    )
    contenus_par_type = {row[0]: row[1] for row in type_counts.all() if row[0]}

    return schemas.StatsAdmin(
        total_utilisateurs=total_users,
        total_contenus=total_contenus,
        total_regions=total_regions,
        total_interactions=total_interactions,
        total_promotions=total_promotions,
        contenus_par_type=contenus_par_type,
        utilisateurs_premium=premium,
        utilisateurs_touristes=touristes,
        utilisateurs_locaux=locaux,
    )


# ══════════════════════════════════════════════════════════════════════════════
# GESTION UTILISATEURS
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/utilisateurs", response_model=List[schemas.UserOut])
async def lister_utilisateurs(
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(User).order_by(User.created_at.desc()).limit(limit).offset(offset)
    )
    return result.scalars().all()


@router.get("/utilisateurs/{user_id}", response_model=schemas.UserOut)
async def obtenir_utilisateur(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return user


@router.post("/utilisateurs", response_model=schemas.UserOut)
async def creer_utilisateur(
    user_data: schemas.UserCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà utilisé")

    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        nom_complet=user_data.nom_complet,
        telephone=user_data.telephone,
        pays=user_data.pays,
        ville=user_data.ville,
        type_utilisateur=user_data.type_utilisateur,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.patch("/utilisateurs/{user_id}", response_model=schemas.UserOut)
async def modifier_utilisateur(
    user_id: int,
    update: schemas.UserAdminUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(user, key, value)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.delete("/utilisateurs/{user_id}", response_model=schemas.MessageReponse)
async def desactiver_utilisateur(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Impossible de se désactiver soi-même")
    user.is_active = False
    await db.commit()
    return {"message": f"Utilisateur '{user.username}' désactivé", "success": True}


# ══════════════════════════════════════════════════════════════════════════════
# GESTION CONTENUS (CRUD)
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/contenus", response_model=List[schemas.ContenuOut])
async def lister_contenus_admin(
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(ContenuCulturel).order_by(ContenuCulturel.created_at.desc()).limit(limit).offset(offset)
    )
    return result.scalars().all()


@router.get("/contenus/{contenu_id}", response_model=schemas.ContenuOut)
async def obtenir_contenu_admin(
    contenu_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    contenu = result.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable")
    return contenu


@router.post("/contenus", response_model=schemas.ContenuOut, status_code=201)
async def creer_contenu_admin(
    contenu: schemas.ContenuCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Crée un contenu culturel (admin)."""
    nouveau = ContenuCulturel(**contenu.model_dump(), auteur_id=admin.id)
    db.add(nouveau)
    await db.commit()
    await db.refresh(nouveau)
    return nouveau


@router.patch("/contenus/{contenu_id}", response_model=schemas.ContenuOut)
async def modifier_contenu_admin(
    contenu_id: int,
    update: schemas.ContenuCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    contenu = result.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(contenu, key, value)
    db.add(contenu)
    await db.commit()
    await db.refresh(contenu)
    return contenu


@router.delete("/contenus/{contenu_id}", response_model=schemas.MessageReponse)
async def supprimer_contenu_admin(
    contenu_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    contenu = result.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable")
    await db.delete(contenu)
    await db.commit()
    return {"message": f"Contenu '{contenu.titre}' supprimé", "success": True}


@router.patch("/contenus/{contenu_id}/publier", response_model=schemas.ContenuOut)
async def publier_contenu(
    contenu_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    contenu = result.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable")
    contenu.is_published = not contenu.is_published
    await db.commit()
    await db.refresh(contenu)
    return contenu


@router.patch("/contenus/{contenu_id}/featured", response_model=schemas.ContenuOut)
async def toggle_featured(
    contenu_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(ContenuCulturel).where(ContenuCulturel.id == contenu_id))
    contenu = result.scalars().first()
    if not contenu:
        raise HTTPException(status_code=404, detail="Contenu introuvable")
    contenu.is_featured = not contenu.is_featured
    await db.commit()
    await db.refresh(contenu)
    return contenu


# ══════════════════════════════════════════════════════════════════════════════
# GESTION RÉGIONS (CRUD)
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/regions", response_model=List[schemas.RegionOut])
async def lister_regions_admin(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Region).order_by(Region.nom))
    return result.scalars().all()


@router.post("/regions", response_model=schemas.RegionOut)
async def creer_region_admin(
    region_data: schemas.RegionCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Region).where(Region.nom == region_data.nom))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Région déjà existante")
    new_region = Region(**region_data.model_dump())
    db.add(new_region)
    await db.commit()
    await db.refresh(new_region)
    return new_region


@router.patch("/regions/{region_id}", response_model=schemas.RegionOut)
async def modifier_region_admin(
    region_id: int,
    update: schemas.RegionCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Region).where(Region.id == region_id))
    region = result.scalars().first()
    if not region:
        raise HTTPException(status_code=404, detail="Région introuvable")
    for key, value in update.model_dump().items():
        setattr(region, key, value)
    db.add(region)
    await db.commit()
    await db.refresh(region)
    return region


@router.delete("/regions/{region_id}", response_model=schemas.MessageReponse)
async def supprimer_region_admin(
    region_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Region).where(Region.id == region_id))
    region = result.scalars().first()
    if not region:
        raise HTTPException(status_code=404, detail="Région introuvable")
    await db.delete(region)
    await db.commit()
    return {"message": f"Région '{region.nom}' supprimée", "success": True}


# ══════════════════════════════════════════════════════════════════════════════
# GESTION PROMOTIONS (CRUD)
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/promotions", response_model=List[schemas.PromotionOut])
async def lister_promotions_admin(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Promotion).order_by(Promotion.note_popularite.desc()))
    return result.scalars().all()


@router.post("/promotions", response_model=schemas.PromotionOut, status_code=201)
async def creer_promotion_admin(
    promotion_data: schemas.PromotionCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    new_promo = Promotion(**promotion_data.model_dump())
    db.add(new_promo)
    await db.commit()
    await db.refresh(new_promo)
    return new_promo


@router.patch("/promotions/{promotion_id}", response_model=schemas.PromotionOut)
async def modifier_promotion_admin(
    promotion_id: int,
    update: schemas.PromotionUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Promotion).where(Promotion.id == promotion_id))
    promo = result.scalars().first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promotion introuvable")
    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(promo, key, value)
    db.add(promo)
    await db.commit()
    await db.refresh(promo)
    return promo


@router.delete("/promotions/{promotion_id}", response_model=schemas.MessageReponse)
async def supprimer_promotion_admin(
    promotion_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Promotion).where(Promotion.id == promotion_id))
    promo = result.scalars().first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promotion introuvable")
    await db.delete(promo)
    await db.commit()
    return {"message": f"Promotion '{promo.titre}' supprimée", "success": True}


# ══════════════════════════════════════════════════════════════════════════════
# GESTION CATÉGORIES (CRUD)
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/categories", response_model=List[schemas.CategorieOut])
async def lister_categories_admin(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Categorie).order_by(Categorie.ordre))
    return result.scalars().all()


@router.post("/categories", response_model=schemas.CategorieOut)
async def creer_categorie_admin(
    categorie_data: schemas.CategorieCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Categorie).where(Categorie.slug == categorie_data.slug))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Slug de catégorie déjà utilisé")
    new_cat = Categorie(**categorie_data.model_dump())
    db.add(new_cat)
    await db.commit()
    await db.refresh(new_cat)
    return new_cat


@router.patch("/categories/{categorie_id}", response_model=schemas.CategorieOut)
async def modifier_categorie_admin(
    categorie_id: int,
    update: schemas.CategorieCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Categorie).where(Categorie.id == categorie_id))
    cat = result.scalars().first()
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie introuvable")
    for key, value in update.model_dump().items():
        setattr(cat, key, value)
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat


@router.delete("/categories/{categorie_id}", response_model=schemas.MessageReponse)
async def supprimer_categorie_admin(
    categorie_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    result = await db.execute(select(Categorie).where(Categorie.id == categorie_id))
    cat = result.scalars().first()
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie introuvable")
    await db.delete(cat)
    await db.commit()
    return {"message": f"Catégorie '{cat.nom}' supprimée", "success": True}


# ══════════════════════════════════════════════════════════════════════════════
# SEED INITIAL
# ══════════════════════════════════════════════════════════════════════════════

@router.post("/seed", response_model=schemas.MessageReponse)
async def seed_database(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Peuple la base avec des données initiales de Côte d'Ivoire."""
    existing = await db.execute(select(sql_func.count(Region.id)))
    if (existing.scalar() or 0) > 0:
        return {"message": "Base déjà peuplée", "success": False}

    regions = [
        Region(nom="Grand Abidjan", description="Capitale économique, carrefour des cultures ivoiriennes", image_url="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800", couleur_theme="#E67E22"),
        Region(nom="Pays Baoulé", description="Terre des pagnes kita, du masque Goli et des traditions Akan", image_url="https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800", couleur_theme="#C4A02A"),
        Region(nom="Nord Sénoufo", description="Bois sacrés, Poro, masques Kpélié et artisanat ancestral", image_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800", couleur_theme="#8B5C34"),
        Region(nom="Pays Bété", description="Forêts denses, masques Guéré et danses rituelles", image_url="https://images.unsplash.com/photo-1542104473-ebcf1d44005e?w=800", couleur_theme="#1E6B45"),
        Region(nom="Grand-Bassam", description="Première capitale, patrimoine UNESCO", image_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800", couleur_theme="#8B4513"),
    ]
    for r in regions:
        db.add(r)

    categories = [
        Categorie(nom="Masques Sacrés", slug="masques", description="Masques traditionnels ivoiriens", icone="happy-outline", couleur="#E67E22", ordre=1),
        Categorie(nom="Gastronomie", slug="gastronomie", description="Cuisine ivoirienne", icone="restaurant-outline", couleur="#D4781F", ordre=2),
        Categorie(nom="Légendes & Mythes", slug="legendes", description="Contes et récits fondateurs", icone="book-outline", couleur="#C4A02A", ordre=3),
        Categorie(nom="Sites de Pouvoir", slug="sites", description="Lieux sacrés et patrimoine", icone="location-outline", couleur="#1E6B45", ordre=4),
        Categorie(nom="Grimoire Musical", slug="musique", description="Instruments et mélodies", icone="musical-notes-outline", couleur="#8B5C34", ordre=5),
        Categorie(nom="Rituels", slug="rituels", description="Cérémonies initiatiques", icone="flame-outline", couleur="#9D2235", ordre=6),
    ]
    for c in categories:
        db.add(c)

    promotions = [
        Promotion(titre="Grande Mosquée d'Abidjan", type_promotion="mosquee", description="La plus grande mosquée de Côte d'Ivoire", numero_contact="+225 27 20 21 00 00", image_url="https://images.unsplash.com/photo-1518729671742-6cdd3780a21d?w=800", note_popularite=92, is_featured=True),
        Promotion(titre="Parc National de Taï", type_promotion="site", description="Forêt tropicale primaire, patrimoine mondial UNESCO", numero_contact="+225 27 34 70 00 00", image_url="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", note_popularite=88, is_featured=True),
        Promotion(titre="Masque Goli - Korhogo", type_promotion="musique", description="Art musical traditionnel du Nord", numero_contact="+225 27 36 86 00 00", image_url="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800", note_popularite=75),
        Promotion(titre="Légende du Lac Sacré", type_promotion="legende", description="Découvrez les mystères du lac de Yamoussoukro", numero_contact="+225 27 30 64 00 00", image_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800", note_popularite=70),
    ]
    for p in promotions:
        db.add(p)

    await db.commit()
    return {"message": "Base peuplée avec 5 régions, 6 catégories et 4 promotions", "success": True}
