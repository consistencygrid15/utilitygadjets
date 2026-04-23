import api from './api';

/**
 * Fetch paginated alert history.
 * @param {{ page?: number, limit?: number, unreadOnly?: boolean }} params
 */
export const getAlerts = (params = {}) => api.get('/alerts', { params });

/**
 * Mark a single alert as read.
 * @param {string} id - Alert MongoDB _id
 */
export const markAlertRead = (id) => api.patch(`/alerts/${id}/read`);

/**
 * Mark all alerts as read.
 */
export const markAllAlertsRead = () => api.patch('/alerts/read-all');

/**
 * Delete an alert.
 * @param {string} id
 */
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);
