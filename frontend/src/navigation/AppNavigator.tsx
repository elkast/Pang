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
import EcranChoixProfil from '../ecrans/EcranChoixProfil';
import EcranConnexion from '../ecrans/EcranConnexion';
import EcranConnexionLocal from '../ecrans/EcranConnexionLocal';
import EcranConnexionTouriste from '../ecrans/EcranConnexionTouriste';
import EcranInscription from '../ecrans/EcranInscription';

// Écrans empilés
import EcranCategorie from '../ecrans/EcranCategorie';
import EcranDetailContenu from '../ecrans/EcranDetailContenu';
import EcranDetailRegion from '../ecrans/EcranDetailRegion';
import EcranDetailPromotion from '../ecrans/EcranDetailPromotion';
import EcranContribution from '../ecrans/EcranContribution';
import EcranFavoris from '../ecrans/EcranFavoris';
import EcranPortails from '../ecrans/EcranPortails';
import EcranDecouverte from '../ecrans/EcranDecouverte';
import EcranAbonnement from '../ecrans/EcranAbonnement';
import EcranEditerProfil from '../ecrans/EcranEditerProfil';
import EcranHistoriquePublications from '../ecrans/EcranHistoriquePublications';
import EcranPaiement from '../ecrans/EcranPaiement';
import EcranRecommandationsIA from '../ecrans/EcranRecommandationsIA';

// Écrans admin
import EcranAdminUtilisateurs from '../ecrans/EcranAdminUtilisateurs';
import EcranAdminContenus from '../ecrans/EcranAdminContenus';
import EcranAdminRegions from '../ecrans/EcranAdminRegions';
import EcranAdminPromotions from '../ecrans/EcranAdminPromotions';

// ─── Types de navigation ────────────────────────────────────────────────────

export type RootStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    ChoixProfil: undefined;
    Connexion: undefined;
    ConnexionLocal: undefined;
    ConnexionTouriste: undefined;
    Inscription: undefined;
    Principal: undefined;
    Categorie: { typeContenu: string };
    DetailContenu: { id: number };
    DetailRegion: { region_id: number; nom?: string };
    DetailPromotion: { id: number };
    Contribution: undefined;
    Favoris: undefined;
    Portails: undefined;
    Decouverte: undefined;
    Abonnement: undefined;
    AdminUtilisateurs: undefined;
    AdminContenus: undefined;
    AdminRegions: undefined;
    AdminPromotions: undefined;
    EditerProfil: undefined;
    HistoriquePublications: undefined;
    Paiement: { montant?: number; plan?: string; utilisateur?: any };
    RecommandationsIA: undefined;
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
            <Stack.Screen name="ChoixProfil" component={EcranChoixProfil} />
            <Stack.Screen name="Connexion" component={EcranConnexion} />
            <Stack.Screen name="ConnexionLocal" component={EcranConnexionLocal} />
            <Stack.Screen name="ConnexionTouriste" component={EcranConnexionTouriste} />
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
                name="DetailPromotion"
                component={EcranDetailPromotion}
                options={{ animation: 'slide_from_bottom' }}
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
            <Stack.Screen
                name="Abonnement"
                component={EcranAbonnement}
                options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
                name="EditerProfil"
                component={EcranEditerProfil}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="HistoriquePublications"
                component={EcranHistoriquePublications}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="Paiement"
                component={EcranPaiement}
                options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
                name="RecommandationsIA"
                component={EcranRecommandationsIA}
                options={{ animation: 'slide_from_right' }}
            />

            {/* Écrans Admin */}
            <Stack.Screen
                name="AdminUtilisateurs"
                component={EcranAdminUtilisateurs}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="AdminContenus"
                component={EcranAdminContenus}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="AdminRegions"
                component={EcranAdminRegions}
                options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
                name="AdminPromotions"
                component={EcranAdminPromotions}
                options={{ animation: 'slide_from_right' }}
            />
        </Stack.Navigator>
    );
}
