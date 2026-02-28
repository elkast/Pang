// =============================================================================
// IvoCulture — Navigateur à Onglets
// 4 onglets principaux : Accueil, Découvrir, Contribuer, Profil
// =============================================================================

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Couleurs } from '../constantes';

import EcranAccueil from '../ecrans/EcranAccueil';
import EcranDecouverte from '../ecrans/EcranDecouverte';
import EcranContribution from '../ecrans/EcranContribution';
import EcranProfil from '../ecrans/EcranProfil';

const Tab = createBottomTabNavigator();

export default function TabNavigateur() {
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
                name="Profil"
                component={EcranProfil}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
