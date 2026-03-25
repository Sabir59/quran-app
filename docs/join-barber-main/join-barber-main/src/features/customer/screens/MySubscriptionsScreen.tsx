import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Calendar, CreditCard, Clock, Users, MapPin, Phone, Monitor, Plus } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { subscriptionsAPI, Subscription } from '@/api/customer/subscriptions';

const MySubscriptionsScreen = ({ navigation }: any) => {
  const { colorScheme } = useColorScheme();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionsAPI.getSubscriptions();
      setSubscriptions(response.data);
    } catch (error: any) {
      console.error('Failed to fetch subscriptions:', error);
      // Don't show alert for initial load, just log the error
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowseShops = () => {
    navigation.navigate('FindShops');
  };

  const handleViewShop = (subscription: Subscription) => {
    // Navigate to shop details
    navigation.navigate('ShopDetails', { shopId: subscription.shop_id });
  };

  const handleViewQueueDisplay = (subscription: Subscription) => {
    navigation.navigate('QueueDisplay', { shopId: subscription.shop_id });
  };

  const handleCancelSubscription = async (subscription: Subscription) => {
    Alert.alert(
      'Cancel Subscription',
      `Are you sure you want to cancel your subscription to ${subscription.shop_name}?`,
      [
        { text: 'Keep Subscription', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              await subscriptionsAPI.cancelSubscription(subscription.id);
              Alert.alert('Success', 'Subscription cancelled successfully');
              fetchSubscriptions(); // Refresh the list
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel subscription');
            }
          },
        },
      ]
    );
  };

  const handleToggleAutoRenew = async (subscription: Subscription) => {
    try {
      await subscriptionsAPI.toggleAutoRenew(subscription.id, !subscription.auto_renew);
      Alert.alert('Success', `Auto-renew ${subscription.auto_renew ? 'disabled' : 'enabled'} successfully`);
      fetchSubscriptions(); // Refresh the list
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update auto-renew setting');
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to format price
  const formatPrice = (price: number, currency: string) => {
    return `${currency}${price.toFixed(2)}`;
  };

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchSubscriptions}
          colors={['#000000']}
          tintColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
        />
      }
    >
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">My Subscriptions</Text>
          <Text className="text-muted-foreground">Manage your active subscriptions across all shops</Text>
        </View>

        {/* Empty State */}
        {subscriptions.length === 0 && (
          <Card className="p-8 rounded-lg">
            <View className="items-center gap-4">
              <View className="w-16 h-16 bg-muted rounded-full items-center justify-center">
                <Store size={32} color="#6B7280" />
              </View>
              <View className="items-center gap-2">
                <Text className="text-lg font-semibold text-foreground">No subscriptions</Text>
                <Text className="text-sm text-muted-foreground text-center">
                  You haven't subscribed to any plans yet.
                </Text>
              </View>
              <Button className="mt-4" onPress={handleBrowseShops}>
                <View className="flex-row items-center gap-2">
                  <Store size={20} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
                  <Text>Browse Shops</Text>
                </View>
              </Button>
            </View>
          </Card>
        )}

        {/* Subscriptions List */}
        {subscriptions.length > 0 && (
          <View className="gap-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="p-4">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-2">
                    <Store size={24} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
                    <Text className="text-lg font-semibold text-foreground">{subscription.shop_name}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${getStatusColor(subscription.status)}`}>
                    <Text className="text-xs font-medium capitalize">
                      {subscription.status}
                    </Text>
                  </View>
                </View>

                <View className="gap-3 mb-4">
                  {/* Location */}
                  <View className="flex-row items-center gap-2">
                    <MapPin size={16} color="#6B7280" />
                    <Text className="text-sm text-muted-foreground">{subscription.shop_address}</Text>
                  </View>
                  
                  {/* Phone */}
                  <View className="flex-row items-center gap-2">
                    <Phone size={16} color="#6B7280" />
                    <Text className="text-sm text-muted-foreground">{subscription.shop_phone}</Text>
                  </View>

                  {/* Subscription Details */}
                  <View className="flex-row items-center gap-2">
                    <CreditCard size={16} color="#6B7280" />
                    <Text className="text-sm text-muted-foreground">
                      {subscription.subscription_type.charAt(0).toUpperCase() + subscription.subscription_type.slice(1)} - {formatPrice(subscription.price, subscription.currency)}
                    </Text>
                  </View>

                  {/* Dates */}
                  <View className="flex-row items-center gap-2">
                    <Calendar size={16} color="#6B7280" />
                    <Text className="text-sm text-muted-foreground">
                      {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
                    </Text>
                  </View>

                  {/* Auto Renew */}
                  <View className="flex-row items-center gap-2">
                    <Clock size={16} color="#6B7280" />
                    <Text className="text-sm text-muted-foreground">
                      Auto-renew: {subscription.auto_renew ? 'Enabled' : 'Disabled'}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="gap-3">
                  <View className="flex-row gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 flex-row items-center gap-2" 
                      onPress={() => handleViewShop(subscription)}
                    >
                      <Store size={16} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
                      <Text>View Shop</Text>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1 flex-row items-center gap-2"
                      onPress={() => handleViewQueueDisplay(subscription)}
                    >
                      <Monitor size={16} color={colorScheme === 'dark' ? '#FAFAFA' : '#09090B'} />
                      <Text>Queue Display</Text>
                    </Button>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleToggleAutoRenew(subscription)}
                      className={`flex-1 p-3 rounded-md ${subscription.auto_renew ? 'bg-blue-100' : 'bg-gray-100'}`}
                    >
                      <Text className={`text-xs font-medium text-center ${subscription.auto_renew ? 'text-blue-800' : 'text-gray-600'}`}>
                        {subscription.auto_renew ? 'Disable Auto-Renew' : 'Enable Auto-Renew'}
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => handleCancelSubscription(subscription)}
                      className="flex-1 p-3 rounded-md bg-red-100"
                    >
                      <Text className="text-xs font-medium text-center text-red-800">
                        Cancel Subscription
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </View>

      {/* Footer */}
      <View className="items-center py-4">
        <Text className="text-sm text-muted-foreground">
          © 2025 Join Barber. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

export default MySubscriptionsScreen;
