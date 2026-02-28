// =============================================================================
// Composant EnteteEcran — En-tête réutilisable avec bouton retour
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Couleurs, Typographie } from '../constantes';

interface PropsEntete {
    titre: string;
    afficherRetour?: boolean;
    actionDroite?: React.ReactNode;
    couleurFond?: string;
}

export default function EnteteEcran({
    titre,
    afficherRetour = true,
    actionDroite,
    couleurFond = Couleurs.fond.primaire,
}: PropsEntete) {
    const navigation = useNavigation();

    return (
        <View style={[styles.conteneur, { backgroundColor: couleurFond }]}>
            <View style={styles.gauche}>
                {afficherRetour && (
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.boutonRetour}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color={Couleurs.texte.primaire} />
                    </TouchableOpacity>
                )}
                <Text style={styles.titre} numberOfLines={1}>
                    {titre}
                </Text>
            </View>
            {actionDroite && <View style={styles.droite}>{actionDroite}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 56,
        paddingBottom: 12,
    },
    gauche: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    boutonRetour: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Couleurs.fond.carte,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    titre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxl,
        fontWeight: Typographie.poids.bold,
        flex: 1,
    },
    droite: {
        marginLeft: 12,
    },
});
