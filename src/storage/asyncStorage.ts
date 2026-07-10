import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ScanRecord } from '@/types';
import { STORAGE_KEYS } from '@/types';

const MAX_RECORDS = 500;

export async function loadHistory(): Promise<ScanRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ScanRecord[];
  } catch {
    return [];
  }
}

export async function saveHistory(records: ScanRecord[]): Promise<void> {
  // Cap at MAX_RECORDS to prevent storage bloat
  const capped = records.slice(0, MAX_RECORDS);
  await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(capped));
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.SCAN_HISTORY);
}
