import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useI18n } from '@/i18n';

export default function EmptyState() {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <View
        style={[styles.iconCircle, { backgroundColor: colors.surfaceSecondary }]}
      >
        <Ionicons name="scan-outline" size={48} color={colors.textTertiary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>
        {t.history.noRecords}
      </Text>
      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {t.history.noRecordsHint}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 64,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
