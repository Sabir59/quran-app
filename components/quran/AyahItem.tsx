import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Audio } from 'expo-av';

type Props = {
  numberInSurah: number;
  arabic: string;
  translation?: string;
  audioUrl?: string;
  fontScale: number;
  showTranslation: boolean;
  onLongPressBookmark: () => void;
};

export function AyahItem({
  numberInSurah,
  arabic,
  translation,
  audioUrl,
  fontScale,
  showTranslation,
  onLongPressBookmark,
}: Props) {
  async function play() {
    if (!audioUrl) return;
    try {
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri: audioUrl }, { shouldPlay: true });
    } catch {}
  }

  return (
    <Pressable onPress={play} onLongPress={onLongPressBookmark} className="rounded-lg border border-border bg-card p-4">
      <View className="gap-2">
        <View className="flex-row items-baseline justify-between">
          <Text className="text-muted-foreground">Ayah {numberInSurah}</Text>
        </View>
        <Text className="text-right" style={{ fontSize: 22 * fontScale }}>
          {arabic}
        </Text>
        {showTranslation && translation ? (
          <Text variant="muted" style={{ fontSize: 14 * fontScale }}>
            {translation}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

