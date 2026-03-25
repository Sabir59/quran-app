import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { FormInput } from '@/components/ui-lib/form-input';
import { Button } from '@/components/ui/button';
import { PhoneInputComponent, PhoneInputRef } from '@/components/ui-lib/phone-input';
import { User, MapPin, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '@/api/profile';
import { Badge } from '@/components/ui/badge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DropdownMenuPreview } from './DropdownMenuPreview';

// Profile form schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
});

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const ProfileScreen = () => {
  const { user, checkAuth } = useAuth();
  const phoneInputRef = useRef<PhoneInputRef>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const onUpdateProfile = async (values: ProfileFormData) => {
    console.log('Profile update attempt:', values);
    console.log('Current user data:', user);
    
    try {
      setIsLoadingProfile(true);
      
      const updateData = {
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        email: values.email,
      };

      console.log('Sending all fields to backend:', updateData);

      // Call update profile API
      const response = await profileAPI.updateProfile(updateData);
      console.log('API response:', response);

      // Update stored user data with new values
      const updatedUser = {
        ...user,
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        email: values.email,
        full_name: `${values.firstName} ${values.lastName}`,
      };
      
      // Store updated user data
      await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
      console.log('Updated stored user data:', updatedUser);

      // Update the user state directly without calling checkAuth to avoid navigation issues
      // The form will be reset with new values below
      
      // Manually reset form with updated values to ensure UI shows latest data
      profileForm.reset({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email,
      });
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update failed:', error);
      console.log('Error details:', {
        message: error.message,
        errors: error.errors,
        response: error.response?.data
      });
      
      if (error.errors) {
        Object.keys(error.errors).forEach((field) => {
          const fieldName = field as keyof ProfileFormData;
          if (profileForm.getFieldState(fieldName)) {
            profileForm.setError(fieldName, {
              type: 'server',
              message: error.errors[field][0],
            });
          }
        });
      } else {
        Alert.alert('Update Failed', error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onChangePassword = async (values: PasswordFormData) => {
    console.log('Password change attempt:', {
      currentPassword: values.currentPassword ? '***' : 'empty',
      newPassword: values.newPassword ? '***' : 'empty',
      confirmPassword: values.confirmPassword ? '***' : 'empty'
    });
    
    try {
      setIsLoadingPassword(true);

      // Call change password API
      console.log('Sending password change request...');
      const response = await profileAPI.changePassword({
        current_password: values.currentPassword,
        password: values.newPassword,
        password_confirmation: values.confirmPassword,
      });
      console.log('Password change response:', response);

      // Clear password form
      passwordForm.reset();
      
      Alert.alert('Success', 'Password changed successfully');
    } catch (error: any) {
      console.error('Password change failed:', error);
      console.log('Password change error details:', {
        message: error.message,
        errors: error.errors,
        response: error.response?.data
      });
      
      if (error.errors) {
        Object.keys(error.errors).forEach((field) => {
          const fieldName = field as keyof PasswordFormData;
          if (passwordForm.getFieldState(fieldName)) {
            passwordForm.setError(fieldName, {
              type: 'server',
              message: error.errors[field][0],
            });
          }
        });
      } else {
        Alert.alert('Password Change Failed', error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-foreground mb-2">Profile Settings</Text>
        <Text className="text-muted-foreground max-w-[200px]">Manage your account settings and profile information</Text>
      </View>

      {/* Profile Information Card */}
      <Card className="p-6 mb-6">
        <DropdownMenuPreview/>
        <View className="flex-row items-center mb-4">
          <User size={20} color="#6B7280" />
          <Text className="text-lg font-semibold text-foreground ml-2">Profile Information</Text>
        </View>

        <View className="gap-5">
          {/* First Name */}
          <Controller
            control={profileForm.control}
            name="firstName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormInput
                label="First Name"
                placeholder="Enter your first name"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                error={error?.message}
              />
            )}
          />

          {/* Last Name */}
          <Controller
            control={profileForm.control}
            name="lastName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormInput
                label="Last Name"
                placeholder="Enter your last name"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                error={error?.message}
              />
            )}
          />

          {/* Phone Number */}
          <Controller
            control={profileForm.control}
            name="phone"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <PhoneInputComponent
                ref={phoneInputRef}
                label="Phone Number"
                value={value || ''}
                onChangeText={onChange}
                onChangeFormattedText={onChange}
                placeholder="Enter your phone number"
                error={error?.message}
              />
            )}
          />

          {/* Email */}
          <Controller
            control={profileForm.control}
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormInput
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error?.message}
                // rightIcon={<Text className="text-sm text-muted-foreground">Email cannot be changed</Text>}
              />
            )}
          />

          {/* Account Type */}
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">Account Type</Text>
            <Badge className="bg-muted px-3 py-2 rounded-full">
              <Text className="text-foreground text-sm">{user?.primary_role || 'Customer'}</Text>
            </Badge>
          </View>

          {/* Member Since */}
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">Member Since</Text>
            <Text className="text-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </Text>
          </View>
        </View>
      </Card>

      {/* Save Changes Button */}
      <Button 
        className="w-full mt-4 mb-6" 
        size="lg" 
        onPress={profileForm.handleSubmit(onUpdateProfile)}
        disabled={isLoadingProfile}
      >
        <Text>{isLoadingProfile ? 'Saving...' : 'Save Changes'}</Text>
      </Button>

      {/* Change Password Card */}
      <Card className="p-6 mb-6">
        <View className="flex-row items-center mb-4">
          <Lock size={20} color="#6B7280" />
          <Text className="text-lg font-semibold text-foreground ml-2">Change Password</Text>
        </View>

        <View className="gap-5">
          {/* Current Password */}
          <Controller
            control={passwordForm.control}
            name="currentPassword"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormInput
                label="Current Password"
                placeholder="Enter your current password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={true}
                error={error?.message}
              />
            )}
          />

          {/* New Password */}
          <Controller
            control={passwordForm.control}
            name="newPassword"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormInput
                label="New Password"
                placeholder="Enter new password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showNewPassword}
                error={error?.message}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                  </TouchableOpacity>
                }
                onRightIconPress={() => setShowNewPassword(!showNewPassword)}
              />
            )}
          />

          {/* Confirm New Password */}
          <Controller
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormInput
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showConfirmPassword}
                error={error?.message}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                  </TouchableOpacity>
                }
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          />

          {/* Change Password Button */}
          <Button 
            className="w-full mt-4" 
            size="lg" 
            variant="secondary"
            onPress={passwordForm.handleSubmit(onChangePassword)}
            disabled={isLoadingPassword}
          >
            <Text>{isLoadingPassword ? 'Changing...' : 'Change Password'}</Text>
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
};

export default ProfileScreen;
