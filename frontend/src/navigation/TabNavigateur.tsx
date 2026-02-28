// =============================================================================
// IvoCulture — Navigateur à Onglets
// 5 onglets : Accueil, Découvrir, Contribuer, Promotions, Profil (+Admin si admin)
// =============================================================================

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs } from '../constantes';
import { useAuthContext } from '../context/AuthContext';

import EcranAccueil from '../ecrans/EcranAccueil';
import EcranDecouverte from '../ecrans/EcranDecouverte';
import EcranContribution from '../ecrans/EcranContribution';
import EcranPromotion from '../ecrans/EcranPromotion';
import EcranProfil from '../ecrans/EcranProfil';
import EcranAdmin from '../ecrans/EcranAdmin';

const Tab = createBottomTabNavigator();

export default function TabNavigateur() {
    const { estAdmin } = useAuthContext();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Couleurs.accent.principal,
                tabBarInactiveTintColor: Couleurs.texte.secondaire,
                tabBarStyle: {
                    backgroundColor: Couleurs.fond.primaire,
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 88 : 65,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
                    paddingTop: 8,
                    elevation: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Accueil"
                component={EcranAccueil}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Découvrir"
                component={EcranDecouverte}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="compass" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Contribuer"
                component={EcranContribution}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Promotions"
                component={EcranPromotion}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="star" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profil"
                component={EcranProfil}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
            {estAdmin && (
                <Tab.Screen
                    name="Admin"
                    component={EcranAdmin}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="shield-checkmark" size={size} color={color} />
                        ),
                        tabBarActiveTintColor: '#E74C3C',
                    }}
                />
            )}
        </Tab.Navigator>
    );
}
