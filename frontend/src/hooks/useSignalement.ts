// =============================================================================
// Hook useSignalement — Signaler un contenu
// =============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

export function useSignalerContenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ contenuId, motif }: { contenuId: number; motif?: string }) => {
            try {
                const { data } = await api.post(`/signalements/contenu/${contenuId}`, { motif: motif || 'fausse_info' });
                return data;
            } catch {
                const key = 'signalements_local';
                const raw = await AsyncStorage.getItem(key);
                const list: { contenuId: number; count: number }[] = raw ? JSON.parse(raw) : [];
                const existing = list.find((x) => x.contenuId === contenuId);
                if (existing) existing.count += 1;
                else list.push({ contenuId, count: 1 });
                await AsyncStorage.setItem(key, JSON.stringify(list));
                return { message: 'Signalement enregistré (local)', nb_signalements: existing ? existing.count : 1 };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contenus'] });
        },
    });
}
