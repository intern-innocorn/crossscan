/** The content type classification of a scanned barcode */
export type ContentType = 'url' | 'email' | 'phone' | 'wifi' | 'text';

/** A single scan record stored in AsyncStorage */
export interface ScanRecord {
  id: string;
  data: string;
  type: string;
  contentType: ContentType;
  scannedAt: string; // ISO 8601
}

export type ScannerState =
  | 'loading'
  | 'denied'
  | 'ready'
  | 'scanning'
  | 'error';

export type ThemeMode = 'system' | 'light' | 'dark';

export type Language = 'en' | 'zh-TW';

export const STORAGE_KEYS = {
  SCAN_HISTORY: '@crossscan/scan-history',
  THEME_PREFERENCE: '@crossscan/theme-preference',
  LANGUAGE_PREFERENCE: '@crossscan/language-preference',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  viewfinder: string;
  overlay: string;
}
