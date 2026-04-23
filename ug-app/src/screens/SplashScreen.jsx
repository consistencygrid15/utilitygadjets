import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSession } from '../redux/slices/authSlice';
import { COLORS, FONTS } from '../utils/constants';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const { sessionLoading } = useSelector((state) => state.auth);

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Restore auth session after animation starts
    const timer = setTimeout(() => {
      dispatch(restoreSession());
    }, 800);

    return () => clearTimeout(timer);
  }, [dispatch, logoScale, logoOpacity, subtitleOpacity]);

  return (
    <LinearGradient colors={['#050914', '#0A0E1A', '#0D1526']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animated.View
        style={[styles.logoWrap, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}
      >
        {/* Shield logo */}
        <View style={styles.shieldOuter}>
          <View style={styles.shieldInner}>
            <Text style={styles.shieldIcon}>🛡</Text>
          </View>
        </View>

        <Text style={styles.appName}>UG</Text>
        <Text style={styles.tagline}>UtilityGadgets</Text>
      </Animated.View>

      <Animated.View style={[styles.subtitleWrap, { opacity: subtitleOpacity }]}>
        <Text style={styles.subtitle}>Smart Security System</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {sessionLoading ? 'Securing your home...' : 'Ready'}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
  },
  shieldOuter: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(79,110,247,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(79,110,247,0.3)',
  },
  shieldInner: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: 'rgba(79,110,247,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: {
    fontSize: 36,
  },
  appName: {
    color: '#fff',
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 8,
  },
  tagline: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  subtitleWrap: {
    marginTop: 16,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.sm,
    letterSpacing: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    letterSpacing: 1,
  },
});

export default SplashScreen;
