import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, ALERT_TYPES, formatZone } from '../utils/constants';
import { formatDateTime } from '../utils/formatters';
import Badge from './Badge';

/**
 * Alert list item.
 *
 * Props:
 *   alert    {object}    Alert object from API
 *   onPress  {function}
 */
const AlertItem = ({ alert, onPress }) => {
  const typeConfig = ALERT_TYPES[alert.type] || ALERT_TYPES.unknown;
  const zoneName = formatZone(alert.zone);
  const deviceName = alert.deviceId?.name || 'Unknown Device';

  return (
    <TouchableOpacity
      style={[styles.container, !alert.isRead && styles.unread]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Color accent bar */}
      <View style={[styles.accentBar, { backgroundColor: typeConfig.color }]} />

      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: `${typeConfig.color}20` }]}>
        <Text style={[styles.iconText, { color: typeConfig.color }]}>
          {getEmoji(alert.type)}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.typeLabel}>{typeConfig.label}</Text>
          <Text style={styles.time}>{formatDateTime(alert.createdAt)}</Text>
        </View>
        <Text style={styles.zone}>{zoneName}</Text>
        <Text style={styles.device}>{deviceName}</Text>
      </View>

      {/* Unread dot */}
      {!alert.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

const getEmoji = (type) => {
  const map = {
    intrusion: '🚨',
    panic: '🆘',
    tamper: '⚠️',
    low_battery: '🪫',
    arm: '🛡️',
    disarm: '🔓',
    unknown: '❓',
  };
  return map[type] || '❓';
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.md,
    marginVertical: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unread: {
    borderColor: COLORS.primary + '40',
    backgroundColor: COLORS.bgCardLight,
  },
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACING.sm,
  },
  iconText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeLabel: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },
  time: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
  },
  zone: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: 2,
  },
  device: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    marginTop: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
  },
});

export default AlertItem;
