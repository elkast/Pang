// =============================================================================
// Composant EtatVide — État vide réutilisable avec icône et message
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Couleurs, Typographie } from '../constantes';

interface PropsEtatVide {
    icone: string;
    titre: string;
    sousTitre?: string;
    texteBouton?: string;
    onPressBouton?: () => void;
    couleurIcone?: string;
}

export default function EtatVide({
    icone,
    titre,
    sousTitre,
    texteBouton,
    onPressBouton,
    couleurIcone = Couleurs.accent.principal,
}: PropsEtatVide) {
    return (
        <Animated.View entering={FadeInUp.duration(600)} style={styles.conteneur}>
            <View style={[styles.cercleIcone, { backgroundColor: couleurIcone + '15' }]}>
                <Ionicons name={icone as any} size={48} color={couleurIcone} />
            </View>
            <Text style={styles.titre}>{titre}</Text>
            {sousTitre && <Text style={styles.sousTitre}>{sousTitre}</Text>}
            {texteBouton && onPressBouton && (
                <TouchableOpacity
                    style={[styles.bouton, { borderColor: couleurIcone }]}
                    onPress={onPressBouton}
                >
                    <Text style={[styles.texteBouton, { color: couleurIcone }]}>
                        {texteBouton}
                    </Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    cercleIcone: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    titre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xl,
        fontWeight: Typographie.poids.semiBold,
        textAlign: 'center',
        marginBottom: 8,
    },
    sousTitre: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        textAlign: 'center',
        lineHeight: 22,
    },
    bouton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        borderWidth: 1.5,
    },
    texteBouton: {
        fontSize: Typographie.tailles.md,
        fontWeight: Typographie.poids.semiBold,
    },
});
