// =============================================================================
// Composant ChampSaisie — Champ de saisie réutilisable
// =============================================================================

import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';

interface PropsChampSaisie extends TextInputProps {
    label?: string;
    icone?: string;
    erreur?: string;
    iconeDroite?: string;
    onPressIconeDroite?: () => void;
}

export default function ChampSaisie({
    label,
    icone,
    erreur,
    iconeDroite,
    onPressIconeDroite,
    ...props
}: PropsChampSaisie) {
    return (
        <View style={styles.conteneur}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.champConteneur, erreur && styles.champErreur]}>
                {icone && (
                    <Ionicons
                        name={icone as any}
                        size={20}
                        color={Couleurs.texte.secondaire}
                        style={styles.iconeGauche}
                    />
                )}
                <TextInput
                    style={[styles.input, !icone && { paddingLeft: 16 }]}
                    placeholderTextColor={Couleurs.texte.desactive}
                    {...props}
                />
                {iconeDroite && (
                    <TouchableOpacity onPress={onPressIconeDroite} style={styles.iconeDroite}>
                        <Ionicons
                            name={iconeDroite as any}
                            size={20}
                            color={Couleurs.texte.secondaire}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {erreur && <Text style={styles.texteErreur}>{erreur}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        marginBottom: 16,
    },
    label: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
        fontWeight: Typographie.poids.medium,
        marginBottom: 8,
    },
    champConteneur: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.lg,
        borderWidth: 1,
        borderColor: Couleurs.fond.surface,
    },
    champErreur: {
        borderColor: Couleurs.etat.erreur,
    },
    iconeGauche: {
        marginLeft: 16,
    },
    input: {
        flex: 1,
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.lg,
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    iconeDroite: {
        paddingHorizontal: 16,
    },
    texteErreur: {
        color: Couleurs.etat.erreur,
        fontSize: Typographie.tailles.sm,
        marginTop: 4,
    },
});
