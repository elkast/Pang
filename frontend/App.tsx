// =============================================================================
// IvoCulture — Point d'entrée de l'application
// Configuration : React Query, NativeBase, Navigation, SafeArea
// =============================================================================

import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

// Ignorer les warnings non-critiques
LogBox.ignoreLogs([
    'In React 18, SSRProvider is not necessary',
    'NativeBase:',
]);

// ─── React Query ────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 2,
        },
    },
});

// ─── Thème NativeBase ───────────────────────────────────────────────────────

const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
    },
});

// ─── Thème Navigation ───────────────────────────────────────────────────────

const navigationTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#E67E22',
        background: '#121B22',
        card: '#1E2A32',
        text: '#E9EDEF',
        border: '#2A3942',
        notification: '#E67E22',
    },
};

// ─── Application ────────────────────────────────────────────────────────────

export default function App() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <NativeBaseProvider theme={theme}>
                    <NavigationContainer theme={navigationTheme}>
                        <AppNavigator />
                    </NavigationContainer>
                </NativeBaseProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
