import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'token';

export const tokenStorage = {
    async getToken(): Promise<string | null> {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            return token;
        } catch (error) {
            console.log('TokenStorage getToken error:', error);
            return null;
        }
    },

    async setToken(token: string): Promise<void> {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.log('TokenStorage setToken error:', error);
        }
    },

    async removeToken(): Promise<void> {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (error) {
            console.log('TokenStorage removeToken error:', error);
        }
    },
};
