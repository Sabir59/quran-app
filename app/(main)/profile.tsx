import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { SectionCard } from '@/components/profile/SectionCard';
import { SettingRow } from '@/components/profile/SettingRow';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/context/BookmarksContext';
import { RECITERS, getReciterById } from '@/constants/reciters';
import { useSettings } from '@/lib/settings';

const TEAL = '#12C4BE';
const TEAL_LIGHT = '#ECFAF9';

type ThemePref = 'light' | 'dark';

// ─── Theme Segment ────────────────────────────────────────────────────────────

const THEME_OPTIONS: {
  label: string;
  value: ThemePref;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  { label: 'Light', value: 'light', icon: 'sunny-outline' },
  { label: 'Dark', value: 'dark', icon: 'moon-outline' },
];

function ThemeSelector({
  value,
  onChange,
}: {
  value: ThemePref;
  onChange: (t: ThemePref) => void;
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className="flex-row rounded-[10px] overflow-hidden border border-border"
    >
      {THEME_OPTIONS.map((opt, i) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={[
              'flex-row items-center gap-1 px-[10px] py-[7px]',
              i < THEME_OPTIONS.length - 1 ? 'border-r border-border' : '',
              active ? '' : 'bg-card',
            ]
              .filter(Boolean)
              .join(' ')}
            style={active ? { backgroundColor: TEAL_LIGHT } : undefined}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <Ionicons
              name={opt.icon}
              size={15}
              color={active ? TEAL : (isDark ? '#6B7280' : '#9CA3AF')}
            />
            <Text
              className={active ? 'text-[12px] font-semibold' : 'text-[12px] font-medium text-muted-foreground'}
              style={active ? { color: TEAL } : undefined}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Reciter Picker Modal ─────────────────────────────────────────────────────

function ReciterModal({
  visible,
  currentId,
  onSelect,
  onDismiss,
}: {
  visible: boolean;
  currentId: string;
  onSelect: (id: string) => void;
  onDismiss: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.modalOverlay} onPress={onDismiss} />

      <View className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pt-3 px-5 max-h-[75%]">
        {/* Handle */}
        <View className="self-center w-10 h-1 rounded-full bg-muted mb-4" />
        <Text className="text-[17px] font-bold text-foreground mb-3">Select Reciter</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {RECITERS.map((r, i) => {
            const selected = r.id === currentId;
            return (
              <TouchableOpacity
                key={r.id}
                onPress={() => onSelect(r.id)}
                className={[
                  'flex-row items-center py-[14px] gap-3',
                  i < RECITERS.length - 1 ? 'border-b border-border' : '',
                ].join(' ')}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View className="flex-1 gap-[2px]">
                  <Text
                    className="text-[15px] font-semibold text-foreground"
                    style={selected ? { color: TEAL } : undefined}
                  >
                    {r.name}
                  </Text>
                  <Text className="text-[14px] text-foreground text-right" style={{ writingDirection: 'rtl' }}>
                    {r.arabicName}
                  </Text>
                  <Text className="text-[11px] text-muted-foreground font-medium">{r.style}</Text>
                </View>
                {selected && (
                  <Ionicons name="checkmark-circle" size={22} color={TEAL} />
                )}
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, isGuest, logout } = useAuth();
  const { bookmarks } = useBookmarks();
  const {
    reciter,
    setReciter,
    translationEnabled,
    setTranslationEnabled,
    theme,
    setTheme,
  } = useSettings();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const headerBg = isDark ? '#0a0a0f' : TEAL;
  const headerNameColor = isDark ? '#F9FAFB' : 'white';
  const headerEmailColor = isDark ? '#9CA3AF' : 'rgba(255,255,255,0.75)';
  const statsRowBg = isDark ? '#1F2937' : 'rgba(255,255,255,0.15)';
  const statNumberColor = isDark ? '#F9FAFB' : 'white';
  const statLabelColor = isDark ? '#6B7280' : 'rgba(255,255,255,0.7)';
  const statDividerColor = isDark ? '#374151' : 'rgba(255,255,255,0.25)';
  const avatarInnerBg = isDark ? '#1F2937' : 'rgba(255,255,255,0.25)';
  const avatarBorderColor = isDark ? '#374151' : 'rgba(255,255,255,0.6)';

  const [reciterModalVisible, setReciterModalVisible] = useState(false);
  const currentReciter = getReciterById(reciter);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.root, { backgroundColor: headerBg }]}>
        {/* ── Header — teal in light mode, dark in dark mode ── */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeTop}>
          <View style={styles.header}>
            <View style={styles.avatarOuter}>
              <View style={[styles.avatarInner, { backgroundColor: avatarInnerBg, borderColor: avatarBorderColor }]}>
                <Text style={styles.avatarText}>
                  {isGuest ? '?' : (user?.name ?? 'U').split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')}
                </Text>
              </View>
              {!isGuest && (
                <View style={styles.avatarEditDot}>
                  <Ionicons name="camera" size={11} color="white" />
                </View>
              )}
            </View>

            <Text style={[styles.headerName, { color: headerNameColor }]}>
              {isGuest ? 'Guest User' : (user?.name ?? 'My Profile')}
            </Text>

            {isGuest ? (
              <Pressable onPress={() => router.push('/(auth)/login')} style={styles.guestSignInBtn}>
                <Text style={styles.guestSignInText}>Sign in for full access</Text>
              </Pressable>
            ) : (
              <Text style={[styles.headerEmail, { color: headerEmailColor }]}>{user?.email}</Text>
            )}

            {/* Stats row */}
            <View style={[styles.statsRow, { backgroundColor: statsRowBg }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: statNumberColor }]}>{bookmarks.length}</Text>
                <Text style={[styles.statLabel, { color: statLabelColor }]}>Bookmarks</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: statDividerColor }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: statNumberColor }]}>—</Text>
                <Text style={[styles.statLabel, { color: statLabelColor }]}>Day Streak</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: statDividerColor }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: statNumberColor }]}>—</Text>
                <Text style={[styles.statLabel, { color: statLabelColor }]}>Surahs Read</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>

        {/* ── Content sheet — theme-aware ── */}
        <ScrollView
          className="flex-1 bg-muted rounded-t-[28px]"
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Recitation */}
          <SectionCard title="Recitation">
            <SettingRow
              icon="mic-outline"
              iconColor={TEAL}
              label="Reciter"
              value={currentReciter.name.split(' ').slice(0, 2).join(' ')}
              onPress={() => setReciterModalVisible(true)}
            />
            <SettingRow
              icon="language-outline"
              iconColor="#6366F1"
              label="Show Translation"
              isLast
              right={
                <Switch
                  value={translationEnabled}
                  onValueChange={setTranslationEnabled}
                  trackColor={{ false: '#E5E7EB', true: TEAL_LIGHT }}
                  thumbColor={translationEnabled ? TEAL : '#9CA3AF'}
                />
              }
            />
          </SectionCard>

          {/* Appearance */}
          <SectionCard title="Appearance">
            <SettingRow
              icon="contrast-outline"
              iconColor="#F59E0B"
              label="Theme"
              isLast
              right={<ThemeSelector value={theme} onChange={setTheme} />}
            />
          </SectionCard>

          {/* Account */}
          <SectionCard title="Account">
            {!isGuest && (
              <SettingRow
                icon="person-outline"
                label="Edit Profile"
                onPress={() => { /* Future */ }}
              />
            )}
            {!isGuest && (
              <SettingRow
                icon="lock-closed-outline"
                label="Change Password"
                onPress={() => { /* Future */ }}
              />
            )}
            {isGuest ? (
              <SettingRow
                icon="log-in-outline"
                iconColor={TEAL}
                label="Sign In"
                onPress={() => router.push('/(auth)/login')}
                isLast
              />
            ) : (
              <SettingRow
                icon="log-out-outline"
                label="Sign Out"
                destructive
                onPress={handleSignOut}
                isLast
              />
            )}
          </SectionCard>

          {/* About */}
          <SectionCard title="About">
            <SettingRow
              icon="information-circle-outline"
              label="App Version"
              value="1.0.0"
              isLast
            />
          </SectionCard>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      {/* Bottom safe area follows the sheet color */}
      <SafeAreaView edges={['bottom']} className="bg-muted" />

      <ReciterModal
        visible={reciterModalVisible}
        currentId={reciter}
        onSelect={id => {
          setReciter(id);
          setReciterModalVisible(false);
        }}
        onDismiss={() => setReciterModalVisible(false)}
      />
    </>
  );
}

// ─── Styles — layout only, no colors ─────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeTop: {
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 6,
  },

  // Avatar — on teal, always white
  avatarOuter: {
    marginBottom: 4,
  },
  avatarInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  avatarEditDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  // Header text
  headerName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerEmail: {
    fontSize: 13,
  },
  guestSignInBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  guestSignInText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },

  // Stats — on teal, always white
  statsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    marginVertical: 4,
  },

  // Sheet — layout only
  sheetContent: {
    padding: 20,
    paddingTop: 24,
  },

  // Modal overlay
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
