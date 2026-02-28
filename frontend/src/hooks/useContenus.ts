// =============================================================================
// Hook useContenus — Requêtes réutilisables pour les contenus culturels
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import api from '../api/client';
import {
    CONTENUS_MOCK,
    REGIONS_MOCK,
    getContenusParType,
    getContenuParId,
    getRegionParId,
    getContenusEnVedette,
    type ContenuMock,
    type RegionMock
} from '../donnees/mockDonnees';

// Fonction pour essayer l'API, avec fallback vers les données mock
async function fetchWithFallback<T>(apiCall: () => Promise<T>, fallbackData: T): Promise<T> {
    try {
        return await apiCall();
    } catch (error) {
        console.log('API échouée, utilisation des données mock');
        return fallbackData;
    }
}

// Liste des contenus par type
export function useContenusParType(typeContenu: string) {
    return useQuery({
        queryKey: ['contenus', typeContenu],
        queryFn: async () => {
            const fallback = getContenusParType(typeContenu);
            return fetchWithFallback(
                () => api.get('/contenus/', { params: { type_contenu: typeContenu } }).then(r => r.data),
                fallback as any
            );
        },
    });
}

// Tous les contenus
export function useTousContenus() {
    return useQuery({
        queryKey: ['tous_contenus'],
        queryFn: async () => {
            return fetchWithFallback(
                () => api.get('/contenus/').then(r => r.data),
                CONTENUS_MOCK as any
            );
        },
    });
}

// Contenus en vedette
export function useContenusVedette() {
    return useQuery({
        queryKey: ['contenus_vedette'],
        queryFn: async () => {
            return fetchWithFallback(
                () => api.get('/contenus/', { params: { featured: true } }).then(r => r.data),
                getContenusEnVedette() as any
            );
        },
    });
}

// Détail d'un contenu
export function useDetailContenu(id: number) {
    return useQuery({
        queryKey: ['contenu', id],
        queryFn: async () => {
            const fallback = getContenuParId(id);
            return fetchWithFallback(
                () => api.get(`/contenus/${id}`).then(r => r.data),
                fallback as any
            );
        },
    });
}

// Recommandations
export function useRecommandations() {
    return useQuery({
        queryKey: ['recommandations'],
        queryFn: async () => {
            return fetchWithFallback(
                () => api.get('/recommandations/').then(r => r.data),
                CONTENUS_MOCK as any
            );
        },
    });
}

// Régions
export function useRegions() {
    return useQuery({
        queryKey: ['regions'],
        queryFn: async () => {
            return fetchWithFallback(
                () => api.get('/regions/').then(r => r.data),
                REGIONS_MOCK as any
            );
        },
    });
}

// Détail d'une région
export function useDetailRegion(regionId: number) {
    return useQuery({
        queryKey: ['region', regionId],
        queryFn: async () => {
            const fallback = getRegionParId(regionId);
            return fetchWithFallback(
                () => api.get(`/regions/${regionId}`).then(r => r.data),
                fallback as any
            );
        },
    });
}

// Contenus d'une région
export function useContenusRegion(regionId: number) {
    return useQuery({
        queryKey: ['contenus_region', regionId],
        queryFn: async () => {
            const fallback = CONTENUS_MOCK.filter(c => c.region_id === regionId);
            return fetchWithFallback(
                () => api.get(`/contenus/?region_id=${regionId}`).then(r => r.data),
                fallback as any
            );
        },
    });
}

// Favoris
export function useFavoris() {
    return useQuery({
        queryKey: ['mes_favoris'],
        queryFn: async () => {
            return fetchWithFallback(
                () => api.get('/favoris/').then(r => r.data),
                [] as any
            );
        },
    });
}

// Mutation : Liker
export function useLikerContenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (contenuId: number) => {
            await api.post('/interactions/', {
                type_interaction: 'LIKE',
                contenu_id: contenuId,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contenus'] });
        },
        onError: () => {
            Alert.alert('Info', 'Connectez-vous pour interagir.');
        },
    });
}

// Mutation : Ajouter aux favoris
export function useAjouterFavori() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (contenuId: number) => {
            await api.post(`/favoris/${contenuId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mes_favoris'] });
            Alert.alert('Succès', 'Ajouté à vos favoris !');
        },
        onError: () => {
            Alert.alert('Info', 'Déjà en favoris ou connexion requise.');
        },
    });
}

// Mutation : Retirer des favoris
export function useRetirerFavori() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (contenuId: number) => {
            await api.delete(`/favoris/${contenuId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mes_favoris'] });
        },
        onError: () => {
            Alert.alert('Erreur', 'Impossible de retirer ce favori.');
        },
    });
}

// Mutation : Créer un contenu
export function useCreerContenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (donnees: any) => {
            const { data } = await api.post('/contenus/', donnees);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tous_contenus'] });
            queryClient.invalidateQueries({ queryKey: ['contenus'] });
        },
    });
}

// Mutation : Modifier un contenu
export function useModifierContenu(contenuId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (donnees: any) => {
            const { data } = await api.put(`/contenus/${contenuId}`, donnees);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contenu', contenuId] });
            queryClient.invalidateQueries({ queryKey: ['tous_contenus'] });
        },
    });
}

// Mutation : Supprimer un contenu
export function useSupprimerContenu() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (contenuId: number) => {
            await api.delete(`/contenus/${contenuId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tous_contenus'] });
            queryClient.invalidateQueries({ queryKey: ['contenus'] });
        },
    });
}
