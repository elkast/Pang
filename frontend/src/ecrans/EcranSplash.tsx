// =============================================================================
// IvoCulture — Écran Splash (Démarrage)
// Animation logo → redirection intelligente selon token/onboarding
// THÈME CLAIR — fond blanc/crème
// =============================================================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Couleurs, Typographie } from '../constantes';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function EcranSplash() {
    const navigation = useNavigation<Nav>();
    const echelle = useSharedValue(0.85);
    const rotation = useSharedValue(0);

    useEffect(() => {
        // Animation douce pulsation
        echelle.value = withSequence(
            withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }),
            withRepeat(
                withSequence(
                    withTiming(1.04, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
                    withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) })
                ),
                -1,
                false
            )
        );

        // Redirection après animation
        const timer = setTimeout(async () => {
            let aVuOnboarding = null;
            let token = null;
            try {
                aVuOnboarding = await AsyncStorage.getItem('onboarding_vu');
                token = await AsyncStorage.getItem('token');
            } catch {
                // Storage indisponible en dev
            }

            if (!aVuOnboarding) {
                navigation.replace('Onboarding');
            } else if (token) {
                navigation.replace('Principal');
            } else {
                navigation.replace('ChoixProfil');
            }
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    const styleLogo = useAnimatedStyle(() => ({
        transform: [{ scale: echelle.value }],
    }));

    return (
        <View style={styles.conteneur}>
            <StatusBar barStyle="dark-content" backgroundColor={Couleurs.fond.primaire} />

            {/* Cercles décoratifs en fond */}
            <View style={[styles.cercle, styles.cercle1]} />
            <View style={[styles.cercle, styles.cercle2]} />

            {/* Logo centré */}
            <Animated.View style={[styleLogo]} entering={FadeIn.duration(600)}>
                <View style={styles.logoConteneur}>
                    <View style={styles.iconeBadge}>
                        <Text style={styles.logoIcone}>🏛️</Text>
                    </View>
                    <Text style={styles.logoTexte}>IvoCulture</Text>
                    <Text style={styles.logoSousTitre}>L'âme de la Côte d'Ivoire</Text>
                </View>
            </Animated.View>

            {/* Indicateur de chargement et version */}
            <Animated.View
                entering={FadeInUp.delay(600).duration(500)}
                style={styles.bas}
            >
                <View style={styles.pointsConteneur}>
                    {[0, 1, 2].map((i) => (
                        <Animated.View
                            key={i}
                            entering={FadeIn.delay(800 + i * 150).duration(400)}
                            style={[styles.point, { backgroundColor: Couleurs.accent.principal }]}
                        />
                    ))}
                </View>
                <Text style={styles.version}>v1.0.0</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: Couleurs.fond.primaire,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Cercles décoratifs subtils
    cercle: {
        position: 'absolute',
        borderRadius: 999,
        opacity: 0.07,
    },
    cercle1: {
        width: 320,
        height: 320,
        backgroundColor: Couleurs.accent.principal,
        top: -60,
        right: -60,
    },
    cercle2: {
        width: 250,
        height: 250,
        backgroundColor: Couleurs.foret.principal,
        bottom: -40,
        left: -60,
    },
    // Logo
    logoConteneur: {
        alignItems: 'center',
    },
    iconeBadge: {
        width: 100,
        height: 100,
        borderRadius: 28,
        backgroundColor: Couleurs.or.clair,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: Couleurs.accent.principal,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    logoIcone: {
        fontSize: 52,
    },
    logoTexte: {
        color: Couleurs.texte.primaire,
        fontSize: 38,
        fontWeight: '800',
        letterSpacing: 1,
    },
    logoSousTitre: {
        color: Couleurs.texte.secondaire,
        fontSize: Typographie.tailles.lg,
        fontWeight: '500',
        marginTop: 8,
        letterSpacing: 0.3,
    },
    // Bas
    bas: {
        position: 'absolute',
        bottom: 48,
        alignItems: 'center',
        gap: 12,
    },
    pointsConteneur: {
        flexDirection: 'row',
        gap: 8,
    },
    point: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    version: {
        color: Couleurs.texte.desactive,
        fontSize: Typographie.tailles.xs,
    },
});
