import React, { useRef, useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { FormInput } from '@/components/ui-lib/form-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Check, ChevronDown } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSubUserSchema, CreateSubUserFormData } from '../forms/sub-user-schema';
import { PhoneInputComponent, PhoneInputRef } from '@/components/ui-lib/phone-input';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { familyAPI } from '@/api/customer/family';


interface CreateSubUserFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const relationOptions = [
  { value: 'Child', label: 'Child' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Other', label: 'Other' },
];

const CreateSubUserForm = ({ onBack, onSuccess }: CreateSubUserFormProps) => {
  const { colorScheme } = useColorScheme();
  const phoneInputRef = useRef<PhoneInputRef>(null);

  const form = useForm<CreateSubUserFormData>({
    resolver: zodResolver(createSubUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      relation: '',
      isActive: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: CreateSubUserFormData) => {
    try {
      setIsLoading(true);
      console.log('Create sub-user attempt:', values);

      // Prepare data for API
      const subUserData = {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone,
        relation: values.relation,
        is_active: values.isActive,
      };

      // Call API to create sub-user
      const response = await familyAPI.createSubUser(subUserData);
      console.log('Sub-user creation successful:', response);

      Alert.alert('Success', 'Sub-user created successfully!');
      onSuccess?.();
    } catch (error: any) {
      console.error('Sub-user creation failed:', error);

      // Handle API errors
      if (error.errors) {
        // Handle field-specific errors
        Object.keys(error.errors).forEach((field) => {
          const fieldName = field as keyof CreateSubUserFormData;
          if (form.getFieldState(fieldName)) {
            form.setError(fieldName, {
              type: 'server',
              message: error.errors[field][0],
            });
          }
        });
      } else {
        // Handle general error
        Alert.alert('Creation Failed', error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Creation',
      'Are you sure you want to cancel? All entered data will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: onBack },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">Create New Sub-User</Text>
        </View>
        <View className="mb-6">

        </View>

        {/* Back Button */}
        <Button
          className="mb-6 flex-row items-center gap-2"
          onPress={onBack}
        >
          <ArrowLeft size={16} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
          <Text>Back to Sub-Users</Text>
        </Button>

        {/* Form */}
        <Card className="p-6">
          <View className="gap-6">
            {/* Personal Information Section */}
            <View>
              <Text className="text-lg font-semibold text-foreground mb-4">Personal Information</Text>

              <View className="gap-4">
                {/* First Name and Last Name */}
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Controller
                      control={form.control}
                      name="firstName"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormInput
                          label="First Name"
                          placeholder="John"
                          value={value}
                          onChangeText={onChange}
                          autoCapitalize="words"
                          returnKeyType="next"
                          required
                          error={error?.message}
                        />
                      )}
                    />
                  </View>
                  <View className="flex-1">
                    <Controller
                      control={form.control}
                      name="lastName"
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <FormInput
                          label="Last Name"
                          placeholder="Doe"
                          value={value}
                          onChangeText={onChange}
                          autoCapitalize="words"
                          returnKeyType="next"
                          required
                          error={error?.message}
                        />
                      )}
                    />
                  </View>
                </View>

                {/* Email */}
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormInput
                      label="Email"
                      placeholder="john@example.com"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      required
                      error={error?.message}
                    />
                  )}
                />

                {/* Phone Number */}
                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <PhoneInputComponent
                      ref={phoneInputRef}
                      label="Phone Number"
                      value={value}
                      onChangeText={onChange}
                      onChangeFormattedText={(formattedText) => {
                        onChange(formattedText);

                        // Real-time validation
                        if (phoneInputRef.current && formattedText) {
                          const isValidPhone = phoneInputRef.current.isValidNumber(formattedText);
                          if (!isValidPhone && formattedText.length > 5) {
                            form.setError('phone', {
                              type: 'manual',
                              message: 'Please enter a valid phone number for the selected country',
                            });
                          } else {
                            form.clearErrors('phone');
                          }
                        }
                      }}
                      placeholder="Enter phone number"
                      required
                      error={error?.message}
                    />
                  )}
                />

                                 {/* Relation Dropdown */}
                 <Controller
                   control={form.control}
                   name="relation"
                   render={({ field: { onChange, value }, fieldState: { error } }) => (
                     <View>
                       <View className="flex-row items-center mb-2">
                         <Text className="text-sm font-medium text-foreground">
                           Relation to You
                         </Text>
                         <Text className="text-red-500 ml-1">*</Text>
                       </View>

                                               <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <TouchableOpacity
                              className={`flex-row items-center justify-between border border-input bg-background rounded-md px-3 py-3 ${error ? 'border-red-500' : 'focus-within:border-ring'}`}
                            >
                              <Text className={`flex-1 ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {value || 'Select relation'}
                              </Text>
                              <ChevronDown size={16} color="#6B7280" />
                            </TouchableOpacity>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {relationOptions.map((option) => (
                              <DropdownMenuItem
                                key={option.value}
                                onPress={() => onChange(option.value)}
                              >
                                <Text className="text-foreground">{option.label}</Text>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                       {error && (
                         <Text className="text-sm text-red-500 mt-1">{error.message}</Text>
                       )}
                     </View>
                   )}
                 />
              </View>
            </View>

            {/* Status Section */}
            <View>
              <Text className="text-lg font-semibold text-foreground mb-4">Status</Text>

              <Controller
                control={form.control}
                name="isActive"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={value}
                    onCheckedChange={onChange}
                    label="Sub-user is active"
                  />
                )}
              />
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onPress={handleCancel}
          >
            <Text>Cancel</Text>
          </Button>
          <Button
            className="flex-1"
            onPress={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <View className="flex-row items-center gap-2">
              <Check size={20} color={colorScheme === 'dark' ? '#000000' : '#ffffff'} />
              <Text>{isLoading ? 'Creating...' : 'Create Sub-User'}</Text>
            </View>
          </Button>
        </View>
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

export default CreateSubUserForm;
