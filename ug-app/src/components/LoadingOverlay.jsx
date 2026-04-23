import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';

/**
 * Full-screen loading overlay.
 * Props:
 *   message  {string}  Optional loading message
 */
const LoadingOverlay = ({ message }) => (
  <View style={styles.overlay}>
    <View style={styles.box}>
      <ActivityIndicator color={COLORS.primary} size="large" />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,14,26,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  box: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    minWidth: 120,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default LoadingOverlay;
