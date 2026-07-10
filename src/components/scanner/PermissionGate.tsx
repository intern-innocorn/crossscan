import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { type PermissionResponse } from 'expo-camera';
import { useTheme } from '@/theme/ThemeProvider';
import { useI18n } from '@/i18n';
import type { ScannerState } from '@/types';

interface Props {
  state: ScannerState;
  permission: PermissionResponse | null;
  requestPermission: () => Promise<boolean>;
}

export default function PermissionGate({ state, permission, requestPermission }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();

  if (state === 'loading') {
    // If permission is loaded and can still ask, show grant button instead of spinner
    if (permission && permission.canAskAgain) {
      return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View
            style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}
          >
            <Ionicons name="qr-code-outline" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {t.scan.permissionTitle}
          </Text>
          <Text style={[styles.desc, { color: colors.textSecondary }]}>
            {t.scan.permissionDesc}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>{t.scan.grantButton}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t.scan.hint}
        </Text>
      </View>
    );
  }

  if (state === 'denied' || state === 'error') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.primaryLight },
          ]}
        >
          <Ionicons name="camera-outline" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          {t.scan.deniedTitle}
        </Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          {t.scan.deniedDesc}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => Linking.openSettings()}
          activeOpacity={0.8}
        >
          <Ionicons name="settings-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>{t.scan.openSettings}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Should not reach here, but show loading as fallback
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
        {t.scan.hint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 32,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
