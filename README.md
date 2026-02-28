# IvoCulture - Documentation Technique

Application mobile intelligente pour la presentation et la transmission de la culture ivoirienne.

---

## Description

IvoCulture permet aux utilisateurs de decouvrir les regions, contes, musiques, danses, cuisines et arts ivoiriens via une interface moderne, immersive et personnalisee. Le systeme intelligent recommande du contenu selon les interactions et preferences. Transitions fluides entre regions, storytelling immersif, navigation TikTok-like ultra-simple.

---

## Technologies

| Couche      | Technologies |
|-------------|-------------|
| Frontend    | Expo 54, React Native 0.81, NativeBase 3, Reanimated 4, React Navigation 7, TanStack Query 5, Axios |
| Backend     | FastAPI, SQLAlchemy 2.0 async, Pydantic v2, SQLAdmin, JWT (python-jose), passlib bcrypt |
| Base donnees| SQLite (dev) / PostgreSQL (prod) via variable d'environnement |
| Tests       | pytest + httpx (backend), Jest (frontend) |

---

## Architecture du projet

```
niveau2/
  backend/
    main.py                 # Point d'entree FastAPI + lifespan
    database.py             # Moteur SQLAlchemy async
    admin.py                # Panel admin SQLAdmin avec authentification
    models/
      __init__.py           # User, Region, ContenuCulturel, InteractionUtilisateur
    schemas/
      __init__.py           # Schemas Pydantic v2 (UserOut, ContenuOut, etc.)
    routers/
      authentification_routeur.py   # POST /auth/register, /auth/login, GET /auth/me
      regions_routeur.py            # GET /regions/, GET /regions/{id}
      contenus_routeur.py           # GET/POST/PUT/DELETE /contenus/
      interactions_routeur.py       # POST /interactions/
      recommandations_routeur.py    # GET /recommandations/
      profil_routeur.py             # GET/PATCH /profil/moi
      favoris_routeur.py            # GET/POST/DELETE /favoris/
      deps.py                       # Dependance JWT get_current_user
    services/
      authentification_service.py   # Hash bcrypt, creation JWT
    test_auth.py                    # Tests authentification
    test_regions.py                 # Tests regions et contenus
    requirements.txt
    .env.example

  Pang/                     # Application Expo (frontend)
    App.tsx                 # Theme NativeBase (Or Kente + Foret) + Providers
    constants/
      couleurs.ts           # Design tokens (couleurs, espacements, rayons)
    src/
      api/
        client.ts           # Instance Axios avec intercepteur JWT
      navigation/
        AppNavigator.tsx    # Stack principal (13 ecrans)
        TabNavigator.tsx    # Onglets animes TikTok-like (Reanimated)
      screens/
        EcranDemarrage.tsx          # Splash avec verification token
        EcranOnboarding.tsx         # 4 slides de decouverte
        EcranConnexion.tsx          # Formulaire connexion JWT
        EcranInscription.tsx        # Formulaire inscription
        EcranAccueil.tsx            # Accueil : regions vedettes + recommandations
        EcranRegions.tsx            # Scroll horizontal pleine page + interpolation couleur
        EcranDetailRegion.tsx       # Detail region + contenus filtres par API
        EcranDetailContenu.tsx      # Parallax immersif + like/favori (mutations)
        EcranDecouverte.tsx         # Recherche + filtres type + liste contenus
        EcranCreationContenu.tsx    # Formulaire creation (region dropdown API)
        EcranEditionContenu.tsx     # Modification + suppression contenu
        EcranProfil.tsx             # Profil, favoris, premium, deconnexion
        EcranFavoris.tsx            # Liste des favoris utilisateur
      components/
        CarteContenu.tsx            # Carte reutilisable pour un contenu culturel
        CarteRegion.tsx             # Carte reutilisable pour une region
```

---

## Routes API (resumees)

| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | /api/auth/register | Inscription | Non |
| POST | /api/auth/login | Connexion (retourne JWT) | Non |
| GET | /api/auth/me | Profil courant | Oui |
| GET | /api/regions/ | Liste des regions | Non |
| GET | /api/regions/{id} | Detail region | Non |
| GET | /api/contenus/ | Liste contenus (filtre: region_id, type_contenu, recherche) | Non |
| GET | /api/contenus/{id} | Detail contenu (incremente vues) | Non |
| POST | /api/contenus/ | Creer contenu | Oui |
| PUT | /api/contenus/{id} | Modifier contenu | Oui |
| DELETE | /api/contenus/{id} | Supprimer contenu | Oui |
| POST | /api/interactions/ | Creer interaction (like, commentaire) | Oui |
| GET | /api/recommandations/ | Contenus recommandes (tri popularite) | Non |
| GET | /api/profil/moi | Mon profil | Oui |
| PATCH | /api/profil/moi | Modifier preferences | Oui |
| GET | /api/favoris/ | Mes contenus favoris | Oui |
| POST | /api/favoris/{id} | Ajouter un favori | Oui |
| DELETE | /api/favoris/{id} | Retirer un favori | Oui |

Panel admin : `http://localhost:8000/admin` (identifiants dans .env)

---

## Palette de couleurs

| Token | Hex | Usage |
|-------|-----|-------|
| ivoire.500 | #C4A02A | Or Kente — couleur principale |
| foret.500 | #1E6B45 | Vert foret profond |
| terre.500 | #8B5C34 | Brun terre laterite |
| fond creme | #F8F4EC | Fond des ecrans clairs |
| fond sombre | #0D1410 | Fond barre d'onglets |

---

## Installation et lancement

### Backend

```bash
cd backend
cp .env.example .env
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Admin : http://VOTRE_IP:8000/admin (login: admin / ivoculture2024!)

### Frontend

```bash
cd Pang
cp .env.example .env           # Creer si necessaire
npm install
npx expo start
```

Scanner le QR code avec Expo Go sur telephone physique.

Variable `EXPO_PUBLIC_API_URL` dans .env : `http://VOTRE_IP:8000/api`

### Tests backend

```bash
cd backend
pytest test_auth.py test_regions.py -v
```

---

## Modele economique

- **Freemium** : gratuit pour contenus de base + recommandations
- **Premium** (4,99 EUR/mois) : offline, contenus exclusifs, zero pub
- **Publicites contextuelles** legeres dans Decouverte
- **Commission** 10% sur dons volontaires aux createurs
- **Scalabilite** : Railway / Render (gratuit vers payant)

---

## Equipe et contact

Projet developpe pour le hackathon ESATIC 2026.
