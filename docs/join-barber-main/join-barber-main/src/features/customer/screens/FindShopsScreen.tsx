import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TextInput, Alert, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Phone, Store, Monitor, Plus, Users, Clock } from 'lucide-react-native';
import { shopsAPI, Shop } from '@/api/shops';
import { Badge } from '@/components/ui/badge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/lib/useColorScheme';

const FindShopsScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const { colorScheme } = useColorScheme();

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  const CACHE_KEY = 'shops_cache';
  const CACHE_TIME_KEY = 'shops_cache_time';

  // Load cached shops
  const loadCachedShops = async (): Promise<Shop[] | null> => {
    try {
      const cachedShops = await AsyncStorage.getItem(CACHE_KEY);
      const cacheTime = await AsyncStorage.getItem(CACHE_TIME_KEY);

      if (cachedShops && cacheTime) {
        const parsedTime = parseInt(cacheTime);
        const now = Date.now();

        // Check if cache is still valid (within 5 minutes)
        if (now - parsedTime < CACHE_DURATION) {
          console.log('Loading shops from cache');
          return JSON.parse(cachedShops);
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading cached shops:', error);
      return null;
    }
  };

  // Save shops to cache
  const saveShopsToCache = async (shopsData: Shop[]) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(shopsData));
      await AsyncStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      console.log('Shops saved to cache');
    } catch (error) {
      console.error('Error saving shops to cache:', error);
    }
  };

  // Load shops with smart caching
  const loadShops = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);

      // Try to load from cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedShops = await loadCachedShops();
        if (cachedShops) {
          setShops(cachedShops);
          setLastFetchTime(Date.now());
          setIsLoading(false);
          return;
        }
      }

      // Fetch from API
      console.log('Fetching shops from API');
      const response = await shopsAPI.getAllShops();
      setShops(response.data);
      setLastFetchTime(Date.now());

      // Save to cache
      await saveShopsToCache(response.data);

    } catch (error: any) {
      console.error('Failed to load shops:', error);

      // If API fails, try to load from cache as fallback
      if (!forceRefresh) {
        const cachedShops = await loadCachedShops();
        if (cachedShops) {
          setShops(cachedShops);
          console.log('Loaded shops from cache as fallback');
        } else {
          Alert.alert('Error', error.message || 'Failed to load shops');
        }
      } else {
        Alert.alert('Error', error.message || 'Failed to load shops');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadShops(true); // Force refresh
    setIsRefreshing(false);
  }, [loadShops]);

  // Load shops on mount
  useEffect(() => {
    loadShops();
  }, [loadShops]);

  const handleViewShop = (shop: Shop) => {
    // Navigate to shop details
    navigation.navigate('ShopDetails', { shopId: shop.id });
  };

  const handleViewQueueDisplay = (shop: Shop) => {
    navigation.navigate('QueueDisplay', { shopId: shop.id });
  };

  const handleJoinQueue = (shop: Shop) => {
    // TODO: Join queue functionality
    console.log('Join queue:', shop.id);
  };

  // Helper function to check if shop is currently open
  const isShopOpen = (shop: Shop) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // 'monday', 'tuesday', etc.
    const currentTime = now.toTimeString().slice(0, 8); // 'HH:MM:SS'

    const todayHours = shop.opening_hours.find(hour =>
      hour.day.toLowerCase() === currentDay
    );

    if (!todayHours || !todayHours.on) return false;

    return currentTime >= todayHours.start_time && currentTime <= todayHours.end_time;
  };

  // Helper function to calculate estimated wait time
  const calculateEstimatedWaitTime = (shop: Shop, queueLength: number = 0) => {
    // For now, we'll use a simple calculation:
    // Estimated wait time = (Queue length × Average service time) + Average service time
    // This assumes one barber/stylist working
    const estimatedWaitTime = (queueLength * shop.avg_service_time) + shop.avg_service_time;
    return estimatedWaitTime;
  };

  const filteredShops = shops.filter(shop =>
    (shop.shop_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (shop.address?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      className="flex-1 bg-background p-4"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={['#3B82F6']}
          tintColor="#3B82F6"
        />
      }
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-foreground mb-2">Browse Barber Shops</Text>
        <Text className="text-muted-foreground">Find nearby barber shops and join their queues</Text>
        {lastFetchTime && (
          <Text className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(lastFetchTime).toLocaleTimeString()}
          </Text>
        )}
      </View>

      {/* Search Bar */}
      <View>
        <View className="flex-row items-center bg-muted rounded-lg px-4 py-3">
          <Search size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-foreground"
            placeholder="Search shops..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Shops List */}
      <View className="gap-6 my-6">
        {isLoading ? (
          <View className="items-center py-8">
            <Text className="text-muted-foreground">Loading shops...</Text>
          </View>
        ) : filteredShops.length === 0 ? (
          <View className="items-center py-8">
            <Text className="text-muted-foreground">No shops found</Text>
          </View>
        ) : (
          filteredShops.map((shop) => (
            <Card key={shop.id} className="p-4 rounded-md">
              {/* Shop Header */}
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

              <View className="gap-3">
                {/* Location */}
                <View className="flex-row items-center gap-2">
                  <MapPin size={16} color="#6B7280" />
                  <Text className="text-sm text-muted-foreground">{shop.address || 'No address'}</Text>
                </View>
                {/* Phone */}
                <View className="flex-row items-center gap-2">
                  <Phone size={16} color="#6B7280" />
                  <Text className="text-sm text-muted-foreground">{shop.primary_contact_number || 'No phone'}</Text>
                </View>
                {/* Services */}
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-muted-foreground">
                    {shop.services.length > 0 ? shop.services.map(s => s.name).join(', ') : 'No services'}
                  </Text>
                </View>
              </View>

              {/* Owner */}
              <View className="flex-row items-center gap-2">
                <Users size={16} color="#6B7280" />
                <Text className="font-semibold text-foreground">Owner: {shop.primary_contact_name || 'N/A'}</Text>
              </View>

              <View className="flex-row justify-between items-start gap-2">
                <View className='gap-2'>
                  <Text className="font-semibold text-foreground">Current Queue</Text>
                  <Badge className="bg-gray-200 rounded-full">
                    <Text className="text-sm text-muted-foreground">0 waiting</Text>
                  </Badge>
                </View>
                <View className='flex-row items-center gap-1'>
                <Clock size={16} color="#6B7280" />
                <Text>Est. wait time: {calculateEstimatedWaitTime(shop, 0)} minutes</Text>
                </View>
              </View>

              <View className='gap-4'>
                <Button variant="outline" className='flex-row items-center gap-3' onPress={() => handleViewShop(shop)}>
                  <Store size={20} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
                  <Text>View Shop</Text>
                </Button>
                <Button variant="outline" className='flex-row items-center gap-3'>
                  <Monitor size={20} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
                  <Text>View Queue Display</Text>
                </Button>
                <Button disabled={!isShopOpen(shop)} className='flex-row items-center gap-3'>
                  {isShopOpen(shop) && <Plus size={20} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />}
                  <Text>{isShopOpen(shop) ? 'Join Queue' : 'Shop Closed'}</Text>
                </Button>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default FindShopsScreen;
