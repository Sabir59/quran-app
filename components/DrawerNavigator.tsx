import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { label: 'Home', icon: 'home-outline' as const, route: '/(main)/home' },
  { label: 'Quran', icon: 'book-outline' as const, route: '/(main)/quran' },
  { label: 'Bookmarks', icon: 'bookmark-outline' as const, route: '/(main)/bookmarks' },
  { label: 'Explore', icon: 'compass-outline' as const, route: '/(main)/explore' },
];

export function DrawerNavigatorContent(props: DrawerContentComponentProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#070B1E]">
      <View className="flex-row items-center gap-3 px-6 pt-6 pb-6 border-b border-[#1B2440]">
        <View className="w-10 h-10 rounded-full bg-[#A855F7] items-center justify-center">
          <MaterialCommunityIcons name="book-open-page-variant" size={20} color="white" />
        </View>
        <Text className="text-white text-xl font-bold">Quran App</Text>
      </View>

      <View className="flex-1 px-4 pt-4">
        {NAV_ITEMS.map((item) => (
          <Pressable
            key={item.route}
            onPress={() => {
              router.push(item.route as any);
              props.navigation.closeDrawer();
            }}
            className="flex-row items-center gap-4 px-4 py-4 rounded-2xl"
          >
            <Ionicons name={item.icon} size={22} color="#A855F7" />
            <Text className="text-white text-base font-medium">{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
