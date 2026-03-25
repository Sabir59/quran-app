import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '@/components/shared/CustomDrawer';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Home, Calendar, Scissors, Settings, User } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import AdminHomeScreen from './AdminHomeScreen';

// Placeholder screens for customer features
const AppointmentsScreen = () => (
  <View className="flex-1 justify-center items-center bg-background">
    <Text className="text-foreground text-xl">My Appointments</Text>
    <Text className="text-muted-foreground mt-2">Coming Soon...</Text>
  </View>
);

const FindBarbersScreen = () => (
  <View className="flex-1 justify-center items-center bg-background">
    <Text className="text-foreground text-xl">Find Barbers</Text>
    <Text className="text-muted-foreground mt-2">Coming Soon...</Text>
  </View>
);

const SettingsScreen = () => (
  <View className="flex-1 justify-center items-center bg-background">
    <Text className="text-foreground text-xl">Settings</Text>
    <Text className="text-muted-foreground mt-2">Coming Soon...</Text>
  </View>
);

const Drawer = createDrawerNavigator();

const AdminDrawer = () => {
  const { colorScheme } = useColorScheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} role="Customer" />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white', // blue-600
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
        name="Home" 
        component={AdminHomeScreen}
        options={{
          title: 'Customer Dashboard',
          drawerIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{
          title: 'My Appointments',
          drawerIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="FindBarbers" 
        component={FindBarbersScreen}
        options={{
          title: 'Find Barbers',
          drawerIcon: ({ color, size }) => (
            <Scissors size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AdminDrawer;
