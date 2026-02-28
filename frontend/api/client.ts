import axios from 'axios';
import { tokenStorage } from '../src/utils/tokenStorage';

// URL de l'API - IP locale de l'ordinateur: 10.169.86.15
// Pour React Native mobile (téléphone physique)
const API_BASE_URL = "http://10.169.86.15:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await tokenStorage.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.log('Erreur lors de la récupération du token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expiré ou invalide - nettoyer le stockage
            tokenStorage.removeToken();
        }
        return Promise.reject(error);
    }
);

export default api;
