import type { ThemeColors } from '@/types';

export const LightColors: ThemeColors = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F9F9FB',
  text: '#1C1C1E',
  textSecondary: '#636366',
  textTertiary: '#AEAEB2',
  primary: '#007AFF',
  primaryLight: '#E8F2FF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  border: '#E5E5EA',
  viewfinder: '#007AFF',
  overlay: 'rgba(0, 0, 0, 0.45)',
};

export const DarkColors: ThemeColors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#AEAEB2',
  textTertiary: '#636366',
  primary: '#0A84FF',
  primaryLight: '#1A3A5C',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  border: '#38383A',
  viewfinder: '#0A84FF',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FontSize = {
  caption: 12,
  body: 14,
  bodyLarge: 16,
  title: 20,
  heading: 28,
  hero: 36,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
