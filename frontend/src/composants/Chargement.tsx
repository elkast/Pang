// =============================================================================
// Composant Chargement — Spinner réutilisable avec message optionnel
// =============================================================================

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Couleurs } from '../constantes';

interface PropsChargement {
    message?: string;
    couleur?: string;
    taille?: 'small' | 'large';
    pleinEcran?: boolean;
}

export default function Chargement({
    message = 'Chargement...',
    couleur = Couleurs.accent.principal,
    taille = 'large',
    pleinEcran = true,
}: PropsChargement) {
    const contenu = (
        <View style={[styles.conteneur, pleinEcran && styles.pleinEcran]}>
            <ActivityIndicator size={taille} color={couleur} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );

    return contenu;
}

const styles = StyleSheet.create({
    conteneur: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    pleinEcran: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    message: {
        color: Couleurs.texte.secondaire,
        fontSize: 14,
        marginTop: 12,
    },
});
