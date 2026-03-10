import { AppContainer } from '@/components/app-container';
import { SurahListItem } from '@/components/quran/SurahListItem';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSurahList } from '@/hooks/api/quran';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function QuranScreen() {
  const { data, isLoading, error } = useSurahList();

  return (
    <AppContainer>
      <View className="flex-1 gap-4">
        <View className="flex-row justify-between items-center">
          <Text variant="h3">Quran</Text>
          <Button variant="outline" onPress={() => router.push('/(main)/surah?number=1&name=Al-Fatiha')}>
            <Text>Open Surah 1</Text>
          </Button>
        </View>
        {isLoading ? <Text>Loading...</Text> : null}
        {error ? <Text>Error loading surahs</Text> : null}
        <ScrollView className="flex-1" contentContainerStyle={{ gap: 8 }}>
          {data?.map((s) => (
            <SurahListItem
              key={s.number}
              number={s.number}
              name={s.name}
              englishName={s.englishName}
              ayahs={s.numberOfAyahs}
              onPress={() => router.push(`/(main)/surah?number=${s.number}&name=${encodeURIComponent(s.englishName)}`)}
            />
          ))}
        </ScrollView>
      </View>
    </AppContainer>
  );
}
