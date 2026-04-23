import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices, sendDeviceCommand } from '../redux/slices/deviceSlice';
import { fetchAlerts } from '../redux/slices/alertSlice';
import DeviceCard from '../components/DeviceCard';
import AlertItem from '../components/AlertItem';
import EmptyState from '../components/EmptyState';
import { COLORS, FONTS, SPACING } from '../utils/constants';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: devices, loading: devicesLoading, commandLoading } = useSelector((s) => s.devices);
  const { items: alerts, unreadCount } = useSelector((s) => s.alerts);

  const recentAlerts = alerts.slice(0, 3);

  const load = () => {
    dispatch(fetchDevices());
    dispatch(fetchAlerts({ limit: 5 }));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCommand = (device, command) => {
    dispatch(sendDeviceCommand({ id: device._id, command }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={devicesLoading}
            onRefresh={load}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['#0D1526', COLORS.bg]}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                Good {getTimeOfDay()},{'\n'}
                <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'User'} 👋</Text>
              </Text>
            </View>
            {unreadCount > 0 && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>

          {/* Status summary */}
          <View style={styles.statsRow}>
            <StatCard
              label="Devices"
              value={devices.length}
              sub={`${devices.filter((d) => d.status === 'armed').length} armed`}
              color={COLORS.primary}
            />
            <StatCard
              label="Alerts"
              value={unreadCount}
              sub="unread"
              color={unreadCount > 0 ? COLORS.danger : COLORS.success}
            />
            <StatCard
              label="Active"
              value={devices.filter((d) => d.status !== 'offline').length}
              sub="online"
              color={COLORS.success}
            />
          </View>
        </LinearGradient>

        {/* Devices */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏠 Devices</Text>
            <Text
              style={styles.seeAll}
              onPress={() => navigation.navigate('Devices')}
            >
              See all
            </Text>
          </View>

          {devices.length === 0 ? (
            <EmptyState
              emoji="📡"
              title="No devices yet"
              subtitle="Add your first GSM security device"
            />
          ) : (
            devices.slice(0, 2).map((device) => (
              <DeviceCard
                key={device._id}
                device={device}
                commandLoading={commandLoading}
                onArm={() => handleCommand(device, 'ARM')}
                onDisarm={() => handleCommand(device, 'DISARM')}
                onPanic={() => handleCommand(device, 'PANIC')}
                onDelete={() => {}}
              />
            ))
          )}
        </View>

        {/* Recent Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚨 Recent Alerts</Text>
            <Text
              style={styles.seeAll}
              onPress={() => navigation.navigate('Alerts')}
            >
              See all
            </Text>
          </View>

          {recentAlerts.length === 0 ? (
            <EmptyState emoji="✅" title="All clear!" subtitle="No recent alerts" />
          ) : (
            recentAlerts.map((alert) => (
              <AlertItem
                key={alert._id}
                alert={alert}
                onPress={() => navigation.navigate('Alerts')}
              />
            ))
          )}
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
};

const StatCard = ({ label, value, sub, color }) => (
  <View style={statStyles.card}>
    <Text style={[statStyles.value, { color }]}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
    <Text style={statStyles.sub}>{sub}</Text>
  </View>
);

const getTimeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  alertBadge: {
    backgroundColor: COLORS.danger,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  alertBadgeText: {
    color: '#fff',
    fontSize: FONTS.sizes.xs,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  section: {
    marginTop: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
});

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  value: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  sub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
});

export default DashboardScreen;
