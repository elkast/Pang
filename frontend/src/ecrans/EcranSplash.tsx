// =============================================================================
// IvoCulture — Écran Splash (Démarrage)
// Animation logo + vérification token JWT → redirection intelligente
// =============================================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    FadeIn,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    FadeInUp,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Couleurs, Typographie } from '../constantes';
import { Chargement } from '../composants';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationSplash = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function EcranSplash() {
    const navigation = useNavigation<NavigationSplash>();
    const echelle = useSharedValue(0.8);
    const opaciteSousTitre = useSharedValue(0);

    useEffect(() => {
        // Animation pulsation logo
        echelle.value = withSequence(
            withTiming(1, { duration: 800 }),
            withRepeat(withTiming(1.05, { duration: 1200 }), -1, true)
        );

        // Apparition sous-titre
        setTimeout(() => {
            opaciteSousTitre.value = withTiming(1, { duration: 600 });
        }, 600);

        // Vérification état authentification
        const verifier = async () => {
            await new Promise(r => setTimeout(r, 2500));
            let aVuOnboarding = null;
            let token = null;

            try {
                aVuOnboarding = await AsyncStorage.getItem('onboarding_vu');
                token = await AsyncStorage.getItem('token');
            } catch {
                // Storage non disponible en mode web/dev - continuer silencieusement
            }

            if (!aVuOnboarding) {
                navigation.replace('Onboarding');
            } else if (token) {
                navigation.replace('Principal');
            } else {
                navigation.replace('Connexion');
            }
        };
        verifier();
    }, []);

    const styleLogo = useAnimatedStyle(() => ({
        transform: [{ scale: echelle.value }],
    }));

    const styleSousTitre = useAnimatedStyle(() => ({
        opacity: opaciteSousTitre.value,
    }));

    return (
        <View style={styles.conteneur}>
            {/* Cercle décoratif flou */}
            <View style={styles.cercleDecoratif} />

            {/* Logo principal */}
            <Animated.View style={styleLogo} entering={FadeIn.duration(800)}>
                <View style={styles.logoConteneur}>
                    <Text style={styles.logoIcone}>🏛️</Text>
                    <Text style={styles.logoTexte}>IvoCulture</Text>
                </View>
            </Animated.View>

            {/* Sous-titre */}
            <Animated.View style={styleSousTitre}>
                <Text style={styles.sousTitre}>L'âme de la Côte d'Ivoire</Text>
            </Animated.View>

            {/* Spinner en bas */}
            <Animated.View entering={FadeInUp.delay(1200).duration(500)} style={styles.bas}>
                <Chargement
                    message=""
                    couleur={Couleurs.accent.principal}
                    taille="small"
                    pleinEcran={false}
                />
                <Text style={styles.version}>Version 1.0.0</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.foret.profond,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cercleDecoratif: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: Couleurs.accent.principal,
        opacity: 0.05,
        top: '20%',
    },
    logoConteneur: {
        alignItems: 'center',
    },
    logoIcone: {
        fontSize: 64,
        marginBottom: 12,
    },
    logoTexte: {
        color: Couleurs.or.principal,
        fontSize: 42,
        fontWeight: '800',
        letterSpacing: 2,
    },
    sousTitre: {
        color: Couleurs.foret.moyen,
        fontSize: Typographie.tailles.xl,
        fontWeight: Typographie.poids.medium,
        marginTop: 8,
    },
    bas: {
        position: 'absolute',
        bottom: 60,
        alignItems: 'center',
    },
    version: {
        color: Couleurs.texte.desactive,
        fontSize: Typographie.tailles.sm,
        marginTop: 8,
    },
});
