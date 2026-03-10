import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { DrawerNavigatorContent } from '@/components/DrawerNavigator';
import { Drawer } from 'expo-router/drawer';

export default function MainLayout() {
  return (
    <>
      <AnimatedSplashOverlay />
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <DrawerNavigatorContent {...props} />}
      />
    </>
  );
}
