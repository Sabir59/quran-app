import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#080B18]">
      <View className="flex-1 items-center px-[30px] pt-5 pb-5">
        <Text className="text-white text-[30px] font-bold text-center mb-2.5">
          Quran App
        </Text>
        <Text className="text-[#9BA3B8] text-[15px] text-center leading-[23px] mb-5">
          {'Learn Quran and\nRecite once everyday'}
        </Text>

        <View className="flex-1 w-full mb-6">
          <Image
            source={require('@/assets/images/Quran-get-started.svg')}
            contentFit="cover"
            className="w-full h-full rounded-[30px]"
          />
        </View>

        <Pressable
          className="bg-[#F0A070] w-full h-14 rounded-[32px] items-center justify-center active:bg-[#DC8F60]"
          onPress={() => router.replace('/(main)/home')}
        >
          <Text className="text-[#1C0E05] text-[17px] font-bold">Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
