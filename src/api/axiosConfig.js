import axios from 'axios';

// We create an 'instance' so we don't have to type the full URL every time
const api = axios.create({
    // local
baseURL: process.env.REACT_APP_API_URL || 'https://tax-trace-backend-1.onrender.com/api',    // production
    // 'https://tax-trace-backend-1.onrender.com/api'
});

// This is an 'Interceptor'. 
// It acts like a gatekeeper that grabs the token from your browser's 
// storage and sticks it in the header of every request automatically.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;