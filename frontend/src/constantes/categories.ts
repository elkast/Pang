// =============================================================================
// IvoCulture — Configuration des Catégories Culturelles
// Source unique pour toutes les catégories (remplace 6 écrans dupliqués)
// =============================================================================

import { Couleurs } from './couleurs';

export interface ConfigCategorie {
    id: string;
    nom: string;
    sousTitre: string;
    icone: string;
    couleur: string;
    typeContenu: string;
    ecranNom: string;
    texteVide: string;
    sousTexteVide: string;
    iconeVide: string;
}

export const CATEGORIES: ConfigCategorie[] = [
    {
        id: 'masques',
        nom: 'Masques Sacrés',
        sousTitre: 'Découvrez les masques traditionnels ivoiriens',
        icone: 'happy-outline',
        couleur: Couleurs.categorie.masque,
        typeContenu: 'masque',
        ecranNom: 'Masques',
        texteVide: 'Aucun masque enregistré',
        sousTexteVide: 'Partagez les masques traditionnels !',
        iconeVide: 'happy',
    },
    {
        id: 'gastronomie',
        nom: 'Gastronomie',
        sousTitre: 'Savourez les délices de la cuisine ivoirienne',
        icone: 'restaurant-outline',
        couleur: Couleurs.categorie.gastronomie,
        typeContenu: 'gastronomie',
        ecranNom: 'Gastronomie',
        texteVide: 'Aucune recette enregistrée',
        sousTexteVide: 'Partagez vos recettes préférées !',
        iconeVide: 'restaurant',
    },
    {
        id: 'legendes',
        nom: 'Légendes & Mythes',
        sousTitre: 'Explorez les récits fondateurs de Côte d\'Ivoire',
        icone: 'book-outline',
        couleur: Couleurs.categorie.legende,
        typeContenu: 'legende',
        ecranNom: 'Legendes',
        texteVide: 'Aucune légende enregistrée',
        sousTexteVide: 'Partagez les récits de vos ancêtres !',
        iconeVide: 'book',
    },
    {
        id: 'sites',
        nom: 'Sites de Pouvoir',
        sousTitre: 'Explorez les lieux sacrés et le patrimoine historique',
        icone: 'location-outline',
        couleur: Couleurs.categorie.site,
        typeContenu: 'site',
        ecranNom: 'Sites',
        texteVide: 'Aucun site enregistré',
        sousTexteVide: 'Découvrez le patrimoine ivoirien !',
        iconeVide: 'location',
    },
    {
        id: 'musique',
        nom: 'Grimoire Musical',
        sousTitre: 'Découvrez les instruments et mélodies traditionnelles',
        icone: 'musical-notes-outline',
        couleur: Couleurs.categorie.musique,
        typeContenu: 'musique',
        ecranNom: 'Musique',
        texteVide: 'Aucune musique enregistrée',
        sousTexteVide: 'Partagez les mélodies traditionnelles !',
        iconeVide: 'musical-notes',
    },
    {
        id: 'rituels',
        nom: 'Rituels de Transmission',
        sousTitre: 'Cérémonies initiatiques et traditions ancestrales',
        icone: 'flame-outline',
        couleur: Couleurs.categorie.rituel,
        typeContenu: 'rituel',
        ecranNom: 'Rituel',
        texteVide: 'Aucun rituel enregistré',
        sousTexteVide: 'Partagez les traditions de vos ancêtres !',
        iconeVide: 'flame',
    },
];

export const TYPES_CONTENU_FORMULAIRE = [
    { label: 'Masque Traditionnel', valeur: 'masque' },
    { label: 'Gastronomie', valeur: 'gastronomie' },
    { label: 'Légende & Mythe', valeur: 'legende' },
    { label: 'Site Sacré', valeur: 'site' },
    { label: 'Musique & Instrument', valeur: 'musique' },
    { label: 'Rituel & Cérémonie', valeur: 'rituel' },
    { label: 'Conte Initiatique', valeur: 'conte' },
    { label: 'Danse Traditionnelle', valeur: 'danse' },
    { label: 'Art & Artisanat', valeur: 'art' },
];

export const obtenirCategorieParType = (type: string): ConfigCategorie | undefined =>
    CATEGORIES.find(c => c.typeContenu === type);

export const obtenirCouleurCategorie = (type: string): string =>
    obtenirCategorieParType(type)?.couleur || Couleurs.accent.principal;
