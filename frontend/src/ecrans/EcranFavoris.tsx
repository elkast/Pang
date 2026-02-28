// =============================================================================
// IvoCulture — Écran Favoris
// Liste des favoris avec sélection multiple et suppression
// =============================================================================

import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs } from '../constantes';
import { EnteteEcran, Chargement, EtatVide, CarteContenu } from '../composants';
import { useFavoris, useRetirerFavori, useRetirerFavorisMultiples } from '../hooks/useContenus';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranFavoris() {
    const navigation = useNavigation<Nav>();
    const { data: favoris, isLoading, refetch } = useFavoris();
    const retirerFavori = useRetirerFavori();
    const retirerMultiples = useRetirerFavorisMultiples();
    const [modeSelection, setModeSelection] = useState(false);
    const [selectionnes, setSelectionnes] = useState<Set<number>>(new Set());

    const toggleSelection = (id: number) => {
        const next = new Set(selectionnes);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectionnes(next);
    };

    const toutSelectionner = () => {
        if (!favoris?.length) return;
        if (selectionnes.size === favoris.length) {
            setSelectionnes(new Set());
        } else {
            setSelectionnes(new Set(favoris.map((f: any) => f.id)));
        }
    };

    const supprimerSelection = () => {
        if (selectionnes.size === 0) return;
        Alert.alert(
            'Supprimer les favoris',
            `Retirer ${selectionnes.size} élément(s) de vos favoris ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        if (selectionnes.size === 1) {
                            retirerFavori.mutate([...selectionnes][0]);
                        } else {
                            retirerMultiples.mutate([...selectionnes]);
                        }
                        setSelectionnes(new Set());
                        setModeSelection(false);
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.conteneur}>
            <EnteteEcran
                titre="Mes Favoris"
                actionDroite={
                    <TouchableOpacity
                        onPress={() => {
                            setModeSelection(!modeSelection);
                            if (modeSelection) setSelectionnes(new Set());
                        }}
                    >
                        <Text style={styles.boutonModeTexte}>
                            {modeSelection ? 'Annuler' : 'Sélectionner'}
                        </Text>
                    </TouchableOpacity>
                }
            />

            {modeSelection && selectionnes.size > 0 && (
                <View style={styles.barreActions}>
                    <TouchableOpacity onPress={toutSelectionner}>
                        <Text style={styles.actionTexte}>
                            {selectionnes.size === favoris?.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={supprimerSelection} style={styles.boutonSupprimer}>
                        <Ionicons name="trash-outline" size={18} color="#FFF" />
                        <Text style={styles.boutonSupprimerTexte}>Supprimer ({selectionnes.size})</Text>
                    </TouchableOpacity>
                </View>
            )}

            {isLoading ? (
                <Chargement message="Chargement des favoris..." />
            ) : (
                <FlatList
                    data={favoris || []}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.liste}
                    showsVerticalScrollIndicator={false}
                    onRefresh={refetch}
                    refreshing={isLoading}
                    renderItem={({ item, index }) => (
                        <View style={styles.ligne}>
                            {modeSelection && (
                                <TouchableOpacity
                                    style={[styles.checkbox, selectionnes.has(item.id) && styles.checkboxActive]}
                                    onPress={() => toggleSelection(item.id)}
                                >
                                    {selectionnes.has(item.id) && (
                                        <Ionicons name="checkmark" size={16} color="#FFF" />
                                    )}
                                </TouchableOpacity>
                            )}
                            <View style={{ flex: 1 }}>
                                <CarteContenu
                                    contenu={item}
                                    index={index}
                                    onPress={() => {
                                        if (modeSelection) toggleSelection(item.id);
                                        else navigation.navigate('DetailContenu', { id: item.id });
                                    }}
                                />
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <EtatVide
                            icone="heart-outline"
                            titre="Pas encore de favoris"
                            sousTitre="Explorez les contenus culturels et ajoutez vos préférés."
                            texteBouton="Explorer"
                            onPressBouton={() => navigation.goBack()}
                            couleurIcone={Couleurs.accent.principal}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    boutonMode: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    boutonModeTexte: {
        color: Couleurs.accent.principal,
        fontWeight: '600',
        fontSize: 14,
    },
    barreActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: Couleurs.fond.carte,
        borderBottomWidth: 1,
        borderBottomColor: Couleurs.fond.surface,
    },
    actionTexte: {
        color: Couleurs.accent.principal,
        fontSize: 14,
        fontWeight: '600',
    },
    boutonSupprimer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Couleurs.etat.erreur,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    boutonSupprimerTexte: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    liste: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    ligne: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Couleurs.texte.desactive,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: Couleurs.accent.principal,
        borderColor: Couleurs.accent.principal,
    },
});
