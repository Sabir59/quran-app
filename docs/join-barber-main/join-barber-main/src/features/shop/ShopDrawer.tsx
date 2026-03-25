import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '@/components/shared/CustomDrawer';
import DashboardScreen from './screens/DashboardScreen';
import CreateShopScreen from './screens/CreateShopScreen';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Home, CreditCard, Store, Users, User, LogOut } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

const ShopBillingScreen = () => (
  <View className="flex-1 justify-center items-center bg-background">
    <Text className="text-foreground text-xl">Shop Billing</Text>
    <Text className="text-muted-foreground mt-2">Coming Soon...</Text>
  </View>
);

const MyShopsScreen = () => (
  <View className="flex-1 justify-center items-center bg-background">
    <Text className="text-foreground text-xl">My Shops</Text>
    <Text className="text-muted-foreground mt-2">Coming Soon...</Text>
  </View>
);

const BarberManagementScreen = () => (
  <View className="flex-1 justify-center items-center bg-background">
    <Text className="text-foreground text-xl">Barber Management</Text>
    <Text className="text-muted-foreground mt-2">Coming Soon...</Text>
  </View>
);

const ProfileScreen = () => (
  <View className="flex-1 justify-center items-center bg-background">
    <Text className="text-foreground text-xl">Profile</Text>
    <Text className="text-muted-foreground mt-2">Coming Soon...</Text>
  </View>
);

const Drawer = createDrawerNavigator();

const ShopDrawer = () => {
  const { colorScheme } = useColorScheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} role="Shop" />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        },
        headerTintColor: colorScheme === 'dark' ? 'white' : 'black',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: colorScheme === 'dark' ? 'white' : 'black',
        drawerInactiveTintColor: colorScheme === 'dark' ? 'white' : 'black',
        drawerStyle: {
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="ShopBilling" 
        component={ShopBillingScreen}
        options={{
          title: 'Shop Billing',
          drawerIcon: ({ color, size }) => (
            <CreditCard size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="MyShops" 
        component={MyShopsScreen}
        options={{
          title: 'My Shops',
          drawerIcon: ({ color, size }) => (
            <Store size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="CreateShop" 
        component={CreateShopScreen}
        options={{
          title: 'Create Shop',
          drawerIcon: ({ color, size }) => (
            <Store size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="BarberManagement" 
        component={BarberManagementScreen}
        options={{
          title: 'Barber Management',
          drawerIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default ShopDrawer;
