// =============================================================================
// IvoCulture — Navigateur Principal
// Toutes les routes de l'application
// =============================================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Couleurs } from '../constantes';

// Navigateur à onglets
import TabNavigateur from './TabNavigateur';

// Écrans autonomes
import EcranSplash from '../ecrans/EcranSplash';
import EcranOnboarding from '../ecrans/EcranOnboarding';
import EcranConnexion from '../ecrans/EcranConnexion';
import EcranInscription from '../ecrans/EcranInscription';

// Écrans empilés
import EcranCategorie from '../ecrans/EcranCategorie';
import EcranDetailContenu from '../ecrans/EcranDetailContenu';
import EcranDetailRegion from '../ecrans/EcranDetailRegion';
import EcranContribution from '../ecrans/EcranContribution';
import EcranFavoris from '../ecrans/EcranFavoris';
import EcranPortails from '../ecrans/EcranPortails';
import EcranDecouverte from '../ecrans/EcranDecouverte';

// ─── Types de navigation ────────────────────────────────────────────────────

export type RootStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    Connexion: undefined;
    Inscription: undefined;
    Principal: undefined;
    Categorie: { typeContenu: string };
    DetailContenu: { id: number };
    DetailRegion: { region_id: number; nom?: string };
    Contribution: undefined;
    Favoris: undefined;
    Portails: undefined;
    Decouverte: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: Couleurs.fond.primaire },
            }}
        >
            {/* Flux d'entrée */}
            <Stack.Screen name="Splash" component={EcranSplash} />
            <Stack.Screen name="Onboarding" component={EcranOnboarding} />
            <Stack.Screen name="Connexion" component={EcranConnexion} />
            <Stack.Screen name="Inscription" component={EcranInscription} />

            {/* Application principale (onglets) */}
            <Stack.Screen name="Principal" component={TabNavigateur} />

            {/* Écrans détaillés */}
            <Stack.Screen
                name="Categorie"
                component={EcranCategorie}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="DetailContenu"
                component={EcranDetailContenu}
                options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
                name="DetailRegion"
                component={EcranDetailRegion}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="Contribution"
                component={EcranContribution}
                options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
                name="Favoris"
                component={EcranFavoris}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="Portails"
                component={EcranPortails}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="Decouverte"
                component={EcranDecouverte}
                options={{ animation: 'slide_from_right' }}
            />
        </Stack.Navigator>
    );
}
