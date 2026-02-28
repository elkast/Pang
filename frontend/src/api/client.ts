// =============================================================================
// IvoCulture — Client API Axios
// Intercepteur JWT automatique sur toutes les requêtes
// =============================================================================

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
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
