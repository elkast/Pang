// =============================================================================
// Hook useAuth — Gestion centralisée de l'authentification
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/client';

interface Utilisateur {
    id: number;
    email: string;
    username: string;
    nom_complet?: string;
    bio?: string;
    avatar_url?: string;
    is_premium: boolean;
    is_admin: boolean;
    contributions_count: number;
}

export function useAuth() {
    const [etat, setEtat] = useState<any>({
        utilisateur: null,
        estConnecte: false,
        estAdmin: false,
        chargement: true,
    });

    const chargerProfil = useCallback(async () => {
        let token = null;
        try {
            token = await AsyncStorage.getItem('token');
        } catch {
            // Storage non disponible - continuer silencieusement
        }

        if (!token) {
            setEtat({ utilisateur: null, estConnecte: false, estAdmin: false, chargement: false });
            return;
        }
        try {
            const { data } = await api.get('/profil/moi');
            setEtat({
                utilisateur: data,
                estConnecte: true,
                estAdmin: data.is_admin || false,
                chargement: false,
            });
        } catch {
            setEtat({ utilisateur: null, estConnecte: false, estAdmin: false, chargement: false });
        }
    }, []);

    useEffect(() => {
        chargerProfil();
    }, [chargerProfil]);

    const seConnecter = async (email: string, motDePasse: string) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', motDePasse);

        const { data } = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        try {
            await AsyncStorage.setItem('token', data.access_token);
        } catch {
            // Ignorer erreur storage
        }

        setEtat({
            utilisateur: data.user,
            estConnecte: true,
            estAdmin: data.user.is_admin || false,
            chargement: false,
        });
        return data;
    };

    const inscrire = async (nomUtilisateur: string, email: string, motDePasse: string) => {
        try {
            const { data } = await api.post('/auth/register', {
                email,
                username: nomUtilisateur,
                password: motDePasse,
            });
            return data;
        } catch (error: any) {
            console.log('Erreur inscription:', error.response?.data || error.message);
            throw error;
        }
    };

    const seDeconnecter = async () => {
        try {
            await AsyncStorage.removeItem('token');
        } catch {
            // Ignorer erreur storage
        }
        setEtat({ utilisateur: null, estConnecte: false, estAdmin: false, chargement: false });
    };

    return {
        ...etat,
        seConnecter,
        inscrire,
        seDeconnecter,
        recharger: chargerProfil,
    };
}
