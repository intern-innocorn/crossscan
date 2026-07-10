import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useI18n } from '@/i18n';

const { width, height } = Dimensions.get('window');
const VIEWFINDER_SIZE = Math.min(width * 0.7, 280);
const CORNER_LENGTH = 24;
const CORNER_THICKNESS = 3;
const SCAN_LINE_HEIGHT = 2;

export default function ScannerOverlay() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const scanLineAnim = useRef(new Animated.Value(-VIEWFINDER_SIZE / 2)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: VIEWFINDER_SIZE / 2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: -VIEWFINDER_SIZE / 2,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [scanLineAnim]);

  const topHeight = (height - VIEWFINDER_SIZE) / 2;

  return (
    <>
      {/* Top overlay */}
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: colors.overlay,
            top: 0,
            height: topHeight,
          },
        ]}
      />
      {/* Middle row: left + viewfinder + right */}
      <View style={styles.middleRow}>
        <View
          style={[styles.sideOverlay, { backgroundColor: colors.overlay }]}
        />
        {/* Viewfinder area */}
        <View
          style={[
            styles.viewfinder,
            {
              width: VIEWFINDER_SIZE,
              height: VIEWFINDER_SIZE,
            },
          ]}
        >
          {/* Corner brackets */}
          <View
            style={[
              styles.corner,
              styles.cornerTL,
              { borderColor: colors.viewfinder },
            ]}
          />
          <View
            style={[
              styles.corner,
              styles.cornerTR,
              { borderColor: colors.viewfinder },
            ]}
          />
          <View
            style={[
              styles.corner,
              styles.cornerBL,
              { borderColor: colors.viewfinder },
            ]}
          />
          <View
            style={[
              styles.corner,
              styles.cornerBR,
              { borderColor: colors.viewfinder },
            ]}
          />
          {/* Scanning line */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                backgroundColor: colors.viewfinder,
                transform: [{ translateY: scanLineAnim }],
              },
            ]}
          />
        </View>
        <View
          style={[styles.sideOverlay, { backgroundColor: colors.overlay }]}
        />
      </View>
      {/* Bottom overlay */}
      <View
        style={[
          styles.overlay,
          styles.bottomOverlay,
          {
            backgroundColor: colors.overlay,
            height: topHeight,
          },
        ]}
      >
        <Text style={[styles.hintText, { color: '#FFFFFF' }]}>
          {t.scan.hint}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  sideOverlay: {
    flex: 1,
  },
  bottomOverlay: {
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  middleRow: {
    position: 'absolute',
    top: (height - VIEWFINDER_SIZE) / 2,
    left: 0,
    right: 0,
    height: VIEWFINDER_SIZE,
    flexDirection: 'row',
  },
  viewfinder: {
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderWidth: CORNER_THICKNESS,
    borderRadius: 4,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    width: '100%',
    height: SCAN_LINE_HEIGHT,
    position: 'absolute',
    top: '50%',
    left: 0,
  },
  hintText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
  },
});
