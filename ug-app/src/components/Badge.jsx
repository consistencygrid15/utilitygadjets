import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../utils/constants';

/**
 * Status Badge component.
 *
 * Props:
 *   status   {'armed'|'disarmed'|'alert'|'offline'|'read'|'unread'}
 *   label    {string}  Override default label
 *   size     {'sm'|'md'}
 */
const Badge = ({ status, label, size = 'md' }) => {
  const getConfig = () => {
    switch (status) {
      case 'armed':
        return { color: COLORS.armed, bg: 'rgba(34,197,94,0.15)', text: label || 'Armed' };
      case 'disarmed':
        return { color: COLORS.textMuted, bg: 'rgba(71,85,105,0.3)', text: label || 'Disarmed' };
      case 'alert':
        return { color: COLORS.danger, bg: 'rgba(239,68,68,0.15)', text: label || 'Alert' };
      case 'offline':
        return { color: COLORS.offline, bg: 'rgba(71,85,105,0.2)', text: label || 'Offline' };
      case 'unread':
        return { color: COLORS.primary, bg: 'rgba(79,110,247,0.2)', text: label || 'New' };
      default:
        return { color: COLORS.textSecondary, bg: COLORS.bgCardLight, text: label || status };
    }
  };

  const { color, bg, text } = getConfig();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'sm' && styles.sm]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }, size === 'sm' && styles.textSm]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textSm: {
    fontSize: 10,
  },
});

export default Badge;
