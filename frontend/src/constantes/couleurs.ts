// =============================================================================
// IvoCulture — Design Tokens Unifiés
// Thème sombre africain inspiré des couleurs Kente, Forêt, Terre
// =============================================================================

export const Couleurs = {
    // Or Kente — accent principal
    or: {
        clair: '#FBF8EE',
        doux: '#F4EBC8',
        moyen: '#E2CC74',
        principal: '#C4A02A',
        fonce: '#9D8022',
        profond: '#76611A',
    },

    // Forêt tropicale
    foret: {
        clair: '#E8F0EC',
        doux: '#C4D9CF',
        moyen: '#6DA883',
        principal: '#1E6B45',
        fonce: '#175537',
        profond: '#0B2A1C',
    },

    // Terre latérite
    terre: {
        clair: '#F5EDE8',
        principal: '#8B5C34',
        fonce: '#54371E',
    },

    // Surfaces (thème sombre)
    fond: {
        primaire: '#121B22',
        carte: '#1E2A32',
        entete: '#0E2A34',
        surface: '#2A3942',
        overlay: 'rgba(0,0,0,0.5)',
    },

    // Textes
    texte: {
        primaire: '#E9EDEF',
        secondaire: '#8696A1',
        desactive: '#556671',
        inverse: '#FFFFFF',
        accent: '#00A884',
    },

    // Accent
    accent: {
        principal: '#E67E22',
        fonce: '#D35400',
        clair: '#F39C12',
        vert: '#00A884',
        vertFonce: '#00897B',
    },

    // États
    etat: {
        succes: '#25D366',
        erreur: '#EF4444',
        attention: '#F59E0B',
        info: '#3B82F6',
    },

    // Couleurs des catégories
    categorie: {
        masque: '#E67E22',
        gastronomie: '#D4781F',
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
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    moyen: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
        elevation: 5,
    },
    grand: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
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
