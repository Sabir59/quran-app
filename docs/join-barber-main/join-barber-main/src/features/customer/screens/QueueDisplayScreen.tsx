import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  Users,
  Clock,
  Monitor,
  Plus,
  QrCode,
  Scissors,
  Check,
  User,
  CreditCard,
  Zap,
  Circle
} from 'lucide-react-native';
import { shopsAPI, Shop } from '@/api/shops';
import { useColorScheme } from '@/lib/useColorScheme';
import MaxWidthWrapper from '@/components/shared/MaxWidthWrapper';

interface QueueDisplayScreenProps {
  route: {
    params: {
      shopId: number;
    };
  };
  navigation: any;
}

// Mock queue data - replace with API data later
interface QueueCustomer {
  id: number;
  name: string;
  joinedAt: string;
  services: string[];
  status: 'in-service' | 'next' | 'waiting';
  position: number;
  estimatedWaitTime?: string;
  serviceDuration?: string;
}

interface QueueData {
  shopName: string;
  isOpen: boolean;
  location: string;
  contact: string;
  operatingHours: string;
  queueLength: number;
  currentlyWorking: string;
  nextService: string;
  customers: QueueCustomer[];
  currentTime: string;
  date: string;
  timezone: string;
}

const QueueDisplayScreen = ({ route, navigation }: QueueDisplayScreenProps) => {
  const { shopId } = route.params;
  const [shop, setShop] = useState<Shop | null>(null);
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    loadShopDetails();
    loadQueueData();
  }, [shopId]);

  const loadShopDetails = async () => {
    try {
      const response = await shopsAPI.getShopDetails(shopId);
      if (response.success && response.data.length > 0) {
        setShop(response.data[0]);
      } else {
        Alert.alert('Error', 'Shop not found');
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Failed to load shop details:', error);
      // Don't go back, just show mock data
    }
  };

  const loadQueueData = () => {
    // Mock data - replace with API call later
    const mockQueueData: QueueData = {
      shopName: "The Barber Shop",
      isOpen: true,
      location: "PCSIR",
      contact: "03314001544",
      operatingHours: "Today: 00:01:00 - 23:59:00",
      queueLength: 4,
      currentlyWorking: "No barbers currently available",
      nextService: "Now",
      customers: [
        {
          id: 1,
          name: "Customer",
          joinedAt: "23:23",
          services: ["Haircut", "Beard Trim"],
          status: "in-service",
          position: 1,
          serviceDuration: "23412m 5s"
        },
        {
          id: 2,
          name: "Customer",
          joinedAt: "11:19",
          services: ["Haircut", "Beard Trim"],
          status: "next",
          position: 1,
          estimatedWaitTime: "~0min estimated"
        },
        {
          id: 3,
          name: "Customer",
          joinedAt: "00:15",
          services: ["Haircut"],
          status: "waiting",
          position: 2,
          estimatedWaitTime: "~50min estimated"
        },
        {
          id: 4,
          name: "Customer",
          joinedAt: "18:21",
          services: ["Haircut", "Beard Trim"],
          status: "waiting",
          position: 3,
          estimatedWaitTime: "~1h 20min estimated"
        }
      ],
      currentTime: "01:11:51",
      date: "Friday, August 29, 2025",
      timezone: "Europe/London"
    };

    setQueueData(mockQueueData);
    setIsLoading(false);
  };

  const getStatusIcon = (status: string, position: number) => {
    switch (status) {
      case 'in-service':
        return <Zap size={20} color="#10B981" />;
      case 'next':
        return <Text className="text-orange-600 font-bold text-lg">{position}</Text>;
      default:
        return <Text className="text-gray-400 font-bold text-lg">{position}</Text>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-service':
        return (
          <Badge className="bg-blue-100 rounded-full">
            <Text className="text-blue-800 text-xs">In Service</Text>
          </Badge>
        );
      case 'next':
        return (
          <Badge className="bg-orange-100 rounded-full">
            <Text className="text-orange-800 text-xs">Next</Text>
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCustomerCardStyle = (status: string) => {
    switch (status) {
      case 'in-service':
        return "bg-green-50 border-green-200";
      case 'next':
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Loading queue display...</Text>
      </View>
    );
  }

  if (!queueData) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Queue data not available</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <MaxWidthWrapper classNames='my-4'>
        {/* Top Navigation Bar */}
        <View className="flex-row items-center justify-between bg-card border-b border-border p-4 mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            <Scissors size={20} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
            <Text className="text-lg font-semibold text-foreground">Join Barber</Text>
          </View>
          <TouchableOpacity>
            <User size={24} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
          </TouchableOpacity>
        </View>

        {/* Shop Header */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Store size={24} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
              <Text className="text-lg font-semibold text-foreground">{queueData.shopName}</Text>
            </View>
            <Badge className={`rounded-full ${queueData.isOpen ? 'bg-green-200' : 'bg-red-200'}`}>
              <View className="flex-row items-center gap-1">
                <View className={`w-2 h-2 rounded-full ${queueData.isOpen ? 'bg-green-600' : 'bg-red-600'}`} />
                <Text className={`${queueData.isOpen ? 'text-green-800' : 'text-red-800'}`}>
                  {queueData.isOpen ? 'Open' : 'Closed'}
                </Text>
              </View>
            </Badge>
          </View>
        </View>

        {/* Shop Information */}
        <Card className="mb-4 p-4">
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <MapPin size={16} color="#6B7280" />
              <Text className="text-sm text-muted-foreground">{queueData.location}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Phone size={16} color="#6B7280" />
              <Text className="text-sm text-muted-foreground">{queueData.contact}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Clock size={16} color="#6B7280" />
              <Text className="text-sm text-muted-foreground">{queueData.operatingHours}</Text>
            </View>
          </View>
        </Card>

        {/* Queue Status */}
        <Card className="mb-4 p-4">
          <View className="flex-row items-center gap-2 mb-4">
            <Users size={20} color="#6B7280" />
            <Text className="text-lg font-semibold text-foreground">Queue Status</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">{queueData.queueLength}</Text>
            <Text className="text-sm text-muted-foreground">People waiting</Text>
          </View>
        </Card>

        {/* Currently Working */}
        <Card className="mb-4 p-4">
          <View className="flex-row items-center gap-2 mb-4">
            <Users size={20} color="#6B7280" />
            <Text className="text-lg font-semibold text-foreground">Currently Working</Text>
          </View>
          <Text className="text-sm text-muted-foreground">{queueData.currentlyWorking}</Text>
        </Card>

        {/* Next Service */}
        <Card className="mb-4 p-4">
          <View className="flex-row items-center gap-2 mb-4">
            <Clock size={20} color="#6B7280" />
            <Text className="text-lg font-semibold text-foreground">Next Service</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-foreground">{queueData.nextService}</Text>
            <Text className="text-sm text-muted-foreground">Next customer</Text>
          </View>
        </Card>

        {/* Current Queue */}
        <Card className="mb-4 p-4">
          <Text className="text-lg font-semibold text-foreground mb-4">Current Queue</Text>
          
          <View className="gap-3">
            {queueData.customers.map((customer) => (
              <Card 
                key={customer.id} 
                className={`p-4 border ${getCustomerCardStyle(customer.status)}`}
              >
                <View className="flex-row items-start gap-3">
                  {/* Status Icon */}
                  <View className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    customer.status === 'in-service' ? 'bg-green-100' : 
                    customer.status === 'next' ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    {getStatusIcon(customer.status, customer.position)}
                  </View>

                  {/* Customer Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-medium text-foreground">{customer.name}</Text>
                      <Text className="text-xs text-muted-foreground">Joined at: {customer.joinedAt}</Text>
                    </View>
                    
                    <Text className="text-sm text-muted-foreground mb-2">
                      {customer.services.join(', ')}
                    </Text>

                    {customer.status === 'in-service' && customer.serviceDuration && (
                      <Text className="text-sm text-green-600 mb-2">
                        In service: {customer.serviceDuration}
                      </Text>
                    )}

                    {customer.estimatedWaitTime && (
                      <Text className="text-sm text-muted-foreground mb-2">
                        {customer.estimatedWaitTime}
                      </Text>
                    )}

                    {getStatusBadge(customer.status)}
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </Card>

        {/* Footer */}
        <Card className="mb-6 p-4">
          <View className="gap-2">
            <Text className="text-sm text-muted-foreground">Current Time: {queueData.currentTime}</Text>
            <Text className="text-sm text-muted-foreground">{queueData.date}</Text>
            <Text className="text-sm text-muted-foreground">{queueData.timezone}</Text>
            <Text className="text-xs text-muted-foreground mt-2">This page updates automatically</Text>
          </View>
        </Card>
      </MaxWidthWrapper>
    </ScrollView>
  );
};

export default QueueDisplayScreen;
