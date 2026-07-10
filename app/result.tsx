import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useI18n } from '@/i18n';
import { useHistory } from '@/hooks/useHistory';
import { ContentTypeMeta } from '@/utils/contentDetector';
import { formatFullDate } from '@/utils/formatters';
import { getLanguage } from '@/i18n';
import ResultActions from '@/components/result/ResultActions';
import type { ScanRecord } from '@/types';

const typeLabels: Record<string, string> = {
  url: 'URL',
  email: 'Email',
  phone: 'Phone',
  wifi: 'Wi-Fi',
  text: 'Text',
};

export default function ResultScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecord, deleteRecord } = useHistory();
  const [record, setRecord] = useState<ScanRecord | undefined>();

  useEffect(() => {
    if (id) {
      setRecord(getRecord(id));
    }
  }, [id, getRecord]);

  const handleDelete = async () => {
    if (id) {
      await deleteRecord(id);
      router.back();
    }
  };

  if (!record) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="document-outline" size={48} color={colors.textTertiary} />
        <Text style={[styles.notFound, { color: colors.textSecondary }]}>
          Record not found
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.goBack, { color: colors.primary }]}>
            {t.common.back}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const meta = ContentTypeMeta[record.contentType];
  const lang = getLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: t.result.title }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type badge */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: `${meta.color}18` },
            ]}
          >
            <Ionicons name={meta.icon as any} size={36} color={meta.color} />
          </View>
          <Text style={[styles.typeLabel, { color: meta.color }]}>
            {typeLabels[record.contentType] || 'Text'}
          </Text>
        </View>

        {/* Content card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text
            style={[styles.contentText, { color: colors.text }]}
            selectable
          >
            {record.data}
          </Text>
        </View>

        {/* Timestamp */}
        <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
          {formatFullDate(record.scannedAt, lang === 'zh-TW' ? 'zh-TW' : 'en')}
        </Text>

        {/* Action buttons */}
        <View style={styles.actionsWrapper}>
          <ResultActions record={record} onDelete={handleDelete} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFound: {
    fontSize: 16,
  },
  goBack: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 40,
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 10,
  },
  typeBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'monospace',
  },
  timestamp: {
    fontSize: 13,
    marginBottom: 32,
  },
  actionsWrapper: {
    width: '100%',
  },
});
