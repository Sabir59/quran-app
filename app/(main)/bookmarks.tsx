import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { FlatList, Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(LinearGradient, { className: 'style' });

const COLLECTIONS = [
  { id: 'fav', title: 'My Favorite', count: 8 },
  { id: 'daily', title: 'Daily', count: 5 },
];

function Header() {
  const navigation = useNavigation();
  return (
    <View className="flex-row items-center px-6 pt-2 pb-4">
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="mr-3 p-1"
      >
        <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
      </Pressable>
      <Text className="text-white text-xl font-bold flex-1">Bookmarks</Text>
      <Pressable className="p-1" onPress={() => console.log('search')}>
        <Ionicons name="search-outline" size={22} color="#8B93A7" />
      </Pressable>
    </View>
  );
}

function AddCollectionRow() {
  return (
    <View className="flex-row items-center px-6 py-3 mb-1">
      <Pressable
        onPress={() => console.log('add collection')}
        className="flex-row items-center flex-1 gap-3"
      >
        <MaterialCommunityIcons name="plus-box-outline" size={26} color="#A855F7" />
        <Text className="text-white text-base font-medium">Add new collection</Text>
      </Pressable>
      <Pressable onPress={() => console.log('filter')} className="p-1">
        <MaterialCommunityIcons name="filter-variant" size={22} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

function CollectionRow({ item }: { item: (typeof COLLECTIONS)[0] }) {
  return (
    <Pressable
      onPress={() => console.log('open', item.id)}
      className="flex-row items-center px-6 py-4 gap-4"
    >
      <Ionicons name="folder-outline" size={28} color="#A855F7" />
      <View className="flex-1">
        <Text className="text-white text-base font-semibold mb-0.5">{item.title}</Text>
        <Text className="text-[#8B93A7] text-sm">{item.count} items</Text>
      </View>
      <Pressable onPress={() => console.log('menu', item.id)} className="p-2">
        <Ionicons name="ellipsis-vertical" size={20} color="#FFFFFF" />
      </Pressable>
    </Pressable>
  );
}

function BottomNav() {
  return (
    <View className="flex-row items-center justify-around border-t border-[#1B2440] pt-3 pb-2 px-4">
      <Pressable className="items-center" onPress={() => router.push('/(main)/home')}>
        <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#8B93A7" />
      </Pressable>
      <Pressable className="items-center" onPress={() => router.push('/(main)/quran')}>
        <Ionicons name="bulb-outline" size={24} color="#8B93A7" />
      </Pressable>
      <Pressable className="items-center">
        <Ionicons name="person-outline" size={24} color="#8B93A7" />
      </Pressable>
      <Pressable className="items-center">
        <MaterialCommunityIcons name="hands-pray" size={24} color="#8B93A7" />
      </Pressable>
      <Pressable className="items-center" onPress={() => router.push('/(main)/bookmarks')}>
        <Ionicons name="bookmark" size={24} color="#A855F7" />
      </Pressable>
    </View>
  );
}

export default function BookmarksScreen() {
  return (
    <LinearGradient colors={['#070B1E', '#0B1430']} className="flex-1">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        <Header />
        <AddCollectionRow />
        <FlatList
          data={COLLECTIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CollectionRow item={item} />}
          showsVerticalScrollIndicator={false}
          className="flex-1"
          ListFooterComponent={<View className="h-8" />}
        />
        <BottomNav />
      </SafeAreaView>
    </LinearGradient>
  );
}
