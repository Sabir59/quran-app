import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Store, Scissors, Shield } from 'lucide-react-native';
import { Button } from '../ui/button';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { useColorScheme } from '@/lib/useColorScheme';

interface CustomDrawerProps {
  state: any;
  navigation: any;
  descriptors: any;
  role?: 'Customer' | 'Shop' | 'Barber' | 'Admin';
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ 
  state, 
  navigation, 
  descriptors, 
  role = 'Customer' 
}) => {
  const { user, logout } = useAuth();
  const { colorScheme } = useColorScheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'Customer':
        return <User size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />;
      case 'Shop':
        return <Store size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />;
      case 'Barber':
        return <Scissors size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />;
      case 'Admin':
        return <Shield size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />;
      default:
        return <User size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'Customer':
        return colorScheme === 'dark' ? 'white' : 'black';
      case 'Shop':
        return colorScheme === 'dark' ? 'white' : 'black';
      case 'Barber':
        return colorScheme === 'dark' ? 'white' : 'black';
      case 'Admin':
        return colorScheme === 'dark' ? 'white' : 'black';
      default:
        return colorScheme === 'dark' ? 'white' : 'black';
    }
  };

  return (
    <DrawerContentScrollView 
      className="flex-1 bg-background"
      style={{
        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {/* User Profile Section */}
      <View className={`${getRoleColor()}  mb-4`}>
        <View className="flex-row justify-end">
        <ThemeSwitcher/>
        </View>
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 rounded-none items-center justify-center mr-4">
            {getRoleIcon()}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold">
              {user?.first_name} {user?.last_name}
            </Text>
            <Text className="text-sm">
              {role}
            </Text>
          </View>
        </View>
        <Text className="text-sm">
          {user?.email}
        </Text>
      </View>

      {/* Navigation Items */}
      <View className="flex-1">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              className={`flex-row items-center px-4 py-3 mb-1 ${
                isFocused 
                  ? 'bg-primary/10 border-l-4 border-primary' 
                  : 'hover:bg-muted/50'
              }`}
              style={{
                borderRadius: 8,
                // height:48,
                paddingHorizontal:16,
                paddingVertical:12
              }}
            >
              {options.drawerIcon && (
                <View className="mr-3">
                  {options.drawerIcon({ 
                    color: isFocused && colorScheme === 'dark' ? '#ffffff' : isFocused && colorScheme === 'light' ? '#000000' : '#666', 
                    size: 20 
                  })}
                </View>
              )}
              <Text 
                className={`text-base font-medium ${
                  isFocused ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout Section */}
      <Button onPress={handleLogout} className='flex-row'>
        <LogOut size={20} color={colorScheme === 'dark' ? 'black' : 'white'}/>
        <Text className="font-medium ml-3">Logout</Text>
      </Button>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
