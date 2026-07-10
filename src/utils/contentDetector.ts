import type { ContentType } from '@/types';

const DETECTORS: Array<{ test: (data: string) => boolean; type: ContentType }> = [
  { test: (d) => /^WIFI:/i.test(d), type: 'wifi' },
  {
    test: (d) =>
      /^mailto:/i.test(d) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.trim()),
    type: 'email',
  },
  { test: (d) => /^https?:\/\//i.test(d), type: 'url' },
  {
    test: (d) =>
      /^tel:/i.test(d) || /^\+?[\d\s\-().]{7,}$/.test(d.trim()),
    type: 'phone',
  },
];

export function detectContentType(data: string): ContentType {
  for (const detector of DETECTORS) {
    if (detector.test(data)) return detector.type;
  }
  return 'text';
}

export const ContentTypeMeta: Record<
  ContentType,
  { icon: string; color: string }
> = {
  url: { icon: 'globe-outline', color: '#007AFF' },
  email: { icon: 'mail-outline', color: '#FF9500' },
  phone: { icon: 'call-outline', color: '#34C759' },
  wifi: { icon: 'wifi-outline', color: '#007AFF' },
  text: { icon: 'document-text-outline', color: '#8E8E93' },
};
