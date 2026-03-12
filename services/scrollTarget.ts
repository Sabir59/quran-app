/**
 * Module-level shared state for "resume to this ayah" intent.
 *
 * Why not URL params? surah is a Tabs.Screen (href:null). Expo Router tab
 * navigation uses React Navigation's `navigate` semantics — if the route name
 * hasn't changed, param updates are silently dropped and useLocalSearchParams
 * keeps the old value. Storing the intent here guarantees delivery.
 */

export type ScrollTarget = {
  surahNumber: number;
  ayahNumber: number;
  positionMs: number; // 0 = reading only
  openPlayer: boolean; // true when user was listening → auto-open full player
};

let _target: ScrollTarget | null = null;

export const scrollTarget = {
  set(t: ScrollTarget) { _target = t; },
  get(): ScrollTarget | null { return _target; },
  clear() { _target = null; },
};
