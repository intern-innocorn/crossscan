import { useState, useEffect, useCallback } from 'react';
import { loadHistory, saveHistory, clearHistory as clearStorage } from '@/storage/asyncStorage';
import { detectContentType } from '@/utils/contentDetector';
import type { ScanRecord } from '@/types';

export interface UseHistoryReturn {
  records: ScanRecord[];
  isLoading: boolean;
  addRecord: (data: string, type?: string) => Promise<ScanRecord>;
  deleteRecord: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  getRecord: (id: string) => ScanRecord | undefined;
}

export function useHistory(): UseHistoryReturn {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory().then((data) => {
      setRecords(data);
      setIsLoading(false);
    });
  }, []);

  const addRecord = useCallback(
    async (data: string, type = 'org.iso.QRCode'): Promise<ScanRecord> => {
      const record: ScanRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        data,
        type,
        contentType: detectContentType(data),
        scannedAt: new Date().toISOString(),
      };
      const updated = [record, ...records];
      setRecords(updated);
      await saveHistory(updated);
      return record;
    },
    [records]
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      await saveHistory(updated);
    },
    [records]
  );

  const clearAll = useCallback(async () => {
    setRecords([]);
    await clearStorage();
  }, []);

  const getRecord = useCallback(
    (id: string) => records.find((r) => r.id === id),
    [records]
  );

  return { records, isLoading, addRecord, deleteRecord, clearAll, getRecord };
}
