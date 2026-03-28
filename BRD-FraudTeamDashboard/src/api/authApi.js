import api from './axiosInstance';

export const authApi = {
    login: async (credentials) => {
        const response = await api.post('/accounts/login/', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/accounts/register/', userData);
        return response.data;
    },

    logout: async () => {
        const refresh = localStorage.getItem('refreshToken');
        if (refresh) {
            try {
                await api.post('/accounts/logout/', { refresh });
            } catch (error) {
                console.error('Logout error on backend:', error);
            }
        }
        // Always clear local storage, even if backend logout fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getProfile: async () => {
        const response = await api.get('/accounts/me/');
        return response.data;
    }
};
