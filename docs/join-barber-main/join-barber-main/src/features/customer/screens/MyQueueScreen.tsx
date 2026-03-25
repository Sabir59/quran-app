import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MapPin, 
  Users, 
  Building,
  X
} from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { queueAPI, QueueItem } from '@/api/customer/queue';

const MyQueueScreen = () => {
  const { colorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [queueItem, setQueueItem] = useState<QueueItem | null>(null);

  const fetchQueueStatus = async () => {
    try {
      setIsLoading(true);
      const response = await queueAPI.getMyQueueStatus();
      setQueueItem(response.data);
    } catch (error: any) {
      console.error('Failed to fetch queue status:', error);
      // Don't show alert for initial load, just log the error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueStatus();
  }, []);

  const handleLeaveQueue = async () => {
    if (!queueItem) return;

    Alert.alert(
      'Leave Queue',
      'Are you sure you want to leave the queue? You will lose your position.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave Queue',
          style: 'destructive',
          onPress: async () => {
            try {
              await queueAPI.leaveQueue(queueItem.id);
              Alert.alert('Success', 'You have left the queue successfully');
              setQueueItem(null);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to leave queue');
            }
          },
        },
      ]
    );
  };

  const formatTime = (timeString: string) => {
    // Convert "00:23:16" format to "00:23:16"
    return timeString;
  };

  const formatWaitTime = (waitTime: string) => {
    // Convert "2h 30m" format or similar
    return waitTime;
  };

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchQueueStatus}
          colors={['#000000']}
          tintColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
        />
      }
    >
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center gap-3 mb-2">
            <Clock size={24} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />
            <Text className="text-2xl font-bold text-foreground">My Queue Status</Text>
          </View>
          <Text className="text-sm text-muted-foreground">
            Track your position in barber shop queues
          </Text>
        </View>

        {/* Queue Status Card */}
        {queueItem ? (
          <Card className="p-6 mb-6">
            {/* Shop Name and Position */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Building size={16} color="#6B7280" />
                <Text className="text-lg font-semibold text-foreground">{queueItem.shop_name}</Text>
              </View>
              <Badge variant="secondary" className="bg-blue-100">
                <Text className="text-blue-800 font-medium">Position #{queueItem.position}</Text>
              </Badge>
            </View>

            {/* Details Section */}
            <View className="gap-3 mb-6">
              <View className="flex-row items-center gap-3">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-sm text-muted-foreground">{queueItem.location}</Text>
              </View>
              
              <View className="flex-row items-center gap-3">
                <Clock size={16} color="#6B7280" />
                <Text className="text-sm text-muted-foreground">
                  Est. wait: {formatWaitTime(queueItem.estimated_wait_time)}
                </Text>
              </View>
              
              <View className="flex-row items-center gap-3">
                <Users size={16} color="#6B7280" />
                <Text className="text-sm text-muted-foreground">
                  Joined at: {formatTime(queueItem.joined_at)}
                </Text>
              </View>
            </View>

            {/* Status and Action */}
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">
                Status: <Text className="text-foreground font-medium">Waiting</Text>
              </Text>
              <Button 
                variant="destructive" 
                size="sm"
                onPress={handleLeaveQueue}
                className="flex-row items-center gap-2"
              >
                <X size={16} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
                <Text>Leave Queue</Text>
              </Button>
            </View>
          </Card>
        ) : (
          /* Empty State */
          <Card className="p-8 rounded-lg">
            <View className="items-center gap-4">
              <View className="w-16 h-16 bg-muted rounded-full items-center justify-center">
                <Clock size={32} color="#6B7280" />
              </View>
              <View className="items-center gap-2">
                <Text className="text-lg font-semibold text-foreground">Not in any queue</Text>
                <Text className="text-sm text-muted-foreground text-center">
                  You are not currently in any barber shop queue. Find a shop and join their queue to get started.
                </Text>
              </View>
              <Button className="mt-4">
                <View className="flex-row items-center gap-2">
                  <Building size={20} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
                  <Text>Find Barbershops</Text>
                </View>
              </Button>
            </View>
          </Card>
        )}

        {/* Queue Tips */}
        {queueItem && (
          <Card className="p-4">
            <View className="flex-row items-start gap-3">
              <View className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground mb-2">Queue Tips</Text>
                <View className="gap-1">
                  <Text className="text-sm text-muted-foreground">
                    • Arrive 5 minutes before your estimated time
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    • You can leave the queue anytime
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    • Queue position may change based on availability
                  </Text>
                </View>
              </View>
            </View>
          </Card>
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

export default MyQueueScreen;
