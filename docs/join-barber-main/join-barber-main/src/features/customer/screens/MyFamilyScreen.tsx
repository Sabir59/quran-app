import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, RefreshControl, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Edit, Trash2, User, Search, ChevronDown } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import CreateSubUserForm from '../components/CreateSubUserForm';
import { familyAPI, SubUser } from '@/api/customer/family';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const MyFamilyScreen = () => {
  const { colorScheme } = useColorScheme();
  const [subUsers, setSubUsers] = useState<SubUser[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');


  const statusOptions = [
    { value: 'All Status', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  // Fetch sub-users on component mount
  useEffect(() => {
    fetchSubUsers();
  }, []);

  const fetchSubUsers = async () => {
    try {
      setIsLoading(true);
      const response = await familyAPI.getSubUsers();
      setSubUsers(response.data);
    } catch (error: any) {
      console.error('Failed to fetch sub-users:', error);
      // Don't show alert for initial load, just log the error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubUser = () => {
    setShowCreateForm(true);
  };

  const handleBackToSubUsers = () => {
    setShowCreateForm(false);
  };

  const handleSubUserCreated = () => {
    setShowCreateForm(false);
    // Refresh sub-users list after creation
    fetchSubUsers();
  };

  const handleDeleteSubUser = async (subUserId: string, subUserName: string) => {
    Alert.alert(
      'Delete Family Member',
      `Are you sure you want to delete ${subUserName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await familyAPI.deleteSubUser(subUserId);
              Alert.alert('Success', 'Family member deleted successfully');
              fetchSubUsers(); // Refresh the list
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete family member');
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (subUserId: string, currentStatus: boolean, subUserName: string) => {
    try {
      await familyAPI.toggleSubUserStatus(subUserId, !currentStatus);
      Alert.alert('Success', `${subUserName} status updated successfully`);
      fetchSubUsers(); // Refresh the list
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update family member status');
    }
  };

  const handleSearch = () => {
    // Search functionality will be implemented with filtering
    console.log('Searching for:', searchQuery, 'with status:', statusFilter);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
  };

  // Filter sub-users based on search query and status
  const filteredSubUsers = subUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.relation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || 
      (statusFilter === 'Active' && user.is_active) ||
      (statusFilter === 'Inactive' && !user.is_active);
    
    return matchesSearch && matchesStatus;
  });

  // Show create form if active
  if (showCreateForm) {
    return (
      <CreateSubUserForm 
        onBack={handleBackToSubUsers}
        onSuccess={handleSubUserCreated}
      />
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchSubUsers}
          colors={['#000000']}
          tintColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
        />
      }
    >
      <View className="p-6">
        {/* Header */}
      <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">My Family</Text>
        </View>

        {/* Add New Family Member Button */}
        <Button className="w-full mb-6" onPress={handleAddSubUser}>
          <View className="flex-row items-center gap-2">
            <Plus size={20} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
            <Text>Add New Family Member</Text>
          </View>
        </Button>

        {/* Search and Filter Card */}
        <Card className="p-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">Search Family Members</Text>
          
          {/* Search Input */}
          <View className="flex-row items-center bg-muted rounded-lg px-4 py-3 mb-4">
            <Search size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-foreground"
              placeholder="Search by name, email, or relation"
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

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

          {/* Search Action Buttons */}
          <View className="flex-row gap-3">
            <Button className="flex-1 flex-row items-center gap-2" onPress={handleSearch}>
              <Search size={16} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
              <Text>Search</Text>
            </Button>
            <Button variant="outline" className="flex-1" onPress={handleClearSearch}>
              <Text>Clear</Text>
            </Button>
          </View>
        </Card>

        {/* Empty State */}
        {filteredSubUsers.length === 0 && (
          <Card className="p-8 rounded-lg">
            <View className="items-center gap-4">
              <View className="w-16 h-16 bg-muted rounded-full items-center justify-center">
                <Users size={32} color="#6B7280" />
              </View>
              <View className="items-center gap-2">
                <Text className="text-lg font-semibold text-foreground">No family members</Text>
                <Text className="text-sm text-muted-foreground text-center">
                  Get started by creating a new family member.
                </Text>
              </View>
              <Button className="mt-4" onPress={handleAddSubUser}>
                <View className="flex-row items-center gap-2">
                  <Plus size={20} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
                  <Text>Add Family Member</Text>
                </View>
              </Button>
        </View>
          </Card>
        )}

      {/* Family Members List */}
        {filteredSubUsers.length > 0 && (
          <View className="gap-4">
            {filteredSubUsers.map((user) => (
              <Card key={user.id} className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-3 mb-2">
                      <View className="w-10 h-10 bg-muted rounded-full items-center justify-center">
                        <User size={20} color="#6B7280" />
                </View>
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-foreground">
                          {user.first_name} {user.last_name}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {user.relation}
                </Text>
              </View>
            </View>
            
                    <View className="gap-1">
                      <Text className="text-sm text-muted-foreground">
                        📧 {user.email}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        📞 {user.phone}
                      </Text>
                      <View className="flex-row items-center gap-2 mt-2">
                        <View className={`px-2 py-1 rounded-full ${user.is_active ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Text className={`text-xs font-medium ${user.is_active ? 'text-green-800' : 'text-gray-600'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Text>
                        </View>
                        <Text className="text-xs text-muted-foreground">
                          Added {new Date(user.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
            </View>
            
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={() => handleToggleStatus(user.id, user.is_active, `${user.first_name} ${user.last_name}`)}
                      className="p-2 rounded-md bg-muted"
                    >
                      <Text className="text-xs font-medium">
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </Text>
              </TouchableOpacity>
                    
              <TouchableOpacity 
                      onPress={() => handleDeleteSubUser(user.id, `${user.first_name} ${user.last_name}`)}
                      className="p-2 rounded-md bg-red-100"
              >
                      <Trash2 size={16} color="#DC2626" />
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

export default MyFamilyScreen;
