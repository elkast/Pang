// =============================================================================
// — Client API Axios
// Intercepteur JWT automatique sur toutes les requêtes
// =============================================================================

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.169.86.196:8000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur : ajout automatique du token JWT
api.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch {
        // Storage non disponible - continuer sans token
    }
    return config;
});

// Intercepteur de réponse : gestion 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                await AsyncStorage.removeItem('token');
            } catch {
                // Ignorer erreur storage
            }
        }
        return Promise.reject(error);
    }
);

export default api;
