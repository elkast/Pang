// =============================================================================
// IvoCulture — Écran Découverte
// Recherche + filtres par type + liste de contenus culturels
// =============================================================================

import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import { Chargement, CarteContenu, EtatVide } from '../composants';
import { useTousContenus } from '../hooks/useContenus';
import type { RootStackParamList } from '../navigation/AppNavigator';

const FILTRES = ['Tous', 'masque', 'gastronomie', 'legende', 'site', 'musique', 'rituel'];
const LABELS_FILTRES: Record<string, string> = {
    Tous: 'Tous',
    masque: 'Masques',
    gastronomie: 'Cuisine',
    legende: 'Légendes',
    site: 'Sites',
    musique: 'Musique',
    rituel: 'Rituels',
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function EcranDecouverte() {
    const navigation = useNavigation<Nav>();
    const [recherche, setRecherche] = useState('');
    const [filtreActif, setFiltreActif] = useState('Tous');

    const { data: contenus, isLoading, refetch } = useTousContenus();

    const donneesFiltrees = useMemo(() => {
        if (!contenus) return [];
        return contenus.filter((item: any) => {
            if (filtreActif !== 'Tous' && item.type_contenu !== filtreActif) return false;
            if (recherche && !item.titre.toLowerCase().includes(recherche.toLowerCase())) return false;
            return true;
        });
    }, [contenus, filtreActif, recherche]);

    return (
        <View style={styles.conteneur}>
            {/* En-tête */}
            <View style={styles.entete}>
                <Animated.View entering={FadeInDown.duration(400)}>
                    <Text style={styles.titre}>Découvrir</Text>
                </Animated.View>

                {/* Barre de recherche */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                    <View style={styles.barreRecherche}>
                        <Ionicons name="search" size={20} color={Couleurs.texte.secondaire} />
                        <TextInput
                            style={styles.inputRecherche}
                            placeholder="Chercher un contenu culturel..."
                            placeholderTextColor={Couleurs.texte.desactive}
                            value={recherche}
                            onChangeText={setRecherche}
                        />
                        {recherche ? (
                            <TouchableOpacity onPress={() => setRecherche('')}>
                                <Ionicons name="close-circle" size={20} color={Couleurs.texte.secondaire} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </Animated.View>

                {/* Filtres */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtres}>
                        {FILTRES.map((filtre) => {
                            const estActif = filtreActif === filtre;
                            return (
                                <TouchableOpacity
                                    key={filtre}
                                    style={[styles.chip, estActif && styles.chipActif]}
                                    onPress={() => setFiltreActif(filtre)}
                                >
                                    <Text
                                        style={[styles.chipTexte, estActif && styles.chipTexteActif]}
                                    >
                                        {LABELS_FILTRES[filtre]}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </Animated.View>
            </View>

            {/* Résultats */}
            {isLoading ? (
                <Chargement message="Recherche en cours..." />
            ) : (
                <FlatList
                    data={donneesFiltrees}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.liste}
                    showsVerticalScrollIndicator={false}
                    onRefresh={refetch}
                    refreshing={isLoading}
                    renderItem={({ item, index }) => (
                        <CarteContenu
                            contenu={item}
                            index={index}
                            onPress={() => navigation.navigate('DetailContenu', { id: item.id })}
                        />
                    )}
                    ListEmptyComponent={
                        <EtatVide
                            icone="search-outline"
                            titre="Aucun résultat"
                            sousTitre="Essayez un autre filtre ou mot-clé."
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
    entete: {
        paddingTop: 56,
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    titre: {
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.xxxl,
        fontWeight: Typographie.poids.bold,
        marginBottom: 16,
    },
    barreRecherche: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Couleurs.fond.carte,
        borderRadius: Rayons.xl,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
        marginBottom: 12,
    },
    inputRecherche: {
        flex: 1,
        color: Couleurs.texte.primaire,
        fontSize: Typographie.tailles.lg,
    },
    filtres: {
        marginBottom: 4,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Rayons.complet,
        backgroundColor: Couleurs.fond.carte,
        marginRight: 8,
    },
    chipActif: {
        backgroundColor: Couleurs.accent.principal,
    },
    chipTexte: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        fontWeight: Typographie.poids.medium,
    },
    chipTexteActif: {
        color: '#FFFFFF',
        fontWeight: Typographie.poids.bold,
    },
    liste: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 100,
    },
});
