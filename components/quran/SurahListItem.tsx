import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';

type Props = {
  number: number;
  name: string;
  englishName: string;
  ayahs: number;
  onPress: () => void;
};

export function SurahListItem({ number, name, englishName, ayahs, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="rounded-lg border border-border bg-card p-4 active:opacity-70">
      <View className="flex-row justify-between items-center">
        <View className="flex-1 pr-3">
          <Text variant="large">{englishName}</Text>
          <Text variant="muted" className="mt-0.5">
            Surah {number} · {ayahs} ayahs
          </Text>
        </View>
        <Text className="text-xl">{name}</Text>
      </View>
    </Pressable>
  );
}

