import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/lib/useColorScheme';

import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Store } from 'lucide-react-native';

const CustomerHomeScreen = () => {
  const { user } = useAuth();
  const { colorScheme } = useColorScheme();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Welcome Section */}
          <Text className="text-3xl font-bold mb-4 text-center">
            Welcome, {user?.first_name}!
          </Text>
        <Card className="w-full max-w-sm">
      <CardHeader className="flex-row">
        <View className="flex-1 flex-row items-center gap-4">
        <Store size={32} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <CardTitle className='text-xl'>Find Barbershops</CardTitle>
        </View>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">
          <Text>Browse Available Shops</Text>
        </Button>
      </CardFooter>
    </Card>

      </View>
    </ScrollView>
  );
};

export default CustomerHomeScreen;
