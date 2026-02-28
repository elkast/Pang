// =============================================================================
// Hook useContenus — Requêtes réutilisables pour les contenus culturels
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import api from '../api/client';

// Liste des contenus par type
export function useContenusParType(typeContenu: string) {
    return useQuery({
        queryKey: ['contenus', typeContenu],
        queryFn: async () => {
            const { data } = await api.get('/contenus/', {
                params: { type_contenu: typeContenu },
            });
            return data;
        },
    });
}

// Tous les contenus
export function useTousContenus() {
    return useQuery({
        queryKey: ['tous_contenus'],
        queryFn: async () => {
            const { data } = await api.get('/contenus/');
            return data;
        },
    });
}

// Détail d'un contenu
export function useDetailContenu(id: number) {
    return useQuery({
        queryKey: ['contenu', id],
        queryFn: async () => {
            const { data } = await api.get(`/contenus/${id}`);
            return data;
        },
    });
}

// Recommandations
export function useRecommandations() {
    return useQuery({
        queryKey: ['recommandations'],
        queryFn: async () => {
            const { data } = await api.get('/recommandations/');
            return data;
        },
    });
}

// Régions
export function useRegions() {
    return useQuery({
        queryKey: ['regions'],
        queryFn: async () => {
            const { data } = await api.get('/regions/');
            return data;
        },
    });
}

// Détail d'une région
export function useDetailRegion(regionId: number) {
    return useQuery({
        queryKey: ['region', regionId],
        queryFn: async () => {
            const { data } = await api.get(`/regions/${regionId}`);
            return data;
        },
    });
}

// Contenus d'une région
export function useContenusRegion(regionId: number) {
    return useQuery({
        queryKey: ['contenus_region', regionId],
        queryFn: async () => {
            const { data } = await api.get(`/contenus/?region_id=${regionId}`);
            return data;
        },
    });
}

// Favoris
export function useFavoris() {
    return useQuery({
        queryKey: ['mes_favoris'],
        queryFn: async () => {
            const { data } = await api.get('/favoris/');
            return data;
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
