import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import type { AVPlaybackStatus } from 'expo-av';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PlayerTrack = {
  ayahNumber: number;
  surahNumber: number;
  surahName: string;
  arabic: string;
  transliteration?: string;
  translation?: string;
  audioUrl: string;
};

export const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5] as const;
export type PlaybackSpeed = (typeof SPEED_OPTIONS)[number];

interface AudioPlayerContextValue {
  // State
  playlist: PlayerTrack[];
  currentIndex: number;
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  position: number;   // ms
  duration: number;   // ms
  speed: PlaybackSpeed;
  playerModalVisible: boolean;
  // Actions
  loadAndPlay: (playlist: PlayerTrack[], startIndex?: number, seekToMs?: number, autoPlay?: boolean) => Promise<void>;
  playPause: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seekTo: (positionMs: number) => Promise<void>;
  seekRelative: (deltaMs: number) => Promise<void>;
  stop: () => Promise<void>;
  setSpeed: (speed: PlaybackSpeed) => Promise<void>;
  openPlayerModal: () => void;
  closePlayerModal: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<PlayerTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeedState] = useState<PlaybackSpeed>(1);
  const [playerModalVisible, setPlayerModalVisible] = useState(false);

  // Stable refs — avoid stale closures inside expo-av callbacks
  const soundRef = useRef<Audio.Sound | null>(null);
  const playlistRef = useRef<PlayerTrack[]>([]);
  const currentIndexRef = useRef(0);
  const speedRef = useRef<PlaybackSpeed>(1);

  // ── Setup audio mode once ────────────────────────────────────────────────
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    }).catch(console.error);

    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  // ── Core: play a specific index ──────────────────────────────────────────
  const playAtIndex = useCallback(async (index: number, seekToMs = 0, autoPlay = true) => {
    const track = playlistRef.current[index];
    if (!track?.audioUrl) return;

    // Unload previous
    if (soundRef.current) {
      try { await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }

    currentIndexRef.current = index;
    setCurrentIndex(index);
    setIsLoading(true);
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        {
          shouldPlay: autoPlay,
          rate: speedRef.current,
          shouldCorrectPitch: true,
          progressUpdateIntervalMillis: 250,
          positionMillis: seekToMs,
        },
        (status: AVPlaybackStatus) => {
          if (!status.isLoaded) return;
          setPosition(status.positionMillis);
          setDuration(status.durationMillis ?? 0);
          setIsPlaying(status.isPlaying);
          setIsLoading(status.isBuffering);

          // Auto-advance to next ayah
          if (status.didJustFinish) {
            const nextIdx = currentIndexRef.current + 1;
            if (nextIdx < playlistRef.current.length) {
              playAtIndex(nextIdx);
            } else {
              setIsPlaying(false);
              setPosition(0);
            }
          }
        },
      );
      soundRef.current = sound;
    } catch (e) {
      console.error('[AudioPlayer] Load failed:', e);
      setIsLoading(false);
    }
  }, []); // stable — uses only refs and stable setters

  // ── Public API ───────────────────────────────────────────────────────────

  const loadAndPlay = useCallback(async (newPlaylist: PlayerTrack[], startIndex = 0, seekToMs = 0, autoPlay = true) => {
    playlistRef.current = newPlaylist;
    setPlaylist(newPlaylist);
    await playAtIndex(startIndex, seekToMs, autoPlay);
  }, [playAtIndex]);

  const playPause = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;
      if (status.isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (e) {
      console.error('[AudioPlayer] playPause error:', e);
    }
  }, []);

  const next = useCallback(async () => {
    const nextIdx = currentIndexRef.current + 1;
    if (nextIdx < playlistRef.current.length) {
      await playAtIndex(nextIdx);
    }
  }, [playAtIndex]);

  const previous = useCallback(async () => {
    // If more than 3s in, restart current; otherwise go to previous
    if (position > 3000) {
      await seekTo(0);
    } else {
      const prevIdx = currentIndexRef.current - 1;
      if (prevIdx >= 0) await playAtIndex(prevIdx);
    }
  }, [playAtIndex, position]);

  const seekTo = useCallback(async (positionMs: number) => {
    try {
      await soundRef.current?.setPositionAsync(positionMs);
    } catch (e) {
      console.error('[AudioPlayer] seekTo error:', e);
    }
  }, []);

  const seekRelative = useCallback(async (deltaMs: number) => {
    const newPos = Math.max(0, Math.min(position + deltaMs, duration));
    await seekTo(newPos);
  }, [position, duration, seekTo]);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      try { await soundRef.current.unloadAsync(); } catch {}
      soundRef.current = null;
    }
    playlistRef.current = [];
    currentIndexRef.current = 0;
    setPlaylist([]);
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsLoading(false);
    setPosition(0);
    setDuration(0);
  }, []);

  const openPlayerModal = useCallback(() => setPlayerModalVisible(true), []);
  const closePlayerModal = useCallback(() => setPlayerModalVisible(false), []);

  const setSpeed = useCallback(async (newSpeed: PlaybackSpeed) => {
    speedRef.current = newSpeed;
    setSpeedState(newSpeed);
    try {
      await soundRef.current?.setRateAsync(newSpeed, true);
    } catch (e) {
      console.error('[AudioPlayer] setSpeed error:', e);
    }
  }, []);

  const currentTrack = playlist[currentIndex] ?? null;

  return (
    <AudioPlayerContext.Provider
      value={{
        playlist,
        currentIndex,
        currentTrack,
        isPlaying,
        isLoading,
        position,
        duration,
        speed,
        playerModalVisible,
        loadAndPlay,
        playPause,
        next,
        previous,
        seekTo,
        seekRelative,
        stop,
        setSpeed,
        openPlayerModal,
        closePlayerModal,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used inside AudioPlayerProvider');
  return ctx;
}
