import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { useI18n } from '@/i18n';
import { useScanner } from '@/hooks/useScanner';
import { useHistory } from '@/hooks/useHistory';
import Scanner from '@/components/scanner/Scanner';
import ScannerOverlay from '@/components/scanner/ScannerOverlay';
import PermissionGate from '@/components/scanner/PermissionGate';
import type { BarcodeScanningResult } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scanner = useScanner();
  const history = useHistory();
  const [lastData, setLastData] = React.useState<string | null>(null);
  const [torchOn, setTorchOn] = React.useState(false);

  const handleScan = useCallback(
    async (result: BarcodeScanningResult) => {
      if (scanner.isProcessing.current) return;
      scanner.isProcessing.current = true;
      scanner.setState('scanning');

      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // haptics may fail in simulator
      }

      const data = result.data;
      if (!data || data.trim().length === 0) {
        setLastData(t.result.emptyData);
      } else {
        const record = await history.addRecord(data, result.type);
        setLastData(data);
        // Navigate to result after a brief pause
        setTimeout(() => {
          router.push({ pathname: '/result', params: { id: record.id } });
        }, 400);
      }
    },
    [scanner, history, router, t]
  );

  const isScannerActive = scanner.state === 'ready';

  // Permission states — show PermissionGate when not ready
  if (scanner.state !== 'ready' && scanner.state !== 'scanning') {
    return (
      <PermissionGate
        state={scanner.state}
        permission={scanner.permission}
        requestPermission={scanner.requestPermission}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Scanner isActive={isScannerActive} onScan={handleScan} />
      <ScannerOverlay />

      {/* Top bar */}
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top + 8, paddingHorizontal: 16 },
        ]}
      >
        <Text style={[styles.title, { color: '#FFFFFF' }]}>
          {t.scan.title}
        </Text>
        <TouchableOpacity
          style={[styles.torchBtn, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
          onPress={() => setTorchOn((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={torchOn ? 'flashlight' : 'flashlight-outline'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Mini result bar at bottom when scanning */}
      {scanner.state === 'scanning' && lastData && (
        <View
          style={[
            styles.miniResult,
            { bottom: insets.bottom + 100, backgroundColor: colors.surface },
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text
            style={[styles.miniResultText, { color: colors.text }]}
            numberOfLines={1}
          >
            {lastData.length > 30 ? lastData.slice(0, 30) + '…' : lastData}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  torchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniResult: {
    position: 'absolute',
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  miniResultText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
