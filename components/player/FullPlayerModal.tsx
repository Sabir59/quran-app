import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { HOME_COLORS } from '@/constants/home';
import { SPEED_OPTIONS, useAudioPlayer } from '@/context/AudioPlayerContext';
import type { PlaybackSpeed } from '@/context/AudioPlayerContext';

// ─── KaraokeText ─────────────────────────────────────────────────────────────

interface KaraokeTextProps {
  arabic: string;
  position: number;
  duration: number;
}

function KaraokeText({ arabic, position, duration }: KaraokeTextProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const words = useMemo(() => arabic.split(/\s+/).filter(Boolean), [arabic]);
  const progress = duration > 0 ? position / duration : 0;
  const activeIndex = Math.min(Math.floor(progress * words.length), words.length - 1);

  // Future word color adapts to background
  const dimColor = isDark ? '#4B5563' : '#D1D5DB';
  const pastColor = isDark ? '#6B7280' : '#9CA3AF';

  return (
    <Text style={styles.karaokeContainer} textBreakStrategy="simple">
      {words.map((word, idx) => {
        const isPast = idx < activeIndex;
        const isActive = idx === activeIndex;
        return (
          <Text
            key={idx}
            style={[
              { color: dimColor },
              isPast && { color: pastColor },
              isActive && { color: HOME_COLORS.teal, fontWeight: '700' },
            ]}
          >
            {word}
            {idx < words.length - 1 ? ' ' : ''}
          </Text>
        );
      })}
    </Text>
  );
}

// ─── FullPlayerModal ──────────────────────────────────────────────────────────

interface FullPlayerModalProps {
  visible: boolean;
  onDismiss: () => void;
  karaoke?: boolean;
}

