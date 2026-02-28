// =============================================================================
// Composant BoutonPrincipal — Bouton d'action réutilisable
// =============================================================================

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Couleurs, Typographie, Rayons } from '../constantes';

interface PropsBouton {
    titre: string;
    onPress: () => void;
    chargement?: boolean;
    desactive?: boolean;
    variante?: 'plein' | 'contour' | 'texte';
    couleur?: string;
    style?: ViewStyle;
    icone?: React.ReactNode;
}

export default function BoutonPrincipal({
    titre,
    onPress,
    chargement = false,
    desactive = false,
    variante = 'plein',
    couleur = Couleurs.accent.principal,
    style,
    icone,
}: PropsBouton) {
    const estDesactive = desactive || chargement;

    const styleBouton = [
        styles.base,
        variante === 'plein' && { backgroundColor: couleur },
        variante === 'contour' && { borderWidth: 1.5, borderColor: couleur, backgroundColor: 'transparent' },
        variante === 'texte' && { backgroundColor: 'transparent' },
        estDesactive && { opacity: 0.6 },
        style,
    ];

    const couleurTexte =
        variante === 'plein' ? '#FFFFFF' : couleur;

    return (
        <TouchableOpacity
            style={styleBouton}
            onPress={onPress}
            disabled={estDesactive}
            activeOpacity={0.8}
        >
            {chargement ? (
                <ActivityIndicator size="small" color={couleurTexte} />
            ) : (
                <>
                    {icone}
                    <Text style={[styles.texte, { color: couleurTexte }]}>{titre}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: Rayons.lg,
        gap: 8,
    },
    texte: {
        fontSize: Typographie.tailles.lg,
        fontWeight: Typographie.poids.bold,
    },
});
