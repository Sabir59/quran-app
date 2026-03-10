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
import { HOME_COLORS } from '@/constants/home';
import { SPEED_OPTIONS, useAudioPlayer } from '@/context/AudioPlayerContext';
import type { PlaybackSpeed } from '@/context/AudioPlayerContext';

// ─── KaraokeText ─────────────────────────────────────────────────────────────
// Splits Arabic text into words and highlights the active word
// based on proportional position. NOT phonetically precise — uses
// equal-time interpolation across all words.

interface KaraokeTextProps {
  arabic: string;
  position: number;
  duration: number;
}

function KaraokeText({ arabic, position, duration }: KaraokeTextProps) {
  const words = useMemo(() => arabic.split(/\s+/).filter(Boolean), [arabic]);

  const progress = duration > 0 ? position / duration : 0;
  // Clamp to valid range; show last word until audio ends
  const activeIndex = Math.min(
    Math.floor(progress * words.length),
    words.length - 1,
  );

  return (
    // Outer Text handles RTL flow — all inline child Texts inherit it
    <Text style={karaokeStyles.container} textBreakStrategy="simple">
      {words.map((word, idx) => {
        const isPast = idx < activeIndex;
        const isActive = idx === activeIndex;
        return (
          <Text
            key={idx}
            style={[
              karaokeStyles.word,
              isPast && karaokeStyles.wordPast,
              isActive && karaokeStyles.wordActive,
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

const karaokeStyles = StyleSheet.create({
  container: {
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 56,
    writingDirection: 'rtl',
    color: '#D1D5DB', // future words — dimmed
  },
  word: {
    color: '#D1D5DB',
    fontWeight: '400',
  },
  wordPast: {
    color: '#9CA3AF',
  },
  wordActive: {
    color: HOME_COLORS.teal,
    fontWeight: '700',
  },
});

// ─── FullPlayerModal ──────────────────────────────────────────────────────────

interface FullPlayerModalProps {
  visible: boolean;
  onDismiss: () => void;
  karaoke?: boolean; // toggle word-by-word highlight; default false
}

export function FullPlayerModal({ visible, onDismiss, karaoke = false }: FullPlayerModalProps) {
  const {
    currentTrack,
    playlist,
    currentIndex,
    isPlaying,
    isLoading,
    position,
    duration,
    speed,
    playPause,
    next,
    previous,
    seekTo,
    seekRelative,
    stop,
    setSpeed,
  } = useAudioPlayer();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      bounciness: 2,
    }).start();
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [700, 0],
  });

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          { paddingBottom: insets.bottom + 16 },
          { transform: [{ translateY }] },
        ]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header row */}
        <View style={styles.headerRow}>
          <Pressable onPress={onDismiss} hitSlop={8}>
            <Ionicons name="chevron-down" size={24} color="#6B7280" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerSurah}>{currentTrack.surahName}</Text>
            <Text style={styles.headerAyah}>
              Ayah {currentTrack.ayahNumber} / {playlist.length}
            </Text>
          </View>
          <Pressable
            onPress={async () => {
              await stop();
              onDismiss();
            }}
            hitSlop={8}
          >
            <Ionicons name="close-circle-outline" size={24} color="#6B7280" />
          </Pressable>
        </View>

        {/* Arabic text — karaoke or plain */}
        <ScrollView
          style={styles.arabicScroll}
          contentContainerStyle={styles.arabicContent}
          showsVerticalScrollIndicator={false}
        >
          {karaoke ? (
            <KaraokeText
              arabic={currentTrack.arabic}
              position={position}
              duration={duration}
            />
          ) : (
            <Text style={styles.arabic}>{currentTrack.arabic}</Text>
          )}
        </ScrollView>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <Pressable
            onPress={handleProgressPress}
            onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
            style={styles.progressTrack}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress * 100, 100)}%` },
              ]}
            />
            <View
              style={[
                styles.progressThumb,
                { left: `${Math.min(progress * 100, 100)}%` },
              ]}
            />
          </Pressable>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{fmt(position)}</Text>
            <Text style={styles.timeText}>{fmt(duration)}</Text>
          </View>
        </View>

        {/* Speed selector */}
        <View style={styles.speedRow}>
          {SPEED_OPTIONS.map(s => (
            <Pressable
              key={s}
              onPress={() => setSpeed(s)}
              style={[styles.speedBtn, speed === s && styles.speedBtnActive]}
            >
              <Text style={[styles.speedText, speed === s && styles.speedTextActive]}>
                {s}x
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <Pressable
            onPress={previous}
            hitSlop={8}
            style={[styles.sideBtn, !hasPrevious && styles.disabledBtn]}
            disabled={!hasPrevious}
          >
            <Ionicons name="play-skip-back" size={26} color={hasPrevious ? '#374151' : '#D1D5DB'} />
          </Pressable>

          <Pressable onPress={() => seekRelative(-10000)} hitSlop={8} style={styles.sideBtn}>
            <Ionicons name="play-back" size={24} color="#374151" />
            <Text style={styles.seekLabel}>10</Text>
          </Pressable>

          <Pressable onPress={playPause} style={styles.playBtn}>
            {isLoading ? (
              <Ionicons name="ellipsis-horizontal" size={28} color="white" />
            ) : (
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="white" />
            )}
          </Pressable>

          <Pressable onPress={() => seekRelative(10000)} hitSlop={8} style={styles.sideBtn}>
            <Ionicons name="play-forward" size={24} color="#374151" />
            <Text style={styles.seekLabel}>10</Text>
          </Pressable>

          <Pressable
            onPress={next}
            hitSlop={8}
            style={[styles.sideBtn, !hasNext && styles.disabledBtn]}
            disabled={!hasNext}
          >
            <Ionicons name="play-skip-forward" size={26} color={hasNext ? '#374151' : '#D1D5DB'} />
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
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
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
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  headerSurah: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerAyah: {
    fontSize: 12,
    color: HOME_COLORS.teal,
    fontWeight: '600',
  },
  arabicScroll: {
    maxHeight: 200,
  },
  arabicContent: {
    alignItems: 'center',
    paddingBottom: 8,
    gap: 10,
  },
  arabic: {
    fontSize: 26,
    color: '#111827',
    textAlign: 'center',
    lineHeight: 52,
    writingDirection: 'rtl',
  },
  transliteration: {
    fontSize: 13,
    color: HOME_COLORS.teal,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressSection: {
    marginTop: 24,
    gap: 6,
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'visible',
  },
  progressFill: {
    height: 5,
    backgroundColor: HOME_COLORS.teal,
    borderRadius: 4,
  },
  progressThumb: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: HOME_COLORS.teal,
    marginLeft: -7,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  speedBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  speedBtnActive: {
    borderColor: HOME_COLORS.teal,
    backgroundColor: '#E6F9F8',
  },
  speedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  speedTextActive: {
    color: HOME_COLORS.teal,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  sideBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  seekLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#374151',
    position: 'absolute',
    bottom: 5,
  },
  disabledBtn: {
    opacity: 0.35,
  },
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
