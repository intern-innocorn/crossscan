/**
 * Format an ISO 8601 timestamp for display.
 */
export function formatTimestamp(iso: string, lang: 'en' | 'zh-TW'): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return lang === 'zh-TW' ? '剛剛' : 'Just now';
  if (diffMins < 60) {
    return lang === 'zh-TW'
      ? `${diffMins} 分鐘前`
      : `${diffMins} min ago`;
  }
  if (diffHours < 24) {
    return lang === 'zh-TW'
      ? `${diffHours} 小時前`
      : `${diffHours}h ago`;
  }

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  if (y === now.getFullYear()) {
    return lang === 'zh-TW'
      ? `${m}/${d} ${h}:${min}`
      : `${m}/${d} ${h}:${min}`;
  }
  return lang === 'zh-TW'
    ? `${y}/${m}/${d} ${h}:${min}`
    : `${y}/${m}/${d} ${h}:${min}`;
}

/**
 * Format full date/time for the result detail screen.
 */
export function formatFullDate(iso: string, lang: 'en' | 'zh-TW'): string {
  const date = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString(
    lang === 'zh-TW' ? 'zh-TW' : 'en-US',
    opts
  );
}

/**
 * Truncate text for display in list items.
 */
export function truncateText(text: string, maxLen: number = 40): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen) + '…';
}
