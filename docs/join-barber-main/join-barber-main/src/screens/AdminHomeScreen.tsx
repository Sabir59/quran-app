import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/lib/useColorScheme';

const AdminHomeScreen = () => {
  const { user, logout } = useAuth();
  const { isDarkColorScheme } = useColorScheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <View className="bg-red-600 p-8 rounded-lg mb-6 w-full max-w-sm">
        <Text className="text-3xl font-bold text-white mb-4 text-center">
          Welcome, {user?.first_name}!
        </Text>
        <Text className="text-white/90 text-lg text-center">
          You are logged in as an Administrator
        </Text>
      </View>

      <View className="bg-card p-6 rounded-lg border border-border w-full max-w-sm">
        <Text className="text-xl font-semibold text-foreground mb-4 text-center">
          Role: {user?.primary_role}
        </Text>
        <Text className="text-muted-foreground text-center mb-6">
          Email: {user?.email}
        </Text>
        
        <View className="bg-red-500 p-4 rounded-lg" onTouchEnd={handleLogout}>
          <Text className="text-white text-center font-medium text-lg">
            Logout
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AdminHomeScreen;
