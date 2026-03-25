import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import AuthScreen from '@/screens/AuthScreen';
import CustomerStackNavigator from '@/features/customer/CustomerStackNavigator';
import ShopDrawer from '@/features/shop/ShopDrawer';
import BarberDrawer from '@/features/barber/BarberDrawer';
import AdminDrawer from '@/features/admin/AdminDrawer';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { useColorScheme } from '@/lib/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Text } from '@/components/ui/text';
import { USER_ROLES } from '@/lib/constants';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Get dynamic title based on user role
const getHomeScreenTitle = (userRole?: string) => {
  switch (userRole) {
    case USER_ROLES.CUSTOMER:
      return 'Customer Dashboard';
    case USER_ROLES.SHOP:
      return 'Shop Dashboard';
    case USER_ROLES.BARBER:
      return 'Barber Dashboard';
    case USER_ROLES.ADMIN:
      return 'Admin Dashboard';
    default:
      return 'Dashboard';
  }
};

// Loading Screen Component
const LoadingScreen = () => {
  const { isDarkColorScheme } = useColorScheme();
  
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator 
        size="large" 
        color={isDarkColorScheme ? '#ffffff' : '#000000'} 
      />
      <Text className="mt-4 text-foreground">Loading...</Text>
    </View>
  );
};

// Role-based Home Screen Component
const HomeScreen = () => {
  const { user } = useAuth();
  
  // Return different drawer navigators based on user role
  switch (user?.primary_role) {
    case USER_ROLES.CUSTOMER:
      return <CustomerStackNavigator />;
    case USER_ROLES.SHOP:
      return <ShopDrawer />;
    case USER_ROLES.BARBER:
      return <BarberDrawer />;
    case USER_ROLES.ADMIN:
      return <AdminDrawer />;
    default:
      // Fallback for unknown roles
      return <CustomerStackNavigator />;
  }
};

// Dynamic Header Title Component
const DynamicHeaderTitle = () => {
  const { user } = useAuth();
  return getHomeScreenTitle(user?.primary_role);
};

export default function AppNavigator() {
  const { isDarkColorScheme } = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? "Home" : "Auth"}
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: isDarkColorScheme ? '#09090B' : '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: isDarkColorScheme ? '#ffffff' : '#000000',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: isDarkColorScheme ? '#ffffff' : '#000000',
            },
            headerBackTitleStyle: {
              marginLeft: -8,
            },
            headerTitleContainerStyle: {
              paddingHorizontal: 16,
            },
            headerRightContainerStyle: {
              paddingRight: 16,
            },
            headerLeftContainerStyle: {
              paddingLeft: 16,
            },
            gestureEnabled: true,
          }}
        >
          {!isAuthenticated ? (
            // Auth Stack - Only shown when user is NOT authenticated
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{
                title: '',
                headerBackTitle: 'Back',
                headerRight: () => <ThemeSwitcher />,
                // Prevent going back to auth screen if user is authenticated
                headerLeft: () => null,
              }}
            />
          ) : (
            // Protected Stack - Only shown when user IS authenticated
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerShown: false, // Hide header since drawer navigators handle their own
                }}
              />
              {/* Add more protected screens here */}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
