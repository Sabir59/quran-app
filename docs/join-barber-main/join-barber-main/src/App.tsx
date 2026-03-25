import './styles/global.css';

import React from 'react';
import { View, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { useColorScheme } from 'nativewind';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from '@/contexts/AuthContext';
import { PortalHost } from '@rn-primitives/portal';

export default function App() {
  const { colorScheme } = useColorScheme();

  return (
    <AuthProvider>
      <View className="flex-1 bg-background">
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colorScheme === 'dark' ? '#000000' : '#ffffff'}
        />
        <AppNavigator />

        {/* 👇 Give it a name */}
        <PortalHost name="root" />
      </View>
    </AuthProvider>
  );
}

