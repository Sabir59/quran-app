import { cn } from '@/lib/utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

type AppContainerProps = {
  children: React.ReactNode;
  className?: string;
  safeAreaClassName?: string;
};

export function AppContainer({ children, className, safeAreaClassName }: AppContainerProps) {
  return (
    <SafeAreaView className={cn('flex-1 bg-background', safeAreaClassName)}>
      <View className={cn('flex-1 px-6 py-4', className)}>{children}</View>
    </SafeAreaView>
  );
}
