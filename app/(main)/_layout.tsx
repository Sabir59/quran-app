import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Badge } from '@/components/ui/badge';
import { useBookmarks } from '@/context/BookmarksContext';

const TEAL = '#12C4BE';
const INACTIVE = '#9CA3AF';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused }: { name: IoniconName; focused: boolean }) {
  return <Ionicons name={name} size={24} color={focused ? TEAL : INACTIVE} />;
}

function BookmarkTabIcon({ focused }: { focused: boolean }) {
  const { bookmarks } = useBookmarks();
  const hasBookmarks = bookmarks.length > 0;

  return (
    <View className="items-center justify-center">
      <Ionicons
        name={focused ? 'bookmark' : 'bookmark-outline'}
        size={24}
        color={focused ? TEAL : INACTIVE}
      />
      {hasBookmarks && (
        <Badge
          className="absolute -top-1 -right-2 h-2 w-2 p-0 border-0 bg-[#12C4BE]"
          variant="default"
        />
      )}
    </View>
  );
}

export default function MainLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  // Tab bar background and border must be computed imperatively —
  // tabBarStyle is a plain object, className does not apply to it.
  const tabBarBg = isDark ? '#0a0a0f' : 'white';          // matches --background
  const tabBarBorder = isDark ? '#252628' : '#F3F4F6';    // matches --border

  // Android gesture nav bar sits below the tab bar — add bottom inset so
  // the tab bar clears it completely.
  const androidBottom = insets.bottom + 10;

  return (
    <>
      <AnimatedSplashOverlay />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: TEAL,
          tabBarInactiveTintColor: INACTIVE,
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopWidth: 1,
            borderTopColor: tabBarBorder,
            height: Platform.OS === 'ios' ? 88 : 56 + insets.bottom,
            paddingBottom: Platform.OS === 'ios' ? 28 : androidBottom,
            paddingTop: 8,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: 'Bookmarks',
            tabBarIcon: ({ focused }) => <BookmarkTabIcon focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />
            ),
          }}
        />

        {/* Hidden from tab bar — accessible but not yet designed */}
        <Tabs.Screen name="explore" options={{ href: null }} />
        <Tabs.Screen name="quran" options={{ href: null }} />

        {/* Detail screen — hidden from tab bar, pushed on top */}
        <Tabs.Screen
          name="surah"
          options={{ href: null }}
        />
      </Tabs>
    </>
  );
}
