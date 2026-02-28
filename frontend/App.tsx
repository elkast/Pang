// =============================================================================
// Pang — Point d'entrée de l'application
// Configuration : React Query, NativeBase, Navigation, SafeArea
// =============================================================================

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

// Ignorer les warnings non-critiques de bibliothèques tierces
LogBox.ignoreLogs([
    'In React 18, SSRProvider is not necessary and is a noop',
    'NativeBase:',
    'Warning: Each child in a list should have a unique',
]);

// ─── React Query ────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
});

// ─── Thème NativeBase ───────────────────────────────────────────────────────

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
    },
    colors: {
        primary: {
            50: '#FFF4EC',
            100: '#FFE4CC',
            200: '#FFC499',
            300: '#FFA066',
            400: '#FF7F33',
            500: '#E67E22',
            600: '#D35400',
            700: '#A04000',
            800: '#6D2A00',
            900: '#3A1500',
        },
    },
});

// ─── Thème Navigation (Clair) ────────────────────────────────────────────────

const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#E67E22',
        background: '#FFFFFF',
        card: '#FFFFFF',
        text: '#1A1A1A',
        border: '#F0F0F0',
        notification: '#E67E22',
    },
};

// ─── Application ────────────────────────────────────────────────────────────

export default function App() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <NativeBaseProvider theme={theme}>
                    <AuthProvider>
                        <NavigationContainer theme={navigationTheme}>
                            <AppNavigator />
                        </NavigationContainer>
                    </AuthProvider>
                </NativeBaseProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
