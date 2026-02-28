// =============================================================================
// Hook useAuth — Gestion centralisée de l'authentification
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { tokenStorage } from '../utils/tokenStorage';
import api from '../api/client';

interface Utilisateur {
    id: number;
    email: string;
    username: string;
    nom_complet?: string;
    bio?: string;
    avatar_url?: string;
    type_utilisateur: 'local' | 'touriste';
    is_premium: boolean;
    is_admin: boolean;
    contributions_count: number;
}

export function useAuth() {
    const [etat, setEtat] = useState<any>({
        utilisateur: null,
        estConnecte: false,
        estAdmin: false,
        estTouriste: false,
        estPremium: false,
        chargement: true,
    });

    const chargerProfil = useCallback(async () => {
        let token = null;
        try {
            token = await tokenStorage.getToken();
        } catch {
            // Storage non disponible - continuer silencieusement
        }

        if (!token) {
            setEtat({ utilisateur: null, estConnecte: false, estAdmin: false, estTouriste: false, estPremium: false, chargement: false });
            return;
        }
        try {
            const { data } = await api.get('/profil/moi');
            setEtat({
                utilisateur: data,
                estConnecte: true,
                estAdmin: data.is_admin || false,
                estTouriste: data.type_utilisateur === 'touriste',
                estPremium: data.is_premium || false,
                chargement: false,
            });
        } catch {
            setEtat({ utilisateur: null, estConnecte: false, estAdmin: false, estTouriste: false, estPremium: false, chargement: false });
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
            await tokenStorage.setToken(data.access_token);
        } catch {
            // Ignorer erreur storage
        }

        setEtat({
            utilisateur: data.user,
            estConnecte: true,
            estAdmin: data.user.is_admin || false,
            estTouriste: data.user.type_utilisateur === 'touriste',
            estPremium: data.user.is_premium || false,
            chargement: false,
        });
        return data;
    };

    const inscrire = async (
        nomUtilisateur: string,
        email: string,
        motDePasse: string,
        typeUtilisateur: 'local' | 'touriste' = 'local'
    ) => {
        try {
            const { data } = await api.post('/auth/register', {
                email,
                username: nomUtilisateur,
                password: motDePasse,
                type_utilisateur: typeUtilisateur,
            });
            return data;
        } catch (error: any) {
            console.log('Erreur inscription:', error.response?.data || error.message);
            throw error;
        }
    };

    const seDeconnecter = async () => {
        try {
            await tokenStorage.removeToken();
        } catch {
            // Ignorer erreur storage
        }
        setEtat({ utilisateur: null, estConnecte: false, estAdmin: false, estTouriste: false, estPremium: false, chargement: false });
    };

    return {
        ...etat,
        seConnecter,
        inscrire,
        seDeconnecter,
        recharger: chargerProfil,
    };
}
