import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/lib/useColorScheme';
import { useNavigation } from '@react-navigation/native';

const BarberHomeScreen = () => {
  const { user } = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Welcome Section */}
        <View className="bg-purple-600 p-8 rounded-lg mb-6">
          <Text className="text-3xl font-bold text-white mb-4 text-center">
            Welcome, {user?.first_name}!
          </Text>
          <Text className="text-white/90 text-lg text-center">
            You are logged in as a Barber
          </Text>
        </View>

        {/* User Info Card */}
        <View className="bg-card p-6 rounded-lg border border-border mb-6">
          <Text className="text-xl font-semibold text-foreground mb-4 text-center">
            Role: {user?.primary_role}
          </Text>
          <Text className="text-muted-foreground text-center mb-6">
            Email: {user?.email}
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="space-y-4">
          <View className="bg-purple-500 p-4 rounded-lg">
            <Text className="text-white text-center font-medium text-lg">
              Use the drawer menu to access features
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BarberHomeScreen;
