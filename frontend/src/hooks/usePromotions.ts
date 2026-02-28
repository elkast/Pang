// =============================================================================
// Hook usePromotions — Requêtes pour les promotions culturelles
// Fallback automatique vers les données mock
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import {
    PROMOTIONS_MOCK,
    getPromotionsParType,
    getPromotionParId,
    getPromotionsFeatured,
} from '../donnees/mockDonnees';

async function fetchWithFallback<T>(apiCall: () => Promise<T>, fallbackData: T): Promise<T> {
    try {
        return await apiCall();
    } catch (error) {
        console.log('API indisponible, utilisation des données mock');
        return fallbackData;
    }
}

// Toutes les promotions actives
export function usePromotions(typePromotion?: string) {
    return useQuery({
        queryKey: ['promotions', typePromotion],
        queryFn: async () => {
            const fallback = typePromotion
                ? getPromotionsParType(typePromotion)
                : PROMOTIONS_MOCK;
            const params = typePromotion ? { type_promotion: typePromotion } : {};
            return fetchWithFallback(
                () => api.get('/promotions/', { params }).then(r => r.data),
                fallback as any
            );
        },
    });
}

// Promotions en vedette (pour l'accueil)
export function usePromotionsFeatured() {
    return useQuery({
        queryKey: ['promotions_featured'],
        queryFn: async () => {
            return fetchWithFallback(
                () => api.get('/promotions/', { params: { featured: true } }).then(r => r.data),
                getPromotionsFeatured() as any
            );
        },
    });
}

// Détail d'une promotion
export function useDetailPromotion(id: number) {
    return useQuery({
        queryKey: ['promotion', id],
        queryFn: async () => {
            const fallback = getPromotionParId(id);
            return fetchWithFallback(
                () => api.get(`/promotions/${id}`).then(r => r.data),
                fallback as any
            );
        },
        enabled: !!id,
    });
}

// ─── MUTATIONS ADMIN ─────────────────────────────────────────────────────────

export function useCreerPromotion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (donnees: any) => {
            const { data } = await api.post('/promotions/', donnees);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
        },
    });
}

export function useModifierPromotion(id: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (donnees: any) => {
            const { data } = await api.patch(`/promotions/${id}`, donnees);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
            queryClient.invalidateQueries({ queryKey: ['promotion', id] });
        },
    });
}

export function useSupprimerPromotion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/promotions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
        },
    });
}
