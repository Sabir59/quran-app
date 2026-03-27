import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

import { SectionCard } from '@/components/profile/SectionCard';
import { SettingRow } from '@/components/profile/SettingRow';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/context/BookmarksContext';
import { useProgress } from '@/context/ProgressContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { RECITERS, getReciterById } from '@/constants/reciters';
import { TRANSLATIONS, getTranslationById } from '@/constants/translations';
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
    <View className="flex-row rounded-[10px] overflow-hidden border border-border">
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable style={styles.modalOverlay} onPress={onDismiss} />
      <View className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pt-3 px-5 max-h-[75%]">
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
                {selected && <Ionicons name="checkmark-circle" size={22} color={TEAL} />}
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Translation Picker Modal ─────────────────────────────────────────────────

function TranslationModal({
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable style={styles.modalOverlay} onPress={onDismiss} />
      <View className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pt-3 px-5 max-h-[75%]">
        <View className="self-center w-10 h-1 rounded-full bg-muted mb-4" />
        <Text className="text-[17px] font-bold text-foreground mb-3">Translation Language</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {TRANSLATIONS.map((t, i) => {
            const selected = t.id === currentId;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => onSelect(t.id)}
                className={[
                  'flex-row items-center py-[14px] gap-3',
                  i < TRANSLATIONS.length - 1 ? 'border-b border-border' : '',
                ].join(' ')}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
              >
                <View className="flex-1 gap-[2px]">
                  <Text
                    className="text-[15px] font-semibold text-foreground"
                    style={selected ? { color: TEAL } : undefined}
                  >
                    {t.label}
                  </Text>
                  <Text className="text-[12px] text-muted-foreground">{t.translator}</Text>
                </View>
                {selected && <Ionicons name="checkmark-circle" size={22} color={TEAL} />}
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Edit Name Modal ──────────────────────────────────────────────────────────

function EditNameModal({
  visible,
  initialValue,
  onSave,
  onDismiss,
}: {
  visible: boolean;
  initialValue: string;
  onSave: (name: string) => Promise<void>;
  onDismiss: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  // Reset value when modal opens
  const handleOpen = () => setValue(initialValue);

  const handleSave = async () => {
    if (!value.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(value.trim());
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      onShow={handleOpen}
    >
      <Pressable style={styles.modalOverlay} onPress={onDismiss} />
      <View style={styles.nameModalCard} className="bg-card">
        <Text className="text-[17px] font-bold text-foreground mb-4">Edit Name</Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Your name"
          placeholderTextColor="#9CA3AF"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSave}
          editable={!isSaving}
          style={styles.nameInput}
          className="border border-border rounded-xl px-4 py-3 text-[15px] text-foreground"
        />
        <View className="flex-row gap-3 mt-4">
          <Pressable
            onPress={onDismiss}
            disabled={isSaving}
            className="flex-1 items-center py-3 rounded-xl border border-border bg-muted"
          >
            <Text className="text-[14px] font-semibold text-muted-foreground">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            className="flex-1 items-center py-3 rounded-xl"
            style={{ backgroundColor: TEAL, opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving
              ? <ActivityIndicator size="small" color="white" />
              : <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Save</Text>
            }
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({
  visible,
  userEmail,
  onDismiss,
}: {
  visible: boolean;
  userEmail: string;
  onDismiss: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setError(null);
    setIsLoading(false);
  };

  const handleDismiss = () => {
    reset();
    onDismiss();
  };

  const handleSave = async () => {
    setError(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from current password.');
      return;
    }
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user signed in.');
      const credential = EmailAuthProvider.credential(userEmail, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      reset();
      onDismiss();
      Alert.alert('Success', 'Your password has been updated.');
    } catch (err: any) {
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setError('Current password is incorrect.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to update password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDismiss}>
      <Pressable style={styles.modalOverlay} onPress={handleDismiss} />
      <View style={styles.nameModalCard} className="bg-card">
        <Text className="text-[17px] font-bold text-foreground mb-4">Change Password</Text>

        {/* Current password */}
        <View className="mb-3">
          <Text className="text-[12px] font-medium text-muted-foreground mb-1">Current Password</Text>
          <View className="flex-row items-center border border-border rounded-xl px-4">
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showCurrent}
              style={[styles.nameInput, { flex: 1, paddingVertical: 12 }]}
              className="text-foreground"
            />
            <Pressable onPress={() => setShowCurrent(v => !v)} hitSlop={8}>
              <Ionicons name={showCurrent ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        {/* New password */}
        <View className="mb-3">
          <Text className="text-[12px] font-medium text-muted-foreground mb-1">New Password</Text>
          <View className="flex-row items-center border border-border rounded-xl px-4">
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="At least 6 characters"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showNew}
              style={[styles.nameInput, { flex: 1, paddingVertical: 12 }]}
              className="text-foreground"
            />
            <Pressable onPress={() => setShowNew(v => !v)} hitSlop={8}>
              <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        {/* Confirm new password */}
        <View className="mb-1">
          <Text className="text-[12px] font-medium text-muted-foreground mb-1">Confirm New Password</Text>
          <View className="flex-row items-center border border-border rounded-xl px-4">
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showNew}
              returnKeyType="done"
              onSubmitEditing={handleSave}
              style={[styles.nameInput, { flex: 1, paddingVertical: 12 }]}
              className="text-foreground"
            />
          </View>
        </View>

        {error && (
          <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{error}</Text>
        )}

        <View className="flex-row gap-3 mt-4">
          <Pressable
            onPress={handleDismiss}
            className="flex-1 items-center py-3 rounded-xl border border-border bg-muted"
          >
            <Text className="text-[14px] font-semibold text-muted-foreground">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={isLoading}
            className="flex-1 items-center py-3 rounded-xl"
            style={{ backgroundColor: TEAL, opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading
              ? <ActivityIndicator size="small" color="white" />
              : <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Update</Text>
            }
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, isGuest, logout } = useAuth();
  const { bookmarks } = useBookmarks();
  const { streak, surahsVisited } = useProgress();
  const {
    name,
    photoURL,
    reciter,
    translationEdition,
    updateName,
    updatePhoto,
    setReciter,
    setTranslationEdition,
  } = useUserProfile();
  const { theme, setTheme } = useSettings();
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
  const [translationModalVisible, setTranslationModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const currentReciter = getReciterById(reciter);
  const currentTranslation = getTranslationById(translationEdition);

  // ── Avatar initials ───────────────────────────────────────────────────────
  const displayName = isGuest ? 'Guest User' : (name || user?.name || 'My Profile');
  const initials = isGuest
    ? '?'
    : displayName.split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('');

  // ── Photo picker ──────────────────────────────────────────────────────────
  const handleAvatarPress = () => {
    if (isGuest) return;
    Alert.alert('Profile Photo', 'Choose a source', [
      { text: 'Camera', onPress: () => pickImage('camera') },
      { text: 'Photo Library', onPress: () => pickImage('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const pickImage = async (source: 'camera' | 'library') => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1] as [number, number],
      quality: 0.8,
    };
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled && result.assets[0]) {
      setIsUploadingPhoto(true);
      try {
        await updatePhoto(result.assets[0].uri);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  // ── Sign out ──────────────────────────────────────────────────────────────
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
        {/* ── Header ── */}
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeTop}>
          <View style={styles.header}>
            {/* Avatar */}
            <Pressable onPress={handleAvatarPress} style={styles.avatarOuter} disabled={isUploadingPhoto}>
              {photoURL ? (
                <Image
                  source={{ uri: photoURL }}
                  style={[styles.avatarInner, { borderColor: avatarBorderColor }]}
                />
              ) : (
                <View style={[styles.avatarInner, { backgroundColor: avatarInnerBg, borderColor: avatarBorderColor }]}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
              )}
              {isUploadingPhoto && (
                <View style={styles.avatarUploadingOverlay}>
                  <ActivityIndicator size="small" color="white" />
                </View>
              )}
              {!isGuest && !isUploadingPhoto && (
                <View style={styles.avatarEditDot}>
                  <Ionicons name="camera" size={11} color="white" />
                </View>
              )}
            </Pressable>

            {/* Name — tap to edit */}
            {isGuest ? (
              <Text style={[styles.headerName, { color: headerNameColor }]}>Guest User</Text>
            ) : (
              <Pressable
                onPress={() => setNameModalVisible(true)}
                style={styles.nameRow}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={[styles.headerName, { color: headerNameColor }]}>{displayName}</Text>
                <Ionicons name="pencil-outline" size={15} color="rgba(255,255,255,0.7)" style={{ marginTop: 2 }} />
              </Pressable>
            )}

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
                <Text style={[styles.statNumber, { color: statNumberColor }]}>{streak}</Text>
                <Text style={[styles.statLabel, { color: statLabelColor }]}>Day Streak</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: statDividerColor }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: statNumberColor }]}>{surahsVisited.length}</Text>
                <Text style={[styles.statLabel, { color: statLabelColor }]}>Surahs Read</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>

        {/* ── Content sheet ── */}
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
              label="Translation"
              value={currentTranslation.label}
              onPress={() => setTranslationModalVisible(true)}
              isLast
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
                icon="lock-closed-outline"
                label="Change Password"
                onPress={() => setChangePasswordVisible(true)}
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

      <ReciterModal
        visible={reciterModalVisible}
        currentId={reciter}
        onSelect={id => {
          setReciter(id);
          setReciterModalVisible(false);
        }}
        onDismiss={() => setReciterModalVisible(false)}
      />

      <TranslationModal
        visible={translationModalVisible}
        currentId={translationEdition}
        onSelect={id => {
          setTranslationEdition(id);
          setTranslationModalVisible(false);
        }}
        onDismiss={() => setTranslationModalVisible(false)}
      />

      <EditNameModal
        visible={nameModalVisible}
        initialValue={name || user?.name || ''}
        onSave={async (newName) => {
          await updateName(newName);
          setNameModalVisible(false);
        }}
        onDismiss={() => setNameModalVisible(false)}
      />

      <ChangePasswordModal
        visible={changePasswordVisible}
        userEmail={user?.email ?? ''}
        onDismiss={() => setChangePasswordVisible(false)}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeTop: { backgroundColor: 'transparent' },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 6,
  },

  // Avatar
  avatarOuter: { marginBottom: 4 },
  avatarInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: 'white' },
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
  avatarUploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header text
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerName: { fontSize: 22, fontWeight: '700', letterSpacing: 0.2 },
  headerEmail: { fontSize: 13 },
  guestSignInBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  guestSignInText: { color: 'white', fontSize: 13, fontWeight: '600' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statNumber: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 11, fontWeight: '500' },
  statDivider: { width: 1, marginVertical: 4 },

  // Sheet
  sheetContent: { padding: 20, paddingTop: 24 },

  // Modals
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  nameModalCard: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '35%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  nameInput: { fontSize: 15 },
});
