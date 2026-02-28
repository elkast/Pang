// =============================================================================
// Hook useAdmin — Toutes les mutations et requêtes d'administration
// Utilise React Query pour le cache et la synchronisation
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

// ─── STATS ───────────────────────────────────────────────────────────────────

export function useStatsAdmin() {
    return useQuery({
        queryKey: ['admin_stats'],
        queryFn: async () => {
            const { data } = await api.get('/admin/stats');
            return data;
        },
        retry: 1,
    });
}

// ─── UTILISATEURS ─────────────────────────────────────────────────────────────

export function useUtilisateursAdmin() {
    return useQuery({
        queryKey: ['admin_utilisateurs'],
        queryFn: async () => {
            const { data } = await api.get('/admin/utilisateurs', { params: { limit: 100 } });
            return data;
        },
        retry: 1,
    });
}

export function useModifierUtilisateur() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, donnees }: { id: number; donnees: any }) => {
            const { data } = await api.patch(`/admin/utilisateurs/${id}`, donnees);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_utilisateurs'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });
}

export function useDesactiverUtilisateur() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/admin/utilisateurs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_utilisateurs'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });
}

// ─── CONTENUS ─────────────────────────────────────────────────────────────────

export function useContenusAdmin() {
    return useQuery({
        queryKey: ['admin_contenus'],
        queryFn: async () => {
            const { data } = await api.get('/admin/contenus', { params: { limit: 100 } });
            return data;
        },
        retry: 1,
    });
}

export function usePublierContenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.patch(`/admin/contenus/${id}/publier`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_contenus'] });
        },
    });
}

export function useToggleFeaturedContenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await api.patch(`/admin/contenus/${id}/featured`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_contenus'] });
        },
    });
}

export function useSupprimerContenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/admin/contenus/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_contenus'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });
}

// ─── RÉGIONS ──────────────────────────────────────────────────────────────────

export function useRegionsAdmin() {
    return useQuery({
        queryKey: ['admin_regions'],
        queryFn: async () => {
            const { data } = await api.get('/admin/regions');
            return data;
        },
        retry: 1,
    });
}

export function useCreerRegion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (donnees: any) => {
            const { data } = await api.post('/admin/regions', donnees);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_regions'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });
}

export function useModifierRegion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, donnees }: { id: number; donnees: any }) => {
            const { data } = await api.patch(`/admin/regions/${id}`, donnees);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_regions'] });
        },
    });
}

export function useSupprimerRegion() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/admin/regions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_regions'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });
}

// ─── PROMOTIONS ADMIN ────────────────────────────────────────────────────────

export function usePromotionsAdmin() {
    return useQuery({
        queryKey: ['admin_promotions'],
        queryFn: async () => {
            const { data } = await api.get('/admin/promotions');
            return data;
        },
        retry: 1,
    });
}

export function useCreerPromotionAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (donnees: any) => {
            const { data } = await api.post('/admin/promotions', donnees);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_promotions'] });
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });
}

export function useModifierPromotionAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, donnees }: { id: number; donnees: any }) => {
            const { data } = await api.patch(`/admin/promotions/${id}`, donnees);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_promotions'] });
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
        },
    });
}

export function useSupprimerPromotionAdmin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/admin/promotions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_promotions'] });
            queryClient.invalidateQueries({ queryKey: ['promotions'] });
            queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
        },
    });
}
