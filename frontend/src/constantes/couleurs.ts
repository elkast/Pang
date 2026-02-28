// =============================================================================
// IvoCulture — Design Tokens Unifiés
// Thème clair : Blanc & Orange, accents culturels ivoiriens
// =============================================================================

export const Couleurs = {
    // Or Kente — accent clair
    or: {
        clair: '#FFF9EE',
        doux: '#FCEBBF',
        moyen: '#F0C040',
        principal: '#E67E22',
        fonce: '#030303ff',
        profond: '#A04000',
    },

    // Forêt tropicale — touches vertes
    foret: {
        clair: '#E8F5EE',
        doux: '#B7DEC9',
        moyen: '#4CAF82',
        principal: '#1E6B45',
        fonce: '#145432',
        profond: '#0B3320',
    },

    // Terre latérite
    terre: {
        clair: '#FDF0EA',
        principal: '#C4784A',
        fonce: '#8B4513',
    },

    // Surfaces (thème clair blanc/orange)
    fond: {
        primaire: '#FFFFFF',
        carte: '#F8F9FA',
        entete: '#FFF4EC',
        surface: '#F0F2F5',
        overlay: 'rgba(0,0,0,0.45)',
    },

    // Textes
    texte: {
        primaire: '#1A1A1A',
        secondaire: '#6B6B6B',
        desactive: '#ABABAB',
        inverse: '#FFFFFF',
        accent: '#E67E22',
    },

    // Accent principal orange
    accent: {
        principal: '#E67E22',
        fonce: '#D35400',
        clair: '#F5A623',
        vert: '#1E6B45',
        vertFonce: '#145432',
    },

    // États
    etat: {
        succes: '#2ECC71',
        erreur: '#E74C3C',
        attention: '#F39C12',
        info: '#3498DB',
    },

    // Couleurs des catégories
    categorie: {
        masque: '#E67E22',
        gastronomie: '#D35400',
        legende: '#C4A02A',
        site: '#1E6B45',
        musique: '#8B5C34',
        rituel: '#9D2235',
    },
} as const;

export const Espacements = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
} as const;

export const Rayons = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    complet: 9999,
} as const;

export const Ombres = {
    petit: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    moyen: {
        shadowColor: '#E67E22',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
    },
    grand: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 14,
        elevation: 10,
    },
} as const;

export const Typographie = {
    tailles: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
        xxl: 22,
        xxxl: 28,
        titre: 32,
        hero: 40,
    },
    poids: {
        normal: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
        extraBold: '800' as const,
    },
} as const;

export default Couleurs;
