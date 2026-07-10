import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { ContentTypeMeta } from '@/utils/contentDetector';
import { formatTimestamp, truncateText } from '@/utils/formatters';
import { getLanguage } from '@/i18n';
import type { ScanRecord } from '@/types';

interface Props {
  record: ScanRecord;
  onDelete: () => void;
}

export default function HistoryListItem({ record, onDelete }: Props) {
  const { colors } = useTheme();
  const router = useRouter();
  const meta = ContentTypeMeta[record.contentType];
  const lang = getLanguage();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push({ pathname: '/result', params: { id: record.id } })}
      activeOpacity={0.6}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: `${meta.color}18` },
        ]}
      >
        <Ionicons name={meta.icon as any} size={22} color={meta.color} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.data, { color: colors.text }]} numberOfLines={1}>
          {truncateText(record.data)}
        </Text>
        <Text style={[styles.time, { color: colors.textTertiary }]}>
          {formatTimestamp(record.scannedAt, lang === 'zh-TW' ? 'zh-TW' : 'en')}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  data: {
    fontSize: 15,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
  },
  deleteBtn: {
    padding: 4,
  },
});
