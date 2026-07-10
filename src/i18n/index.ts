import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/types';
import type { Language } from '@/types';
import en from './en';
import zhTW from './zh-TW';

const translations = { en, 'zh-TW': zhTW } as const;

let currentLang: Language = 'en';

export function t(): typeof en {
  return translations[currentLang];
}

export function getLanguage(): Language {
  return currentLang;
}

export async function initLanguage(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCE);
    if (stored === 'en' || stored === 'zh-TW') {
      currentLang = stored;
    }
  } catch {
    // keep default 'en'
  }
}

export async function setLanguage(lang: Language): Promise<void> {
  currentLang = lang;
  await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, lang);
}

export function useI18n() {
  return { t: t(), lang: currentLang, setLanguage };
}
