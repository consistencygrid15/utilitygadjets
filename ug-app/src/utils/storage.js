import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'UGApp';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Store JWT token securely in Keychain.
 * @param {string} token
 */
export const saveToken = async (token) => {
  await Keychain.setGenericPassword(TOKEN_KEY, token, { service: SERVICE_NAME });
};

/**
 * Retrieve stored JWT token.
 * @returns {Promise<string|null>}
 */
export const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE_NAME });
    return credentials ? credentials.password : null;
  } catch {
    return null;
  }
};

/**
 * Remove stored JWT token (logout).
 */
export const removeToken = async () => {
  await Keychain.resetGenericPassword({ service: SERVICE_NAME });
};

/**
 * Store user object as JSON string.
 * @param {object} user
 */
export const saveUser = async (user) => {
  await Keychain.setGenericPassword(USER_KEY, JSON.stringify(user), {
    service: `${SERVICE_NAME}_user`,
  });
};

/**
 * Retrieve stored user object.
 * @returns {Promise<object|null>}
 */
export const getUser = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({ service: `${SERVICE_NAME}_user` });
    return credentials ? JSON.parse(credentials.password) : null;
  } catch {
    return null;
  }
};

/**
 * Remove stored user (logout).
 */
export const removeUser = async () => {
  await Keychain.resetGenericPassword({ service: `${SERVICE_NAME}_user` });
};

/**
 * Clear all auth data (full logout).
 */
export const clearAuthData = async () => {
  await Promise.all([removeToken(), removeUser()]);
};
