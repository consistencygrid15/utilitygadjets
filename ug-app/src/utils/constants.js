// Color palette — dark premium theme
export const COLORS = {
  // Backgrounds
  bg: '#0A0E1A',
  bgCard: '#111827',
  bgCardLight: '#1C2333',
  bgInput: '#161D2E',

  // Brand
  primary: '#4F6EF7',      // Electric blue
  primaryDark: '#3B52C4',
  primaryLight: '#7B94FF',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#475569',

  // Borders & dividers
  border: '#1E293B',
  divider: '#1E2D3D',

  // Device status
  armed: '#22C55E',
  disarmed: '#94A3B8',
  alertColor: '#EF4444',
  offline: '#475569',

  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#4F6EF7', '#7B52EB'],
  gradientDanger: ['#EF4444', '#B91C1C'],
  gradientSuccess: ['#22C55E', '#15803D'],
  gradientCard: ['#111827', '#1C2333'],
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Device commands
export const COMMANDS = {
  ARM: 'ARM',
  DISARM: 'DISARM',
  PANIC: 'PANIC',
};

// Alert type → label + color
export const ALERT_TYPES = {
  intrusion: { label: 'Intrusion', color: '#EF4444', icon: 'shield-alert' },
  panic: { label: 'Panic', color: '#F97316', icon: 'alert-octagon' },
  tamper: { label: 'Tamper', color: '#F59E0B', icon: 'tool' },
  low_battery: { label: 'Low Battery', color: '#EAB308', icon: 'battery-low' },
  arm: { label: 'Armed', color: '#22C55E', icon: 'shield-check' },
  disarm: { label: 'Disarmed', color: '#94A3B8', icon: 'shield-off' },
  unknown: { label: 'Unknown', color: '#64748B', icon: 'help-circle' },
};

// Zone names → human-readable
export const ZONE_LABELS = {
  MAIN_DOOR: 'Main Door',
  BACK_DOOR: 'Back Door',
  WINDOW_1: 'Window 1',
  WINDOW_2: 'Window 2',
  GARAGE: 'Garage',
  PANIC_BTN: 'Panic Button',
  BATTERY: 'Battery',
  COVER: 'Device Cover',
};

export const formatZone = (zone) =>
  ZONE_LABELS[zone] || zone.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
