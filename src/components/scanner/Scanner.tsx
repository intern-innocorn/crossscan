import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  isActive: boolean;
  onScan: (result: BarcodeScanningResult) => void;
}

export default function Scanner({ isActive, onScan }: Props) {
  const { colors } = useTheme();

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (isActive) {
        onScan(result);
      }
    },
    [isActive, onScan]
  );

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={isActive ? handleBarcodeScanned : undefined}
      />
      {/* Dark overlay handled by ScannerOverlay component */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  camera: {
    flex: 1,
  },
});
