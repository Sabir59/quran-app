import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { 
  Clipboard, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  ChevronDown, 
  Calendar,
  Building,
  Filter
} from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { bookingsAPI, Booking, BookingStats, BookingFilters } from '@/api/customer/bookings';

const BookingHistoryScreen = () => {
  const { colorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [shopName, setShopName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const statusOptions = [
    { value: 'All Statuses', label: 'All Statuses' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'No Show', label: 'No Show' },
  ];

  const fetchBookingHistory = async () => {
    try {
      setIsLoading(true);
      
      // Prepare filters
      const filters: BookingFilters = {};
      if (statusFilter !== 'All Statuses') filters.status = statusFilter.toLowerCase();
      if (shopName) filters.shop_name = shopName;
      if (fromDate) filters.from_date = fromDate;
      if (toDate) filters.to_date = toDate;

      // Fetch booking history and stats
      const [historyResponse, statsResponse] = await Promise.all([
        bookingsAPI.getBookingHistory(filters),
        bookingsAPI.getBookingStats(),
      ]);

      setBookings(historyResponse.data);
      setBookingStats(statsResponse.data);
    } catch (error: any) {
      console.error('Failed to fetch booking history:', error);
      // Don't show alert for initial load, just log the error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const handleApplyFilters = () => {
    console.log('Applying filters:', { statusFilter, shopName, fromDate, toDate });
    fetchBookingHistory();
  };

  const handleClearFilters = () => {
    setStatusFilter('All Statuses');
    setShopName('');
    setFromDate('');
    setToDate('');
  };

  const handleFindBarbershops = () => {
    // TODO: Navigate to FindShopsScreen
    console.log('Navigate to Find Shops');
  };

  // Statistics data from API
  const stats = [
    { 
      label: 'Total Bookings', 
      count: bookingStats?.total_bookings || 0, 
      icon: Clipboard, 
      color: colorScheme === 'dark' ? '#3B82F6' : '#2563EB' 
    },
    { 
      label: 'Completed', 
      count: bookingStats?.completed || 0, 
      icon: CheckCircle, 
      color: colorScheme === 'dark' ? '#10B981' : '#059669' 
    },
    { 
      label: 'Left Early', 
      count: bookingStats?.left_early || 0, 
      icon: AlertTriangle, 
      color: colorScheme === 'dark' ? '#F59E0B' : '#D97706' 
    },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchBookingHistory}
          colors={['#000000']}
          tintColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
        />
      }
    >
      <View className="p-6">
        {/* Header */}
      <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">Booking History</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            View your past barber shop visits and appointments.
          </Text>
      </View>

        {/* Statistics Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          <View className="flex-row gap-3 px-6">
            {stats.map((stat, index) => (
              <Card key={index} className="w-32 p-4">
                <View className="items-center gap-2">
                  <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: stat.color + '20' }}>
                    <stat.icon size={20} color={stat.color} />
                  </View>
                  <Text className="text-lg font-bold text-foreground">{stat.count}</Text>
                  <Text className="text-xs text-muted-foreground text-center">{stat.label}</Text>
                </View>
              </Card>
        ))}
      </View>
        </ScrollView>

        {/* Filter Section */}
        <Card className="p-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Filter Booking History</Text>
          
          {/* Status Filter */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">Status</Text>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <View className="flex-row items-center justify-between border border-input bg-background rounded-md px-3 py-3">
                  <Text className="text-foreground">{statusFilter}</Text>
                  <ChevronDown size={16} color="#6B7280" />
              </View>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onPress={() => setStatusFilter(option.value)}
                  >
                    <Text className="text-foreground">{option.label}</Text>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            </View>

          {/* Shop Name Filter */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">Shop Name</Text>
            <View className="flex-row items-center bg-muted rounded-lg px-4 py-3">
              <Search size={20} color="#6B7280" />
              <TextInput
                className="flex-1 ml-3 text-foreground"
                placeholder="Search shops..."
                placeholderTextColor="#6B7280"
                value={shopName}
                onChangeText={setShopName}
              />
            </View>
              </View>
              
          {/* Date Range Filters */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground mb-2">From Date</Text>
              <TouchableOpacity className="flex-row items-center justify-between border border-input bg-background rounded-md px-3 py-3">
                <Text className="text-foreground">
                  {fromDate || 'mm/dd/yyyy'}
                </Text>
                <Calendar size={16} color="#6B7280" />
              </TouchableOpacity>
              </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground mb-2">To Date</Text>
              <TouchableOpacity className="flex-row items-center justify-between border border-input bg-background rounded-md px-3 py-3">
                <Text className="text-foreground">
                  {toDate || 'mm/dd/yyyy'}
                </Text>
                <Calendar size={16} color="#6B7280" />
              </TouchableOpacity>
              </View>
            </View>

          {/* Filter Action Buttons */}
          <View className="flex-row gap-3">
            <Button className="flex-1 flex-row items-center gap-2" onPress={handleApplyFilters}>
              <Filter size={16} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
              <Text>Apply Filters</Text>
            </Button>
            <Button variant="outline" className="flex-1" onPress={handleClearFilters}>
              <Text>Clear Filters</Text>
            </Button>
            </View>
          </Card>

        {/* Empty State */}
        <Card className="p-8 rounded-lg">
          <View className="items-center gap-4">
            <View className="w-16 h-16 bg-muted rounded-full items-center justify-center">
              <Calendar size={32} color="#6B7280" />
          </View>
            <View className="items-center gap-2">
              <Text className="text-lg font-semibold text-foreground">No booking history yet</Text>
              <Text className="text-sm text-muted-foreground text-center">
                You haven't completed any appointments yet. Start by finding a barbershop and joining their queue.
            </Text>
          </View>
            <Button className="mt-4" onPress={handleFindBarbershops}>
              <View className="flex-row items-center gap-2">
                <Building size={20} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
                <Text>Find Barbershops</Text>
          </View>
            </Button>
        </View>
      </Card>
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

export default BookingHistoryScreen;
