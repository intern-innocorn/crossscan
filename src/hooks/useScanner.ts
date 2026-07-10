import { useState, useCallback, useRef } from 'react';
import { useCameraPermissions } from 'expo-camera';
import type { ScannerState } from '@/types';

export interface UseScannerReturn {
  state: ScannerState;
  permission: ReturnType<typeof useCameraPermissions>[0];
  requestPermission: () => Promise<boolean>;
  isProcessing: React.MutableRefObject<boolean>;
  resetScanner: () => void;
  setState: (s: ScannerState) => void;
}

export function useScanner(): UseScannerReturn {
  const [permission, request] = useCameraPermissions();
  const [state, setState] = useState<ScannerState>('loading');
  const isProcessing = useRef(false);

  // Determine state from permission status
  const effectiveState: ScannerState = (() => {
    if (state === 'scanning' || state === 'error') return state;
    if (!permission) return 'loading';
    if (permission.granted) return 'ready';
    if (permission.canAskAgain) return 'loading'; // not asked yet — will show grant button
    return 'denied'; // permanently denied
  })();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const result = await request();
    if (result.granted) {
      setState('ready');
      return true;
    }
    setState('denied');
    return false;
  }, [request]);

  const resetScanner = useCallback(() => {
    isProcessing.current = false;
    setState('ready');
  }, []);

  return {
    state: effectiveState,
    permission,
    requestPermission,
    isProcessing,
    resetScanner,
    setState,
  };
}
