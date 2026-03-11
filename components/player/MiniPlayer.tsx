import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { HOME_COLORS } from '@/constants/home';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { FullPlayerModal } from './FullPlayerModal';

export function MiniPlayer() {
  const { currentTrack, isPlaying, isLoading, playlist, currentIndex, playPause, next, stop } =
    useAudioPlayer();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [fullPlayerVisible, setFullPlayerVisible] = useState(false);

  if (!currentTrack) return null;

  const hasNext = currentIndex < playlist.length - 1;
  const progressTrackBg = isDark ? '#252628' : '#E5E7EB';

  return (
    <>
      <Pressable
        onPress={() => setFullPlayerVisible(true)}
        style={[styles.container, { bottom: insets.bottom + 8 }]}
        className="bg-card"
      >
        {/* Progress line */}
        <ProgressLine trackBg={progressTrackBg} />

        <View style={styles.row}>
          {/* Ayah badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{currentTrack.ayahNumber}</Text>
          </View>

          {/* Track info */}
          <View style={styles.info}>
            <Text className="text-[12px] font-bold text-foreground" numberOfLines={1}>
              {currentTrack.surahName}
            </Text>
            <Text className="text-[13px] text-muted-foreground" numberOfLines={1}>
              {currentTrack.arabic}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <Pressable onPress={playPause} style={styles.playBtn} hitSlop={8}>
              {isLoading ? (
                <Ionicons name="ellipsis-horizontal" size={20} color="white" />
              ) : (
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="white" />
              )}
            </Pressable>

            <Pressable
              onPress={next}
              style={[styles.iconBtn, !hasNext && styles.disabled]}
              hitSlop={8}
              disabled={!hasNext}
            >
              <Ionicons
                name="play-skip-forward"
                size={18}
                color={hasNext ? HOME_COLORS.teal : (isDark ? '#4B5563' : '#D1D5DB')}
              />
            </Pressable>

            <Pressable onPress={stop} style={styles.iconBtn} hitSlop={8}>
              <Ionicons name="close" size={18} color={isDark ? '#6B7280' : '#9CA3AF'} />
            </Pressable>
          </View>
        </View>
      </Pressable>

      <FullPlayerModal
        visible={fullPlayerVisible}
        onDismiss={() => setFullPlayerVisible(false)}
        karaoke={true}
      />
    </>
  );
}

function ProgressLine({ trackBg }: { trackBg: string }) {
  const { position, duration } = useAudioPlayer();
  const pct = duration > 0 ? position / duration : 0;
  return (
    <View style={[styles.progressTrack, { backgroundColor: trackBg }]}>
      <View style={[styles.progressFill, { width: `${Math.min(pct * 100, 100)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  progressTrack: { height: 3, width: '100%' },
  progressFill: { height: 3, backgroundColor: HOME_COLORS.teal },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: HOME_COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeText: { color: 'white', fontSize: 13, fontWeight: '700' },
  info: { flex: 1, gap: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  playBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: HOME_COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: { padding: 6 },
  disabled: { opacity: 0.4 },
});
