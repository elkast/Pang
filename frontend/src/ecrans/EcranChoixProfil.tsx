// =============================================================================
// IvoCulture — Écran Choix de Profil
// Entrée principale : Local ou Touriste
// Corrigé : SafeAreaView, dimensions téléphone, bouton "Se connecter" visible
// =============================================================================

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs, Typographie, Rayons } from '../constantes';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { height } = Dimensions.get('window');

const PROFILS = [
    {
        id: 'local',
        emoji: '🏠',
        label: 'Je suis Local',
        sousTitre: "Habitant de Côte d'Ivoire",
        description: 'Accès gratuit à tout le patrimoine culturel ivoirien.',
        couleur: Couleurs.foret.principal,
        fondClair: Couleurs.foret.clair,
        route: 'ConnexionLocal' as keyof RootStackParamList,
    },
    {
        id: 'touriste',
        emoji: '✈️',
        label: 'Je suis Touriste',
        sousTitre: "Visiteur en Côte d'Ivoire",
        description: "Découvrez la culture ivoirienne avec une offre sur-mesure.",
        couleur: '#9B59B6',
        fondClair: '#F5EEF8',
        route: 'ConnexionTouriste' as keyof RootStackParamList,
    },
] as const;

export default function EcranChoixProfil() {
    const navigation = useNavigation<Nav>();

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={Couleurs.fond.primaire} />
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* En-tête */}
                <Animated.View entering={FadeInDown.duration(500)} style={styles.entete}>
                    <Image
                        source={require('../../assert/logo.svg')}
                        style={{ width: 220, height: 70, marginBottom: 16 }}
                        contentFit="contain"
                    />
                    <Text style={styles.sousTitre}>Pour commencer, qui êtes-vous ?</Text>
                </Animated.View>

                {/* Cartes de sélection */}
                <View style={styles.cartes}>
                    {PROFILS.map((profil, i) => (
                        <Animated.View
                            key={profil.id}
                            entering={FadeInDown.delay(150 + i * 120).duration(500)}
                        >
                            <TouchableOpacity
                                style={[styles.carte, { borderColor: profil.couleur + '40' }]}
                                onPress={() => navigation.navigate(profil.route as any)}
                                activeOpacity={0.82}
                            >
                                {/* Zone colorée */}
                                <View style={[styles.carteTete, { backgroundColor: profil.fondClair }]}>
                                    <View style={[styles.emojiCercle, { backgroundColor: profil.couleur + '20' }]}>
                                        <Text style={styles.emoji}>{profil.emoji}</Text>
                                    </View>
                                    <View style={styles.carteTeteTexte}>
                                        <Text style={[styles.carteLabel, { color: profil.couleur }]}>
                                            {profil.label}
                                        </Text>
                                        <Text style={styles.carteSousTitre}>{profil.sousTitre}</Text>
                                    </View>
                                </View>

                                {/* Corps */}
                                <View style={styles.carteCorps}>
                                    <Text style={styles.carteDescription}>{profil.description}</Text>
                                    <View style={[styles.boutonCarte, { backgroundColor: profil.couleur }]}>
                                        <Text style={styles.boutonTexte}>Continuer</Text>
                                        <Ionicons name="arrow-forward" size={18} color="#FFF" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* Liens secondaires : Connexion & Exploration */}
                <Animated.View entering={FadeInUp.delay(450).duration(500)} style={styles.liensSecondaires}>
                    {/* Lien connexion directe */}
                    <View style={styles.footer}>
                        <Text style={styles.footerTexte}>Déjà un compte ? </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Connexion')}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        >
                            <Text style={styles.footerLien}>Se connecter →</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bouton pour explorer l'application sans compte */}
                    <TouchableOpacity
                        style={styles.boutonExplorer}
                        onPress={() => navigation.navigate('Principal')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.texteExplorer}>Explorer sans compte</Text>
                        <Ionicons name="compass-outline" size={18} color={Couleurs.texte.secondaire} />
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
        justifyContent: 'space-between',
        minHeight: height - 100,
    },
    entete: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    logo: {
        fontSize: 48,
        marginBottom: 12,
    },
    sousTitre: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
        textAlign: 'center',
        marginTop: 8,
    },
    cartes: {
        gap: 14,
        marginVertical: 16,
    },
    carte: {
        borderRadius: Rayons.xl,
        borderWidth: 1.5,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    carteTete: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        gap: 14,
    },
    emojiCercle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 28,
    },
    carteTeteTexte: {
        flex: 1,
    },
    carteLabel: {
        fontSize: 18,
        fontWeight: '800',
    },
    carteSousTitre: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
        marginTop: 2,
    },
    carteCorps: {
        paddingHorizontal: 18,
        paddingBottom: 18,
        gap: 12,
    },
    carteDescription: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
        lineHeight: 20,
    },
    boutonCarte: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 13,
        borderRadius: Rayons.lg,
    },
    boutonTexte: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: Typographie.tailles.md,
    },
    liensSecondaires: {
        alignItems: 'center',
        marginTop: 8,
        paddingBottom: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 16,
    },
    footerTexte: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.md,
    },
    footerLien: {
        color: Couleurs.accent.principal,
        fontWeight: '700',
        fontSize: Typographie.tailles.md,
    },
    boutonExplorer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: Rayons.complet,
        backgroundColor: Couleurs.fond.surface,
        borderWidth: 1,
        borderColor: Couleurs.fond.carte,
    },
    texteExplorer: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.sm,
        fontWeight: '600',
    },
});
