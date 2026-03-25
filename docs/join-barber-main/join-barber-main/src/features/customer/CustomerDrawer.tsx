import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '@/components/shared/CustomDrawer';
import CustomerBottomTabs from './CustomerBottomTabs';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Home, Calendar, Scissors, Settings, User, Menu, Grid, MapPin, Clock, Users, Crown, BookOpen } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import {
  DashboardScreen,
  FindShopsScreen,
  MyQueueScreen,
  MyFamilyScreen,
  MySubscriptionsScreen,
  BookingHistoryScreen,
  ProfileScreen,
} from './screens';

const Drawer = createDrawerNavigator();

const CustomerDrawer = () => {
  const { colorScheme } = useColorScheme();
  const [useBottomTabs, setUseBottomTabs] = useState(false);

  // If using bottom tabs, render the bottom tab navigator
  if (useBottomTabs) {
    return (
      <View className="flex-1">
        {/* Header with toggle button */}
        <View 
          className="flex-row items-center justify-between px-4 py-3 border-b border-border"
          style={{
            backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
          }}
        >
          <Text className="text-lg font-bold">Customer Dashboard</Text>
          <TouchableOpacity
            onPress={() => setUseBottomTabs(false)}
            className="p-2 rounded-lg bg-muted"
          >
            <Menu size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>
        
        {/* Bottom Tab Navigator */}
        <CustomerBottomTabs />
      </View>
    );
  }

  // Otherwise, render the drawer navigator
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawer {...props} role="Customer" />
      )}
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
        headerRight: () => (
          <TouchableOpacity
            onPress={() => setUseBottomTabs(true)}
            className="mr-4 p-2 rounded-lg bg-muted"
          >
            <Grid size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
        ),
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
        name="FindShops" 
        component={FindShopsScreen}
        options={{
          title: 'Find Shops',
          drawerIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="MyQueue" 
        component={MyQueueScreen}
        options={{
          title: 'My Queue',
          drawerIcon: ({ color, size }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="MyFamily" 
        component={MyFamilyScreen}
        options={{
          title: 'My Family',
          drawerIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="MySubscriptions" 
        component={MySubscriptionsScreen}
        options={{
          title: 'My Subscriptions',
          drawerIcon: ({ color, size }) => (
            <Crown size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="BookingHistory" 
        component={BookingHistoryScreen}
        options={{
          title: 'Booking History',
          drawerIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
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

export default CustomerDrawer;
