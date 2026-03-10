export const HOME_COLORS = {
  teal: '#12C4BE',
  purple: '#A855F7',
  selectedTabBg: '#EBE84A',
  selectedTabText: '#111827',
  cardSubtitle: '#12C4BE',
  surahBadge: '#A855F7',
  chipBg: '#F5F3FF',
  chipIcon: '#A855F7',
  chipText: '#6B7280',
} as const;

/** Social profile links — define here, not inline in JSX */
export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/persis-software-labs',
  facebook: 'https://www.facebook.com/persissoftwarelabs',
  instagram: 'https://www.instagram.com/persissoftwarelabs',
  x: 'https://x.com/persissoftware',
} as const;

/** Surah numbers shown as "Frequently Read" when user has no history yet */
export const DEFAULT_FREQUENT_SURAHS = [18, 2, 36, 67, 112];

/** Maps API `revelationType` value to display label */
export const REVELATION_DISPLAY: Record<string, string> = {
  Meccan: 'Makkiyah',
  Medinan: 'Madaniyah',
};
