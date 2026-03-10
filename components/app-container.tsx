import { cn } from '@/lib/utils';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppContainerProps = {
  children: React.ReactNode;
  className?: string;
  safeAreaClassName?: string;
};

export function AppContainer({ children, className, safeAreaClassName }: AppContainerProps) {
  return (
    <SafeAreaView className={cn('flex-1 bg-background', safeAreaClassName)}>
      <View className={cn('flex-1 px-[30px] py-[20px]', className)}>{children}</View>
    </SafeAreaView>
  );
}