export function FullPlayerModal({ visible, onDismiss, karaoke = false }: FullPlayerModalProps) {
  const {
    currentTrack, playlist, currentIndex, isPlaying, isLoading,
    position, duration, speed, playPause, next, previous,
    seekTo, seekRelative, stop, setSpeed,
  } = useAudioPlayer();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      bounciness: 2,
    }).start();
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [700, 0] });

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < playlist.length - 1;
  const progress = duration > 0 ? position / duration : 0;

  const handleProgressPress = useCallback(
    (e: any) => {
      if (barWidth <= 0 || duration <= 0) return;
      const pct = e.nativeEvent.locationX / barWidth;
      seekTo(Math.max(0, pct * duration));
    },
    [barWidth, duration, seekTo],
  );

  const fmt = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  // Computed theme values — Animated.View doesn't support className
  const sheetBg = isDark ? '#0a0a0f' : 'white';  // matches --card in global.css
  const handleColor = isDark ? '#374151' : '#D1D5DB';
  const iconColor = isDark ? '#9CA3AF' : '#6B7280';
  const controlIconColor = isDark ? '#E5E7EB' : '#374151';
  const disabledColor = isDark ? '#374151' : '#D1D5DB';
  const progressTrackBg = isDark ? '#252628' : '#E5E7EB';
  const speedBtnBg = isDark ? '#1F2937' : '#F9FAFB';
  const speedBtnBorder = isDark ? '#374151' : '#E5E7EB';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sheet — bg-card adapts to dark mode */}
      <Animated.View
        style={[
          styles.sheetLayout,
          { backgroundColor: sheetBg, paddingBottom: insets.bottom + 16 },
          { transform: [{ translateY }] },
        ]}
      >
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: handleColor }]} />

        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={onDismiss} hitSlop={8}>
            <Ionicons name="chevron-down" size={24} color={iconColor} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text className="text-[16px] font-bold text-foreground">{currentTrack.surahName}</Text>
            <Text style={[styles.headerAyah, { color: HOME_COLORS.teal }]}>
              Ayah {currentTrack.ayahNumber} / {playlist.length}
            </Text>
          </View>
          <Pressable
            onPress={async () => { await stop(); onDismiss(); }}
            hitSlop={8}
          >
            <Ionicons name="close-circle-outline" size={24} color={iconColor} />
          </Pressable>
        </View>

        {/* Arabic / Karaoke */}
        <ScrollView
          style={styles.arabicScroll}
          contentContainerStyle={styles.arabicContent}
          showsVerticalScrollIndicator={false}
        >
          {karaoke ? (
            <KaraokeText arabic={currentTrack.arabic} position={position} duration={duration} />
          ) : (
            <Text className="text-[26px] text-foreground text-center" style={styles.arabicLine}>
              {currentTrack.arabic}
            </Text>
          )}
        </ScrollView>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <Pressable
            onPress={handleProgressPress}
            onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
            style={[styles.progressTrack, { backgroundColor: progressTrackBg }]}
          >
            <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
            <View style={[styles.progressThumb, { left: `${Math.min(progress * 100, 100)}%` }]} />
          </Pressable>
          <View style={styles.timeRow}>
            <Text className="text-[11px] font-medium text-muted-foreground">{fmt(position)}</Text>
            <Text className="text-[11px] font-medium text-muted-foreground">{fmt(duration)}</Text>
          </View>
        </View>

        {/* Speed selector */}
        <View style={styles.speedRow}>
          {SPEED_OPTIONS.map(s => {
            const active = speed === s;
            return (
              <Pressable
                key={s}
                onPress={() => setSpeed(s)}
                style={[
                  styles.speedBtn,
                  {
                    borderColor: active ? HOME_COLORS.teal : speedBtnBorder,
                    backgroundColor: active ? '#E6F9F8' : speedBtnBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.speedText,
                    { color: active ? HOME_COLORS.teal : (isDark ? '#9CA3AF' : '#6B7280') },
                  ]}
                >
                  {s}x
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <Pressable
            onPress={previous}
            hitSlop={8}
            style={[styles.sideBtn, !hasPrevious && styles.disabledBtn]}
            disabled={!hasPrevious}
          >
            <Ionicons name="play-skip-back" size={26} color={hasPrevious ? controlIconColor : disabledColor} />
          </Pressable>

          <Pressable onPress={() => seekRelative(-10000)} hitSlop={8} style={styles.sideBtn}>
            <Ionicons name="play-back" size={24} color={controlIconColor} />
            <Text style={[styles.seekLabel, { color: controlIconColor }]}>10</Text>
          </Pressable>

          <Pressable onPress={playPause} style={styles.playBtn}>
            {isLoading ? (
              <Ionicons name="ellipsis-horizontal" size={28} color="white" />
            ) : (
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="white" />
            )}
          </Pressable>

          <Pressable onPress={() => seekRelative(10000)} hitSlop={8} style={styles.sideBtn}>
            <Ionicons name="play-forward" size={24} color={controlIconColor} />
            <Text style={[styles.seekLabel, { color: controlIconColor }]}>10</Text>
          </Pressable>

          <Pressable
            onPress={next}
            hitSlop={8}
            style={[styles.sideBtn, !hasNext && styles.disabledBtn]}
            disabled={!hasNext}
          >
            <Ionicons name="play-skip-forward" size={26} color={hasNext ? controlIconColor : disabledColor} />
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetLayout: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 24,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerCenter: { alignItems: 'center', flex: 1, gap: 2 },
  headerAyah: { fontSize: 12, fontWeight: '600' },
  arabicScroll: { maxHeight: 200 },
  arabicContent: { alignItems: 'center', paddingBottom: 8, gap: 10 },
  arabicLine: { lineHeight: 52, writingDirection: 'rtl' },
  karaokeContainer: {
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 56,
    writingDirection: 'rtl',
  },
  progressSection: { marginTop: 24, gap: 6 },
  progressTrack: { height: 5, borderRadius: 4, overflow: 'visible' },
  progressFill: { height: 5, backgroundColor: HOME_COLORS.teal, borderRadius: 4 },
  progressThumb: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: HOME_COLORS.teal,
    marginLeft: -7,
  },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  speedRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 20 },
  speedBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5 },
  speedText: { fontSize: 13, fontWeight: '600' },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  sideBtn: { alignItems: 'center', justifyContent: 'center', width: 44, height: 44 },
  seekLabel: { fontSize: 9, fontWeight: '700', position: 'absolute', bottom: 5 },
  disabledBtn: { opacity: 0.35 },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: HOME_COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: HOME_COLORS.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
