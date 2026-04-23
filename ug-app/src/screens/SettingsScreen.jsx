import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { setNotificationsEnabled } from '../redux/slices/appSlice';
import { removeFcmToken } from '../services/authService';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/constants';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { notificationsEnabled } = useSelector((s) => s.app);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  const handleNotificationToggle = async (value) => {
    dispatch(setNotificationsEnabled(value));
    // TODO: Update on backend via PATCH /api/auth/me
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.pageTitle}>Settings</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <SettingsRow
          label="Push Notifications"
          subtitle="Receive real-time security alerts"
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#fff"
            />
          }
        />

        {/* About */}
        <SectionHeader title="About" />
        <SettingsRow label="Version" right={<Text style={styles.infoText}>1.0.0</Text>} />
        <SettingsRow
          label="System"
          right={<Text style={styles.infoText}>UG Security v1</Text>}
        />

        {/* Danger zone */}
        <SectionHeader title="Account" />
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
};

const SectionHeader = ({ title }) => (
  <Text style={sectionStyles.header}>{title}</Text>
);

const SettingsRow = ({ label, subtitle, right }) => (
  <View style={rowStyles.row}>
    <View style={rowStyles.left}>
      <Text style={rowStyles.label}>{label}</Text>
      {subtitle ? <Text style={rowStyles.subtitle}>{subtitle}</Text> : null}
    </View>
    <View style={rowStyles.right}>{right}</View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  headerBar: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  pageTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary + '30',
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
  },
  profileInfo: { flex: 1 },
  profileName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  profileEmail: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  roleText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
  },
  logoutBtn: {
    marginHorizontal: SPACING.md,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
});

const sectionStyles = StyleSheet.create({
  header: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  left: { flex: 1, marginRight: SPACING.sm },
  label: { color: COLORS.textPrimary, fontSize: FONTS.sizes.md, fontWeight: '500' },
  subtitle: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  right: {},
});

export default SettingsScreen;
