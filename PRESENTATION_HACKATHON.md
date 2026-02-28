# IvoCulture - Presentation Hackathon ESATIC 2026

---

## Slide 1 — Titre

**IvoCulture**
L'application intelligente pour la transmission de la culture ivoirienne.

---

## Slide 2 — Problematique

La culture ivoirienne (contes, danses, musiques, rituels) se perd progressivement aupres des jeunes generations.
- Les traditions orales disparaissent faute de supports numeriques attractifs
- Les jeunes sont absorbes par des contenus etrangers sur TikTok, Instagram, YouTube
- Aucune plateforme centralisee ne met en valeur les regions culturelles de Cote d'Ivoire

**Besoin : une application mobile immersive, moderne et intelligente pour redynamisser la transmission culturelle.**

---

## Slide 3 — Notre solution : IvoCulture

Application mobile (iOS + Android) qui permet de :
- Decouvrir les regions culturelles via des transitions immersives
- Lire des contes fondateurs en mode storytelling plein ecran
- Explorer musiques, danses, cuisines et rituels
- Recevoir des recommandations intelligentes basees sur les preferences
- Contribuer soi-meme au patrimoine culturel numerique

---

## Slide 4 — Interface Accueil

- Salutation personnalisee ("Akwaba, [Prenom]")
- Carrousel horizontal des regions a explorer
- Section "Selection intelligente pour vous" avec cartes animees
- Design : palette Or Kente (#C4A02A) + Foret profonde (#1E6B45)

---

## Slide 5 — Navigation des Regions

- Scroll horizontal pleine page entre les regions
- Transition de couleur de fond animee en temps reel (interpolation Reanimated)
- Chaque region affiche : nom, description, image immersive
- Bouton "Decouvrir cette region" vers le detail

---

## Slide 6 — Systeme intelligent de recommandation

- Analyse des interactions utilisateur (vues, likes, favoris)
- Correspondance par tags et popularite
- Tri automatique des contenus pertinents
- Evolutif : base pour un futur moteur ML

---

## Slide 7 — Storytelling immersif

- Ecran detail avec image parallax (Reanimated 4)
- Texte qui apparait en fade-in progressif
- Badge type de contenu (Conte, Danse, Rituel...)
- Actions : Like, Favori, avec retour instantane

---

## Slide 8 — Architecture technique

```
Frontend (Expo + React Native)
      |
      | Axios + JWT + TanStack Query (cache)
      |
Backend (FastAPI async)
      |
      | SQLAlchemy 2.0 async
      |
Base de donnees (SQLite dev / PostgreSQL prod)
```

- Backend modulaire (7 routeurs independants)
- Panel admin complet (SQLAdmin avec authentification)
- Tests automatises (pytest)

---

## Slide 9 — CRUD Complet

| Fonctionnalite | Ecran | API |
|-----------------|-------|-----|
| S'inscrire / Se connecter | EcranConnexion, EcranInscription | POST /auth/ |
| Explorer les regions | EcranRegions, EcranDetailRegion | GET /regions/ |
| Lire un contenu | EcranDetailContenu | GET /contenus/{id} |
| Creer un contenu | EcranCreationContenu | POST /contenus/ |
| Modifier un contenu | EcranEditionContenu | PUT /contenus/{id} |
| Supprimer un contenu | EcranEditionContenu | DELETE /contenus/{id} |
| Aimer / Mettre en favori | EcranDetailContenu | POST /interactions/, /favoris/ |
| Consulter ses favoris | EcranFavoris | GET /favoris/ |

---

## Slide 10 — Modele economique

- **Freemium** : acces gratuit aux contenus de base
- **Premium** (4,99 EUR/mois ou 49,99 EUR/an) : offline, exclusifs, zero pub
- **Publicites contextuelles** non intrusives (partenariats tourisme, cacao)
- **Commission** 10% sur dons aux createurs verifies
- **Croissance** : partage viral + API publique ecoles/musees

---

## Slide 11 — Demo video (30 secondes)

Parcours demonstre :
1. Splash screen IvoCulture
2. Onboarding (4 slides)
3. Accueil avec recommandations
4. Navigation regions (transition de couleur animee)
5. Detail d'un conte immersif (parallax)
6. Creation d'un nouveau contenu

---

## Slide 12 — Impact et prochaines etapes

**Impact mesurable :**
- Preservation numerique du patrimoine ivoirien
- Engagement des jeunes via une UX type TikTok
- Plateforme ouverte aux createurs culturels

**Prochaines etapes :**
- Moteur de recommandation ML avance
- Audio/video streaming integre
- Mode hors-ligne pour zones rurales
- Partenariats officiels (Ministere de la Culture, UNESCO)
- Lancement public sur App Store / Google Play

---

**Merci ! Des questions ?**

IvoCulture — Transmettre, c'est vivre.
