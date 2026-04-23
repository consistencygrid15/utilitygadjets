import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/constants';

/**
 * EmptyState component — shown when a list has no items.
 * Props:
 *   emoji    {string}
 *   title    {string}
 *   subtitle {string}
 */
const EmptyState = ({ emoji = '📭', title, subtitle }) => (
  <View style={styles.container}>
    <Text style={styles.emoji}>{emoji}</Text>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  emoji: {
    fontSize: 52,
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;
