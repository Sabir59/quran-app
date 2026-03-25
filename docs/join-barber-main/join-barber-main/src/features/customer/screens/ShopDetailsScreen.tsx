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
  CreditCard
} from 'lucide-react-native';
import { shopsAPI, Shop } from '@/api/shops';
import { useColorScheme } from '@/lib/useColorScheme';
import MaxWidthWrapper from '@/components/shared/MaxWidthWrapper';

interface ShopDetailsScreenProps {
  route: {
    params: {
      shopId: number;
    };
  };
  navigation: any;
}

const ShopDetailsScreen = ({ route, navigation }: ShopDetailsScreenProps) => {
  const { shopId } = route.params;
  const [shop, setShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    loadShopDetails();
  }, [shopId]);

  const loadShopDetails = async () => {
    try {
      setIsLoading(true);
      const response = await shopsAPI.getShopDetails(shopId);
      if (response.success && response.data.length > 0) {
        setShop(response.data[0]);
      } else {
        Alert.alert('Error', 'Shop not found');
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Failed to load shop details:', error);
      Alert.alert('Error', error.message || 'Failed to load shop details');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const isShopOpen = (shop: Shop) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 8);

    const todayHours = shop.opening_hours.find(hour =>
      hour.day.toLowerCase() === currentDay
    );

    if (!todayHours || !todayHours.on) return false;
    return currentTime >= todayHours.start_time && currentTime <= todayHours.end_time;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Loading shop details...</Text>
      </View>
    );
  }

  if (!shop) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Shop not found</Text>
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

      {/* Back to Browse Shops Button */}
        {/* <Button
          variant="outline"
          className="flex-row items-center gap-2 my-4"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={16} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
          <Text>Back to Browse Shops</Text>
        </Button> */}

      {/* Shop Header */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Store size={24} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
            <Text className="text-lg font-semibold text-foreground">{shop.shop_name || 'Unnamed Shop'}</Text>
          </View>
          <Badge className={`rounded-full ${isShopOpen(shop) ? 'bg-green-200' : 'bg-red-200'}`}>
            <Text className={`${isShopOpen(shop) ? 'text-green-800' : 'text-red-800'}`}>
              {isShopOpen(shop) ? 'Open' : 'Closed'}
            </Text>
          </Badge>
        </View>
      </View>

      {/* Shop Information Card */}
      <Card className="mb-4 p-4">
        <Text className="text-lg font-semibold text-foreground mb-1">Shop Information</Text>
        <View className="gap-4">
          {/* Location */}
          <View>
            <View className="bg-muted rounded-lg p-3 h-24 items-center justify-center">
              <Text className="text-sm text-muted-foreground">Map View</Text>
              <Text className="text-xs text-muted-foreground">View larger map</Text>
            </View>
          </View>

          <View className="gap-6">
            {/* Location */}
            <View className='gap-1'>
              <Text className="font-medium text-foreground mb-1">Location</Text>
              <View className='flex-row items-center gap-2'>
                <MapPin size={14} color="#6B7280" />
                <Text className="text-sm text-muted-foreground capitalize">{shop.address || 'No address'}</Text>
              </View>
            </View>
            {/* Contact */}
            <View className='gap-1'>
              <Text className="font-medium text-foreground mb-1">Conatact</Text>
              <View className='flex-row items-center gap-2'>
                <Phone size={14} color="#6B7280" />
                <Text className="text-sm text-muted-foreground capitalize">{shop.primary_contact_number || 'No phone'}</Text>
              </View>
            </View>
            {/* Payment Methods */}
            <View className='gap-1'>
              <Text className="font-medium text-foreground mb-1">Payment Methods</Text>
              <View className='flex-row items-center gap-2'>
                <CreditCard size={14} color="#6B7280" />
                <Text className="text-sm text-muted-foreground capitalize">{shop.payment_methods || 'No payment methods'}</Text>
              </View>
            </View>
          </View>
          <View className='w-full h-px bg-border'></View>

          {/* Opening Hours */}
          <View>
            <View className='flex-row items-center gap-1 mb-6'>
              <Clock size={16} color="#6B7280" />
              <Text className="font-medium text-foreground">Opening Hours</Text>
            </View>
            <View className="gap-2">
              {shop.opening_hours.map((hour, index) => (
                <View key={index} className="flex-row justify-between">
                  <Text className="text-sm font-medium capitalize">
                    {formatDayName(hour.day)}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {hour.on
                      ? `${formatTime(hour.start_time)} - ${formatTime(hour.end_time)}`
                      : 'Closed'
                    }
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Card>

      {/* Current Queue Card */}
      <Card className="mb-4 p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-foreground">Current Queue</Text>
          <Badge className="bg-gray-200 rounded-full">
            <Text className="text-sm text-muted-foreground">2 waiting</Text>
          </Badge>
        </View>

        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Clock size={16} color="#6B7280" />
            <Text className="text-sm text-muted-foreground">Est. wait time: 0 minutes</Text>
          </View>

          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium text-foreground">#1</Text>
              <Text className="text-sm text-muted-foreground">Haircut, Beard Trim</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium text-foreground">#2</Text>
              <Text className="text-sm text-muted-foreground">Haircut</Text>
            </View>
          </View>

          <View className="gap-3 mt-4">
            <Button 
              // variant="outline" 
              className="flex-row items-center gap-2"
              onPress={() => navigation.navigate('QueueDisplay', { shopId: shop.id })}
            >
              <Monitor size={16} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
              <Text>View Queue Display</Text>
            </Button>
            <Button disabled={!isShopOpen(shop)} className='flex-row items-center gap-3'>
              {isShopOpen(shop) && <Plus size={20} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />}
              <Text>{isShopOpen(shop) ? 'Join Queue' : 'Shop Closed'}</Text>
            </Button>
            <Button variant="outline" className="flex-row items-center gap-2">
              <QrCode size={16} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
              <Text>Show QR Code</Text>
            </Button>
          </View>
        </View>
      </Card>

      {/* Services & Pricing Card */}
      <Card className="mb-3 p-3">
        <Text className="text-lg font-semibold text-foreground mb-4">Services & Pricing</Text>

        <View className="gap-4">
          {shop.services.map((service) => (
            <Card key={service.id} className="flex-row items-center justify-between p-3 rounded-md">
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Scissors size={16} color="#6B7280" />
                  <Text className="text-sm font-medium text-foreground">{service.name}</Text>
                </View>
                {service.detail && (
                  <Text className="text-xs text-muted-foreground mb-1">{service.detail}</Text>
                )}
                <Text className="text-xs text-muted-foreground">Duration: {service.time} minutes</Text>
              </View>
              <Text className="text-sm font-semibold text-foreground">£{service.price.toFixed(2)}</Text>
            </Card>
          ))}
        </View>
      </Card>

      {/* Available Subscription Plans Card */}
      <Card className="mb-6 p-4">
        <Text className="text-lg font-semibold text-foreground">Available Subscription Plans</Text>

        <View className="gap-4">
          <View className="border border-border rounded-lg p-4">
            <Text className="text-lg font-semibold text-foreground mb-2">Golden Package</Text>
            <Text className="text-2xl font-bold text-foreground mb-2">£40.00/month</Text>
            <Text className="text-sm text-muted-foreground mb-4">dsasa</Text>

            <Text className="text-sm font-medium text-foreground mb-2">Included Services:</Text>
            <View className="gap-2">
              {shop.services.slice(0, 2).map((service) => (
                <View key={service.id} className="flex-row items-center gap-2">
                  <Check size={16} color="#10B981" />
                  <Text className="text-sm text-muted-foreground">
                    {service.name} ({service.time}min)
                  </Text>
                </View>
              ))}
            </View>

            <Button className="mt-4">
              <Text>Subscribe Now</Text>
            </Button>
          </View>
        </View>
      </Card>
     </MaxWidthWrapper>
    </ScrollView>
  );
};

export default ShopDetailsScreen;
