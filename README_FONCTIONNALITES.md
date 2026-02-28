# IvoCulture — Fonctionnalités implémentées

## ✅ Corrigé / Implémenté

### Backend
- **ImportError** : `start_backend.py` lance désormais uvicorn depuis `backend/` avec `main:app` (évite les imports relatifs).
- **Signalements** : Modèle `Signalement`, route `POST /api/signalements/contenu/{id}`. À 5 signalements → verrouillage du contenu et de l'auteur.
- **Historique publications** : `GET /api/contenus/mes-contributions` pour l'historique des contributions de l'utilisateur.
- **Type Talent** : Ajout du type `talent` pour les personnes ayant prouvé leurs valeurs en Afrique (validation admin, numéro de contact).
- **Contenus verrouillés** : Les contenus avec `is_verrouille=true` sont exclus des listes publiques.

### Frontend

#### Authentification & mode hors-ligne
- Connexion et inscription avec **fallback LocalStorage** si l'API est indisponible.
- Utilisateurs locaux stockés et réutilisables (hash mot de passe pour vérification hors-ligne).
- Spinner pendant les opérations de connexion/inscription.

#### Historique & signalements
- **Écran Historique publications** : accessible depuis Profil → "Historique publications".
- **Signaler** : bouton sur chaque détail de contenu. 5 signalements → contenu et auteur verrouillés.
- Exemple de **fausse information** dans les mocks : contenu id 99.

#### Profil
- **Upload photo** : Éditer profil → choisir une photo (expo-image-picker), stockée en LocalStorage.
- Affichage de la photo dans le profil.

#### Favoris
- **Sélection multiple** : bouton "Sélectionner" pour choisir plusieurs favoris.
- **Suppression en masse** : "Supprimer" retire tous les éléments sélectionnés.
- Fallback LocalStorage si l'API n'est pas disponible.

#### Paiement (simulation CinetPay)
- **Écran Paiement** : design type CinetPay (fond sombre, montant, Mobile Money / Carte).
- Simulation de paiement (~2,5 s) puis déblocage Premium.
- Premium enregistré dans AsyncStorage si l'API est indisponible.

#### Promotion Talent
- Type `talent` dans les promotions.
- Mock "Aya Cissoko" en exemple (numéro, notoriété, validation admin).

#### Assistant IA
- Écran **Recommandations IA** : budget + sélection d’événements (festival, gastronomie, sites, musique).
- Génération de recommandations à partir des mocks.
- Bouton **Partager sur WhatsApp** pour chaque recommandation.

#### Thème
- Thème blanc / orange déjà en place dans `couleurs.ts` et `App.tsx`.

### Package à installer
- `expo-image-picker` : pour l’upload de photo de profil.
  - Commande : `npx expo install expo-image-picker`
  - Si le réseau bloque l’installation, ajouter manuellement dans `package.json` :
    ```json
    "expo-image-picker": "~16.0.7"
    ```
  - Puis exécuter `npm install`.

---

## Éléments pour diagramme UML

### Entités principales
| Entité | Attributs clés |
|--------|-----------------|
| **User** | id, email, username, type_utilisateur, is_premium, is_admin, is_verrouille |
| **Region** | id, nom, description, image_url, couleur_theme |
| **Categorie** | id, nom, slug, couleur |
| **ContenuCulturel** | id, titre, type_contenu, description, region_id, auteur_id, vues, likes, nb_signalements, is_verrouille |
| **Promotion** | id, titre, type_promotion, numero_contact, note_popularite |
| **InteractionUtilisateur** | id, type_interaction (LIKE, FAVORI, COMMENTAIRE), contenu_id, utilisateur_id |
| **Signalement** | id, contenu_id, signaleur_id, motif |

### Relations
- User 1→N ContenuCulturel (auteur)
- User 1→N InteractionUtilisateur
- ContenuCulturel 1→N InteractionUtilisateur
- ContenuCulturel 1→N Signalement
- Region 1→N ContenuCulturel
- Categorie 1→N ContenuCulturel

### Cas d’usage principaux
- Inscription / Connexion (API + fallback LocalStorage)
- Publier un contenu
- Consulter l’historique des publications
- Liker / ajouter aux favoris
- Signaler un contenu (→ verrouillage à 5 signalements)
- Payer (simulation CinetPay) → Premium
- Consulter les recommandations IA
- Partager sur WhatsApp
