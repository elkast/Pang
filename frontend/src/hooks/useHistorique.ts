// =============================================================================
// Hook useHistorique — Historique des publications utilisateur
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { CONTENUS_MOCK } from '../donnees/mockDonnees';

export function useHistoriquePublications() {
    return useQuery({
        queryKey: ['historique_publications'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/contenus/mes-contributions');
                return data;
            } catch {
                const raw = await AsyncStorage.getItem('historique_publications');
                if (raw) return JSON.parse(raw);
                return [];
            }
        },
    });
}
