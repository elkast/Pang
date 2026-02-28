// =============================================================================
// Hook useAuth — Gestion centralisée de l'authentification
// Fallback LocalStorage quand API/mock indisponibles
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenStorage } from '../utils/tokenStorage';
import { localAuthStorage, type UtilisateurLocal } from '../utils/localAuthStorage';
import api from '../api/client';

const LOCAL_TOKEN = 'local_mode_token';
const LOCAL_USERS = 'local_users_store';

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
    contributions_count?: number;
}

interface LocalUserEntry {
    email: string;
    username: string;
    passwordHash: string;
    user: UtilisateurLocal;
}

async function hashSimple(str: string): Promise<string> {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        h = ((h << 5) - h) + c;
        h = h & h;
    }
    return String(Math.abs(h));
}

async function getLocalUsers(): Promise<LocalUserEntry[]> {
    try {
        const raw = await AsyncStorage.getItem(LOCAL_USERS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

async function saveLocalUser(entry: LocalUserEntry): Promise<void> {
    const users = await getLocalUsers();
    const filtered = users.filter(u => u.email !== entry.email);
    filtered.push(entry);
    await AsyncStorage.setItem(LOCAL_USERS, JSON.stringify(filtered));
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
        let token: string | null = null;
        try {
            token = await tokenStorage.getToken();
        } catch {}

        if (!token) {
            const localToken = await AsyncStorage.getItem(LOCAL_TOKEN);
            if (localToken) {
                const user = await localAuthStorage.getUserLocal();
                if (user) {
                    let premium = user.is_premium;
                    try {
                        const p = await AsyncStorage.getItem('abonnement_premium');
                        if (p) {
                            const d = JSON.parse(p);
                            if (d?.actif) premium = true;
                        }
                    } catch {}
                    setEtat({
                        utilisateur: { ...user, id: parseInt(user.id, 10) || Date.now() },
                        estConnecte: true,
                        estAdmin: user.is_admin || false,
                        estTouriste: user.type_utilisateur === 'touriste',
                        estPremium: premium,
                        chargement: false,
                    });
                    return;
                }
            }
            setEtat({ utilisateur: null, estConnecte: false, estAdmin: false, estTouriste: false, estPremium: false, chargement: false });
            return;
        }

        try {
            const { data } = await api.get('/profil/moi');
            let premium = data.is_premium || false;
            try {
                const p = await AsyncStorage.getItem('abonnement_premium');
                if (p) { const d = JSON.parse(p); if (d?.actif) premium = true; }
            } catch {}
            setEtat({
                utilisateur: data,
                estConnecte: true,
                estAdmin: data.is_admin || false,
                estTouriste: data.type_utilisateur === 'touriste',
                estPremium: premium,
                chargement: false,
            });
        } catch {
            const user = await localAuthStorage.getUserLocal();
                if (user) {
                    let premium = user.is_premium;
                    try {
                        const p = await AsyncStorage.getItem('abonnement_premium');
                        if (p) { const d = JSON.parse(p); if (d?.actif) premium = true; }
                    } catch {}
                    setEtat({
                        utilisateur: { ...user, id: parseInt(user.id, 10) || Date.now() },
                        estConnecte: true,
                        estAdmin: user.is_admin || false,
                        estTouriste: user.type_utilisateur === 'touriste',
                        estPremium: premium,
                        chargement: false,
                    });
                } else {
                setEtat({ utilisateur: null, estConnecte: false, estAdmin: false, estTouriste: false, estPremium: false, chargement: false });
            }
        }
    }, []);

    useEffect(() => {
        chargerProfil();
    }, [chargerProfil]);

    const seConnecter = async (email: string, motDePasse: string) => {
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', motDePasse);

            const { data } = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            try {
                await tokenStorage.setToken(data.access_token);
            } catch {}

            setEtat({
                utilisateur: data.user,
                estConnecte: true,
                estAdmin: data.user.is_admin || false,
                estTouriste: data.user.type_utilisateur === 'touriste',
                estPremium: data.user.is_premium || false,
                chargement: false,
            });
            return data;
        } catch {
            const users = await getLocalUsers();
            const pHash = await hashSimple(motDePasse);
            const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === pHash);
            if (match) {
                await AsyncStorage.setItem(LOCAL_TOKEN, 'local_' + Date.now());
                await localAuthStorage.setUserLocal(match.user);
                setEtat({
                    utilisateur: { ...match.user, id: parseInt(match.user.id, 10) || Date.now() },
                    estConnecte: true,
                    estAdmin: match.user.is_admin || false,
                    estTouriste: match.user.type_utilisateur === 'touriste',
                    estPremium: match.user.is_premium || false,
                    chargement: false,
                });
                return { user: match.user, access_token: 'local' };
            }
            throw new Error('Identifiants incorrects ou API indisponible.');
        }
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
        } catch {
            const user: UtilisateurLocal = {
                id: 'local_' + Date.now(),
                email,
                username: nomUtilisateur,
                nom_complet: nomUtilisateur,
                type_utilisateur: typeUtilisateur,
                is_premium: false,
                is_admin: false,
            };
            const pHash = await hashSimple(motDePasse);
            await saveLocalUser({ email, username: nomUtilisateur, passwordHash: pHash, user });
            await AsyncStorage.setItem(LOCAL_TOKEN, 'local_' + Date.now());
            await localAuthStorage.setUserLocal(user);
            setEtat({
                utilisateur: { ...user, id: parseInt(user.id.replace('local_', ''), 10) || Date.now() },
                estConnecte: true,
                estAdmin: false,
                estTouriste: typeUtilisateur === 'touriste',
                estPremium: false,
                chargement: false,
            });
            return { user, isLocal: true };
        }
    };

    const seDeconnecter = async () => {
        try {
            await tokenStorage.removeToken();
            await AsyncStorage.removeItem(LOCAL_TOKEN);
            await localAuthStorage.clearUserLocal();
        } catch {}
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
