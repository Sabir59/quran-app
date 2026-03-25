import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { 
  Building, 
  Circle, 
  Users, 
  Clock, 
  DollarSign, 
  Plus,
  Scissors
} from 'lucide-react-native';
import { shopDashboardAPI, ShopDashboardMetrics } from '@/api/shop-dashboard';
import { DropdownMenuPreview } from '../Dropdown';

const DashboardScreen = () => {
  const { user } = useAuth();
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();

  // Dashboard metrics state
  const [metrics, setMetrics] = useState<ShopDashboardMetrics>({
    total_shops: 0,
    open_shops: 0,
    closed_shops: 0,
    total_barbers: 0,
    people_waiting: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch dashboard metrics on component mount
  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await shopDashboardAPI.getDashboardMetrics();
      setMetrics(response.data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard metrics:', error);
      // Don't show alert for initial load, just log the error
    } finally {
      setIsLoading(false);
    }
  };

  // Key metrics data
  const keyMetrics = [
    {
      label: 'Total Shops',
      value: metrics.total_shops,
      icon: Building,
      color: colorScheme === 'dark' ? '#3B82F6' : '#2563EB',
    },
    {
      label: 'Open Shops',
      value: metrics.open_shops,
      icon: Circle,
      color: '#10B981',
    },
    {
      label: 'Closed Shops',
      value: metrics.closed_shops,
      icon: Circle,
      color: '#EF4444',
    },
    {
      label: 'Total Barbers',
      value: metrics.total_barbers,
      icon: Users,
      color: colorScheme === 'dark' ? '#8B5CF6' : '#7C3AED',
    },
    {
      label: 'People Waiting',
      value: metrics.people_waiting,
      icon: Clock,
      color: colorScheme === 'dark' ? '#F59E0B' : '#D97706',
    },
  ];

  // Quick actions data
  const quickActions = [
    {
      title: 'Manage Shops',
      description: 'View and edit your shops',
      icon: Building,
      onPress: () => navigation.navigate('MyShops' as never),
    },
    {
      title: 'Create Shop',
      description: 'Get started',
      icon: Users,
      onPress: () => navigation.navigate('CreateShop' as never),
    },
    {
      title: 'Create Shop',
      description: 'Get started',
      icon: DollarSign,
      onPress: () => navigation.navigate('CreateShop' as never),
    },
    {
      title: 'Create Shop',
      description: 'Add new location',
      icon: Plus,
      onPress: () => navigation.navigate('CreateShop' as never),
    },
    {
      title: 'Manage Barbers',
      description: 'Invite & manage staff',
      icon: Users,
      onPress: () => navigation.navigate('BarberManagement' as never),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        <DropdownMenuPreview/>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">Shop Owner Dashboard</Text>
          <Text className="text-muted-foreground mt-1">
            Welcome back, {user?.first_name} {user?.last_name}
          </Text>
        </View>

        {/* Key Metrics Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Key Metrics</Text>
          
                     <ScrollView 
             horizontal 
             showsHorizontalScrollIndicator={false}
             contentContainerStyle={{ paddingHorizontal: 0 }}
           >
             <View className="flex-row gap-3 px-6">
              {keyMetrics.map((metric, index) => (
                <Card key={index} className="w-32 p-4">
                  <View className="items-center gap-2">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center" 
                      style={{ backgroundColor: metric.color + '20' }}
                    >
                      <metric.icon size={20} color={metric.color} />
                    </View>
                    <Text className="text-lg font-bold text-foreground">{metric.value}</Text>
                    <Text className="text-xs text-muted-foreground text-center">{metric.label}</Text>
                  </View>
                </Card>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Quick Actions</Text>
          
          <View className="gap-4">
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} onPress={action.onPress}>
                <Card className="p-4">
                  <View className="flex-row items-center gap-4">
                    <View 
                      className="w-12 h-12 rounded-lg items-center justify-center"
                      style={{ backgroundColor: colorScheme === 'dark' ? '#374151' : '#F3F4F6' }}
                    >
                      <action.icon 
                        size={24} 
                        color={colorScheme === 'dark' ? '#ffffff' : '#000000'} 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">{action.title}</Text>
                      <Text className="text-sm text-muted-foreground">{action.description}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View className="items-center py-4">
          <Text className="text-sm text-muted-foreground">
            © 2025 Join Barber. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
