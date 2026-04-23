import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { registerFcmToken } from './authService';

/**
 * Request notification permission (iOS requires explicit prompt).
 * Android 13+ also requires permission.
 * @returns {Promise<boolean>} true if granted
 */
export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

/**
 * Get the current device FCM token and register it on the backend.
 * Should be called after login or on app startup when authenticated.
 * @returns {Promise<string|null>}
 */
export const setupFcmToken = async () => {
  try {
    // Check if device supports FCM
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }
    }

    const token = await messaging().getToken();
    if (token) {
      await registerFcmToken(token);
    }
    return token;
  } catch (error) {
    console.warn('FCM token setup failed:', error.message);
    return null;
  }
};

/**
 * Listen for foreground messages.
 * Returns an unsubscribe function — call it on component unmount.
 *
 * @param {(message: object) => void} onMessage
 * @returns {() => void} unsubscribe
 */
export const onForegroundMessage = (onMessage) => {
  return messaging().onMessage(async (remoteMessage) => {
    onMessage(remoteMessage);
  });
};

/**
 * Set background/quit message handler.
 * Must be called at the root level (index.js) — outside of any component.
 *
 * @param {(message: object) => void} handler
 */
export const setBackgroundMessageHandler = (handler) => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    handler(remoteMessage);
  });
};

/**
 * Get the initial notification (app opened from a push notification while quit).
 * @returns {Promise<object|null>}
 */
export const getInitialNotification = async () => {
  const remoteMessage = await messaging().getInitialNotification();
  return remoteMessage || null;
};

/**
 * Listen for notification opens (app was in background, user tapped notification).
 * Returns unsubscribe function.
 *
 * @param {(message: object) => void} handler
 * @returns {() => void}
 */
export const onNotificationOpenedApp = (handler) => {
  return messaging().onNotificationOpenedApp(handler);
};

/**
 * Listen for FCM token refresh (token may change, re-register with backend).
 * @returns {() => void} unsubscribe
 */
export const onTokenRefresh = () => {
  return messaging().onTokenRefresh(async (newToken) => {
    try {
      await registerFcmToken(newToken);
    } catch (err) {
      console.warn('FCM token refresh registration failed:', err.message);
    }
  });
};
