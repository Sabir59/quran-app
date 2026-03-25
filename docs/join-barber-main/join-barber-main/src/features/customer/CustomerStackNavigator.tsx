import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerDrawer from './CustomerDrawer';
import ShopDetailsScreen from './screens/ShopDetailsScreen';
import QueueDisplayScreen from './screens/QueueDisplayScreen';
import { useColorScheme } from '@/lib/useColorScheme';

export type CustomerStackParamList = {
  CustomerDrawer: undefined;
  ShopDetails: {
    shopId: number;
  };
  QueueDisplay: {
    shopId: number;
  };
};

const Stack = createStackNavigator<CustomerStackParamList>();

const CustomerStackNavigator = () => {
  const { colorScheme } = useColorScheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide header for drawer screens
      }}
    >
      <Stack.Screen 
        name="CustomerDrawer" 
        component={CustomerDrawer}
      />
      <Stack.Screen 
        name="ShopDetails" 
        component={ShopDetailsScreen}
        options={{
          headerShown: false, // ShopDetailsScreen has its own header
        }}
      />
      <Stack.Screen 
        name="QueueDisplay" 
        component={QueueDisplayScreen}
        options={{
          headerShown: false, // QueueDisplayScreen has its own header
        }}
      />
    </Stack.Navigator>
  );
};

export default CustomerStackNavigator;
