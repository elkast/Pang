// =============================================================================
// IvoCulture — Écran Onboarding (4 étapes)
// Présente les fonctionnalités clés de la plateforme
// =============================================================================

import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Couleurs, Typographie } from '../constantes';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

interface PageOnboarding {
    id: string;
    emoji: string;
    titre: string;
    sousTitre: string;
    description: string;
    couleur: string;
}

const PAGES: PageOnboarding[] = [
    {
        id: '1',
        emoji: '🌍',
        titre: 'Explorez',
        sousTitre: 'La culture ivoirienne',
        description:
            'Découvrez les masques sacrés, les légendes ancestrales, la gastronomie locale et les sites de pouvoir à travers toute la Côte d\'Ivoire.',
        couleur: Couleurs.accent.principal,
    },
    {
        id: '2',
        emoji: '📖',
        titre: 'Apprenez',
        sousTitre: 'Des savoirs ancestraux',
        description:
            'Plongez dans les contes initiatiques, les rituels de transmission et les mélodies traditionnelles qui forment l\'identité culturelle ivoirienne.',
        couleur: Couleurs.or.principal,
    },
    {
        id: '3',
        emoji: '✍️',
        titre: 'Contribuez',
        sousTitre: 'Partagez votre savoir',
        description:
            'Devenez gardien du patrimoine en partageant vos connaissances culturelles, recettes familiales et récits de vos ancêtres avec la communauté.',
        couleur: Couleurs.foret.principal,
    },
    {
        id: '4',
        emoji: '🤝',
        titre: 'Connectez',
        sousTitre: 'Une communauté vivante',
        description:
            'Rejoignez des passionnés de culture ivoirienne, échangez, likez et sauvegardez vos contenus favoris pour les transmettre aux générations futures.',
        couleur: Couleurs.categorie.rituel,
    },
];

type NavigationOnboarding = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function EcranOnboarding() {
    const navigation = useNavigation<NavigationOnboarding>();
    const refListe = useRef<FlatList>(null);
    const [indexActuel, setIndexActuel] = useState(0);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setIndexActuel(index);
    };

    const suivant = () => {
        if (indexActuel < PAGES.length - 1) {
            refListe.current?.scrollToIndex({ index: indexActuel + 1 });
        } else {
            terminer();
        }
    };

    const terminer = async () => {
        // Silencieusement essayer de sauvegarder, sinon continuer
        try {
            await AsyncStorage.setItem('onboarding_vu', 'oui');
        } catch {
            // Ignorer les erreurs storage en mode web/dev
        }
        navigation.replace('Connexion');
    };

    const renderPage = ({ item, index }: { item: PageOnboarding; index: number }) => (
        <View style={styles.page}>
            {/* Cercle décoratif */}
            <View style={[styles.cercle, { backgroundColor: item.couleur + '15' }]} />

            <View style={styles.contenuPage}>
                <Animated.View entering={FadeIn.delay(200)} style={styles.emojiConteneur}>
                    <View style={[styles.emojiFond, { backgroundColor: item.couleur + '20' }]}>
                        <Text style={styles.emoji}>{item.emoji}</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(300)}>
                    <Text style={[styles.titre, { color: item.couleur }]}>{item.titre}</Text>
                    <Text style={styles.sousTitre}>{item.sousTitre}</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400)}>
                    <Text style={styles.description}>{item.description}</Text>
                </Animated.View>
            </View>
        </View>
    );

    return (
        <View style={styles.conteneur}>
            <FlatList
                ref={refListe}
                data={PAGES}
                keyExtractor={item => item.id}
                renderItem={renderPage}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScroll}
                bounces={false}
            />

            {/* Pied de page */}
            <Animated.View entering={FadeInDown.delay(500)} style={styles.pied}>
                {/* Indicateurs */}
                <View style={styles.indicateurs}>
                    {PAGES.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.point,
                                i === indexActuel && {
                                    width: 24,
                                    backgroundColor: PAGES[indexActuel].couleur,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Boutons */}
                <View style={styles.boutons}>
                    {indexActuel < PAGES.length - 1 && (
                        <TouchableOpacity onPress={terminer} style={styles.boutonPasser}>
                            <Text style={styles.textePasser}>Passer</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={suivant}
                        style={[
                            styles.boutonSuivant,
                            { backgroundColor: PAGES[indexActuel].couleur },
                        ]}
                    >
                        <Text style={styles.texteSuivant}>
                            {indexActuel === PAGES.length - 1 ? 'Commencer' : 'Suivant'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    page: {
        width,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    cercle: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        top: '15%',
    },
    contenuPage: {
        alignItems: 'center',
    },
    emojiConteneur: {
        marginBottom: 32,
    },
    emojiFond: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 56,
    },
    titre: {
        fontSize: Typographie.tailles.hero,
        fontWeight: Typographie.poids.extraBold,
        textAlign: 'center',
    },
    sousTitre: {
        fontSize: Typographie.tailles.xxl,
        fontWeight: Typographie.poids.semiBold,
        color: Couleurs.texte.primaire,
        textAlign: 'center',
        marginTop: 4,
    },
    description: {
        fontSize: Typographie.tailles.lg,
        color: Couleurs.texte.secondaire,
        textAlign: 'center',
        lineHeight: 26,
        marginTop: 20,
        paddingHorizontal: 8,
    },
    pied: {
        paddingHorizontal: 32,
        paddingBottom: 50,
    },
    indicateurs: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
    },
    point: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Couleurs.fond.surface,
    },
    boutons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    boutonPasser: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    textePasser: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
        fontWeight: Typographie.poids.medium,
    },
    boutonSuivant: {
        flex: 1,
        marginLeft: 12,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    texteSuivant: {
        color: '#FFFFFF',
        fontSize: Typographie.tailles.lg,
        fontWeight: Typographie.poids.bold,
    },
});
