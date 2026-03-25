import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/lib/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { shopsAPI, Shop } from '@/api/shops';
import { Store, Plus, Users, Clock } from 'lucide-react-native';

const ShopHomeScreen = () => {
  const { user } = useAuth();
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();
  const [myShops, setMyShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's shops on component mount
  useEffect(() => {
    fetchMyShops();
  }, []);

  const fetchMyShops = async () => {
    try {
      setIsLoading(true);
      const response = await shopsAPI.getMyShops();
      setMyShops(response.data);
    } catch (error: any) {
      console.error('Failed to fetch shops:', error);
      // Don't show alert for initial load, just log the error
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterShop = () => {
    navigation.navigate('ShopRegistration' as never);
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Welcome Section */}
        <View className="bg-green-600 p-8 rounded-lg mb-6">
          <Text className="text-3xl font-bold text-white mb-4 text-center">
            Welcome, {user?.first_name}!
          </Text>
          <Text className="text-white/90 text-lg text-center">
            You are logged in as a Shop Owner
          </Text>
        </View>

        {/* User Info Card */}
        <View className="bg-card p-6 rounded-lg border border-border mb-6">
          <Text className="text-xl font-semibold text-foreground mb-4 text-center">
            Role: {user?.primary_role}
          </Text>
          <Text className="text-muted-foreground text-center mb-6">
            Email: {user?.email}
          </Text>
        </View>

        {/* My Shops Section */}
        {myShops.length > 0 ? (
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">My Barbershops</Text>
            {myShops.map((shop) => (
              <Card key={shop.id} className="p-4">
                <View className="flex-row items-center gap-3 mb-3">
                  <Store size={24} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />
                  <Text className="text-lg font-semibold text-foreground">{shop.shop_name}</Text>
                </View>
                <Text className="text-sm text-muted-foreground mb-2">{shop.address}</Text>
                <Text className="text-sm text-muted-foreground">
                  Contact: {shop.primary_contact_name} • {shop.primary_contact_email}
                </Text>
              </Card>
            ))}
          </View>
        ) : (
          /* Register Shop Card */
          <Card className="p-6">
            <View className="items-center gap-4">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center">
                <Store size={32} color="#16a34a" />
              </View>
              <View className="items-center gap-2">
                <Text className="text-lg font-semibold text-foreground">No barbershops yet</Text>
                <Text className="text-sm text-muted-foreground text-center">
                  Register your first barbershop to start managing your business
                </Text>
              </View>
              <Button className="mt-4" onPress={handleRegisterShop}>
                <View className="flex-row items-center gap-2">
                  <Plus size={20} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
                  <Text>Register Barbershop</Text>
                </View>
              </Button>
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

export default ShopHomeScreen;
