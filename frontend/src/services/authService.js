import api from './api';

export const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data ?? response;
};

export const register = async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data ?? response;
};

export const authService = {
    login,
    register
};

export default authService;