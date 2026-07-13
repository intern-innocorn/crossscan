import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useI18n, getLanguage } from '@/i18n';
import { useHistory } from '@/hooks/useHistory';
import HistoryListItem from '@/components/history/HistoryListItem';
import EmptyState from '@/components/history/EmptyState';
import AdBanner from '@/components/ads/BannerAd';
import type { ScanRecord } from '@/types';

interface Section {
  title: string;
  data: ScanRecord[];
}

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const router = useRouter();
  const { records, isLoading, deleteRecord, clearAll } = useHistory();
  const lang = getLanguage();

  const sections = useMemo<Section[]>(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 86400000);
    const weekStart = new Date(todayStart.getTime() - 7 * 86400000);

    const today: ScanRecord[] = [];
    const yesterday: ScanRecord[] = [];
    const thisWeek: ScanRecord[] = [];
    const older: ScanRecord[] = [];

    for (const record of records) {
      const d = new Date(record.scannedAt);
      if (d >= todayStart) {
        today.push(record);
      } else if (d >= yesterdayStart) {
        yesterday.push(record);
      } else if (d >= weekStart) {
        thisWeek.push(record);
      } else {
        older.push(record);
      }
    }

    const sections: Section[] = [];
    const isZh = lang === 'zh-TW';
    if (today.length) sections.push({ title: isZh ? '今天' : 'Today', data: today });
    if (yesterday.length) sections.push({ title: isZh ? '昨天' : 'Yesterday', data: yesterday });
    if (thisWeek.length) sections.push({ title: isZh ? '本週' : 'This Week', data: thisWeek });
    if (older.length) sections.push({ title: isZh ? '更早' : 'Older', data: older });
    return sections;
  }, [records, lang]);

  const handleClearAll = useCallback(() => {
    Alert.alert(t.history.clearConfirm, t.history.clearDesc, [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.common.clear,
        style: 'destructive',
        onPress: clearAll,
      },
    ]);
  }, [clearAll, t]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('', t.result.deleteConfirm, [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: () => deleteRecord(id),
        },
      ]);
    },
    [deleteRecord, t]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Ad banner below navigator header, above content */}
      <AdBanner backgroundColor={colors.background} />

      {records.length > 0 && (
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleClearAll} activeOpacity={0.6}>
            <Text style={[styles.clearBtn, { color: colors.error }]}>
              {t.history.clearAll}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {records.length === 0 ? (
        <EmptyState />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryListItem
              record={item}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          renderSectionHeader={({ section }) => (
            <View
              style={[
                styles.sectionHeader,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                {section.title}
              </Text>
            </View>
          )}
          stickySectionHeadersEnabled
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.15)',
  },
  clearBtn: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128,128,128,0.1)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
