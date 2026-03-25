import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Home, Calendar, Scissors, User } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import CustomerHomeScreen from './CustomerHomeScreen';

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

const ProfileScreen = () => (
  <View className="flex-1 justify-center items-center bg-background">
    <Text className="text-foreground text-xl">Profile</Text>
    <Text className="text-muted-foreground mt-2">Coming Soon...</Text>
  </View>
);

const CustomerBottomTabs = () => {
  const { colorScheme } = useColorScheme();
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    { id: 'Home', title: 'Home', icon: Home, component: CustomerHomeScreen },
    { id: 'Appointments', title: 'Appointments', icon: Calendar, component: AppointmentsScreen },
    { id: 'FindBarbers', title: 'Find Barbers', icon: Scissors, component: FindBarbersScreen },
    { id: 'Profile', title: 'Profile', icon: User, component: ProfileScreen },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CustomerHomeScreen;

  return (
    <View className="flex-1">
      {/* Main Content */}
      <View className="flex-1">
        <ActiveComponent />
      </View>

      {/* Bottom Tab Bar */}
      <View 
        className="flex-row border-t border-border"
        style={{
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
          borderTopColor: colorScheme === 'dark' ? '#333' : '#e5e5e5',
        }}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className="flex-1 items-center py-2"
            >
              <IconComponent 
                size={24} 
                color={isActive 
                  ? (colorScheme === 'dark' ? 'white' : 'black')
                  : (colorScheme === 'dark' ? '#666' : '#999')
                } 
              />
              <Text 
                className={`text-xs mt-1 ${
                  isActive 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomerBottomTabs;
