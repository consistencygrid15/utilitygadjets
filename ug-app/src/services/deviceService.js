import api from './api';

/**
 * Add a new device.
 * @param {{ name: string, phoneNumber: string, deviceId: string, location?: string }} data
 */
export const addDevice = (data) => api.post('/device/add', data);

/**
 * Fetch all devices for the current user.
 */
export const listDevices = () => api.get('/device/list');

/**
 * Get a single device by ID.
 * @param {string} id - MongoDB device _id
 */
export const getDevice = (id) => api.get(`/device/${id}`);

/**
 * Delete a device.
 * @param {string} id
 */
export const deleteDevice = (id) => api.delete(`/device/${id}`);

/**
 * Send a control command to a device.
 * @param {string} id - MongoDB device _id
 * @param {'ARM'|'DISARM'|'PANIC'} command
 */
export const sendCommand = (id, command) =>
  api.post(`/device/${id}/command`, { command });
