import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import DeviceManagementScreen from '../screens/DeviceManagementScreen';
import AlertHistoryScreen from '../screens/AlertHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS, FONTS } from '../utils/constants';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: { active: '🏠', inactive: '🏡' },
  Devices: { active: '📡', inactive: '📶' },
  Alerts: { active: '🚨', inactive: '🔔' },
  Settings: { active: '⚙️', inactive: '⚙' },
};

const MainTabNavigator = () => {
  const { unreadCount } = useSelector((s) => s.alerts);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <View style={styles.tabBarBg} />,
        tabBarLabel: ({ focused, color }) => (
          <Text style={[styles.tabLabel, { color }]}>{route.name}</Text>
        ),
        tabBarIcon: ({ focused }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <Text style={styles.tabIcon}>{focused ? icons.active : icons.inactive}</Text>
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Devices" component={DeviceManagementScreen} />
      <Tab.Screen
        name="Alerts"
        component={AlertHistoryScreen}
        options={{
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: styles.badge,
        }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0D1526',
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 6,
    paddingTop: 4,
  },
  tabBarBg: {
    flex: 1,
    backgroundColor: '#0D1526',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 20,
  },
  badge: {
    backgroundColor: COLORS.danger,
    fontSize: 10,
    fontWeight: '800',
  },
});

export default MainTabNavigator;
