import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, COMMANDS } from '../utils/constants';
import Badge from './Badge';
import { formatPhone } from '../utils/formatters';

/**
 * Device card component.
 *
 * Props:
 *   device         {object}
 *   onArm          {function}
 *   onDisarm       {function}
 *   onPanic        {function}
 *   onDelete       {function}
 *   commandLoading {boolean}
 */
const DeviceCard = ({ device, onArm, onDisarm, onPanic, onDelete, commandLoading }) => {
  const isArmed = device.status === 'armed';
  const isAlert = device.status === 'alert';

  return (
    <View style={[styles.card, isAlert && styles.alertCard]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceId}>ID: {device.deviceId}</Text>
          {device.location ? (
            <Text style={styles.location}>📍 {device.location}</Text>
          ) : null}
        </View>
        <Badge status={device.status} />
      </View>

      <View style={styles.divider} />

      {/* Info row */}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Phone</Text>
        <Text style={styles.infoValue}>{formatPhone(device.phoneNumber)}</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        {/* ARM */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.armBtn, isArmed && styles.activeBtn]}
          onPress={onArm}
          disabled={commandLoading || isArmed}
          activeOpacity={0.8}
        >
          {commandLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.actionBtnText}>🛡 ARM</Text>
          )}
        </TouchableOpacity>

        {/* DISARM */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.disarmBtn, !isArmed && !isAlert && styles.activeDisarm]}
          onPress={onDisarm}
          disabled={commandLoading || (!isArmed && !isAlert)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>🔓 DISARM</Text>
        </TouchableOpacity>

        {/* PANIC */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.panicBtn]}
          onPress={onPanic}
          disabled={commandLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>🆘</Text>
        </TouchableOpacity>
      </View>

      {/* Delete */}
      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Text style={styles.deleteBtnText}>Remove Device</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  alertCard: {
    borderColor: COLORS.danger + '60',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  deviceName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  deviceId: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  location: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  armBtn: {
    backgroundColor: COLORS.success + '25',
    borderWidth: 1,
    borderColor: COLORS.success + '60',
  },
  activeBtn: {
    opacity: 1,
    backgroundColor: COLORS.success + '40',
  },
  disarmBtn: {
    backgroundColor: COLORS.textMuted + '20',
    borderWidth: 1,
    borderColor: COLORS.border,
    opacity: 0.5,
  },
  activeDisarm: {
    opacity: 1,
  },
  panicBtn: {
    backgroundColor: COLORS.danger + '25',
    borderWidth: 1,
    borderColor: COLORS.danger + '60',
    flex: 0,
    paddingHorizontal: SPACING.md,
    opacity: 1,
  },
  actionBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    marginTop: SPACING.sm,
    alignItems: 'center',
    paddingVertical: 6,
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
});

export default DeviceCard;
