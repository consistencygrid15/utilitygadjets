import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SplashScreen from '../screens/SplashScreen';

import {
  setupFcmToken,
  requestNotificationPermission,
  onForegroundMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  onTokenRefresh,
} from '../services/fcmService';
import { addIncomingAlert } from '../redux/slices/alertSlice';
import { COLORS } from '../utils/constants';

const Stack = createStackNavigator();

// Linking config for deep linking from push notifications
const linking = {
  prefixes: ['ugapp://'],
  config: {
    screens: {
      Main: {
        screens: {
          Alerts: 'alerts',
          Dashboard: 'dashboard',
          Devices: 'devices',
        },
      },
    },
  },
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, sessionLoading } = useSelector((s) => s.auth);
  const navigationRef = useRef(null);

  // Set up FCM after authentication
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubForeground;
    let unsubOpened;
    let unsubTokenRefresh;

    const initFcm = async () => {
      const granted = await requestNotificationPermission();
      if (!granted) return;

      await setupFcmToken();

      // Foreground: show in-app alert and add to Redux
      unsubForeground = onForegroundMessage((message) => {
        const data = message.data || {};
        if (data.alertId) {
          dispatch(
            addIncomingAlert({
              _id: data.alertId,
              type: data.type || 'intrusion',
              zone: data.zone || 'UNKNOWN',
              alertTime: data.alertTime || '',
              isRead: false,
              createdAt: new Date().toISOString(),
              deviceId: data.deviceName
                ? { name: data.deviceName, _id: data.deviceId }
                : null,
            })
          );
        }
        // You can show a toast/in-app modal here using dispatch(showToast(...))
      });

      // Background: app opened by tapping notification
      unsubOpened = onNotificationOpenedApp((message) => {
        const screen = message?.data?.screen;
        if (screen && navigationRef.current) {
          navigationRef.current.navigate('Main', { screen });
        }
      });

      // Quit state: check for notification that opened the app
      const initial = await getInitialNotification();
      if (initial?.data?.screen && navigationRef.current) {
        setTimeout(() => {
          navigationRef.current?.navigate('Main', { screen: initial.data.screen });
        }, 500);
      }

      unsubTokenRefresh = onTokenRefresh();
    };

    initFcm();

    return () => {
      unsubForeground?.();
      unsubOpened?.();
      unsubTokenRefresh?.();
    };
  }, [isAuthenticated, dispatch]);

  if (sessionLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={{
        dark: true,
        colors: {
          background: COLORS.bg,
          card: COLORS.bgCard,
          text: COLORS.textPrimary,
          border: COLORS.border,
          primary: COLORS.primary,
          notification: COLORS.danger,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
