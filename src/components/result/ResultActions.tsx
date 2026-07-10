import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Share, Alert } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useI18n } from '@/i18n';
import { ContentTypeMeta } from '@/utils/contentDetector';
import type { ScanRecord } from '@/types';

interface Props {
  record: ScanRecord;
  onDelete: () => void;
}

export default function ResultActions({ record, onDelete }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const meta = ContentTypeMeta[record.contentType];

  const handleCopy = async () => {
    await Clipboard.setStringAsync(record.data);
    Alert.alert('', t.result.copied);
  };

  const handleOpen = async () => {
    if (record.contentType === 'url') {
      await WebBrowser.openBrowserAsync(record.data);
    } else if (record.contentType === 'email') {
      const addr = record.data.startsWith('mailto:')
        ? record.data
        : `mailto:${record.data}`;
      Linking.openURL(addr);
    } else if (record.contentType === 'phone') {
      const tel = record.data.startsWith('tel:')
        ? record.data
        : `tel:${record.data}`;
      Linking.openURL(tel);
    }
  };

  const handleShare = async () => {
    await Share.share({ message: record.data });
  };

  const actions: Array<{
    label: string;
    icon: string;
    onPress: () => void;
    visible: boolean;
  }> = [
    {
      label: t.result.copy,
      icon: 'copy-outline',
      onPress: handleCopy,
      visible: true,
    },
    {
      label: t.result.openInBrowser,
      icon: 'open-outline',
      onPress: handleOpen,
      visible: record.contentType === 'url' || record.contentType === 'email' || record.contentType === 'phone',
    },
    {
      label: t.result.share,
      icon: 'share-outline',
      onPress: handleShare,
      visible: true,
    },
    {
      label: t.common.delete,
      icon: 'trash-outline',
      onPress: () => {
        Alert.alert('', t.result.deleteConfirm, [
          { text: t.common.cancel, style: 'cancel' },
          { text: t.common.delete, style: 'destructive', onPress: onDelete },
        ]);
      },
      visible: true,
    },
  ];

  return (
    <View style={styles.container}>
      {actions
        .filter((a) => a.visible)
        .map((action) => (
          <TouchableOpacity
            key={action.label}
            style={[styles.button, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <Ionicons name={action.icon as any} size={22} color={colors.primary} />
            <Text style={[styles.label, { color: colors.text }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
