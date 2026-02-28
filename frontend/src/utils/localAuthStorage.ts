// =============================================================================
// IvoCulture — Stockage local pour auth hors-ligne
// Fallback quand API/mock non disponibles
// =============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    TOKEN: 'token',
    USER: 'user_local',
    USER_EMAIL: 'user_local_email',
    USER_PASSWORD_HASH: 'user_local_password_hash',
    LAST_LOGIN: 'last_login',
};

export interface UtilisateurLocal {
    id: string;
    email: string;
    username: string;
    nom_complet?: string;
    type_utilisateur: 'local' | 'touriste';
    is_premium: boolean;
    is_admin: boolean;
}

export const localAuthStorage = {
    async setUserLocal(user: UtilisateurLocal): Promise<void> {
        try {
            await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
        } catch (e) {
            console.log('localAuthStorage setUserLocal:', e);
        }
    },

    async getUserLocal(): Promise<UtilisateurLocal | null> {
        try {
            const raw = await AsyncStorage.getItem(KEYS.USER);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    async clearUserLocal(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([KEYS.USER, KEYS.TOKEN, KEYS.LAST_LOGIN]);
        } catch {}
    },
};
