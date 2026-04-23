/**
 * UG App — Entry Point
 * Registers background FCM handler BEFORE anything else.
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { setBackgroundMessageHandler } from './src/services/fcmService';

// Must be registered at the root — runs even when app is terminated
setBackgroundMessageHandler((remoteMessage) => {
  // Background messages are handled by the OS notification tray.
  // No Redux dispatch possible here — app is not running.
  // When user taps the notification, getInitialNotification() in AppNavigator handles it.
  console.log('[BGMessage] Received:', remoteMessage?.data?.type);
});

AppRegistry.registerComponent(appName, () => App);
