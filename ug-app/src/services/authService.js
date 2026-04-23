import api from './api';

/**
 * Register a new user account.
 * @param {{ name: string, email: string, password: string }} data
 */
export const register = (data) => api.post('/auth/register', data);

/**
 * Login with email + password.
 * @param {{ email: string, password: string }} data
 */
export const login = (data) => api.post('/auth/login', data);

/**
 * Get current authenticated user profile.
 */
export const getMe = () => api.get('/auth/me');

/**
 * Register or refresh the user's FCM token on the backend.
 * @param {string} token
 */
export const registerFcmToken = (token) => api.post('/auth/fcm-token', { token });

/**
 * Remove FCM token on logout.
 * @param {string} token
 */
export const removeFcmToken = (token) => api.delete('/auth/fcm-token', { data: { token } });
