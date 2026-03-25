import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { FormInput } from '@/components/ui-lib/form-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useColorScheme } from '@/lib/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { Store, MapPin, Phone, Mail, Clock, CreditCard } from 'lucide-react-native';
import { shopsAPI } from '@/api/shops';

// Shop registration schema
const shopRegistrationSchema = z.object({
  shop_name: z.string().min(2, 'Shop name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  description: z.string().optional(),
  primary_contact_name: z.string().min(2, 'Contact name must be at least 2 characters'),
  primary_contact_email: z.string().email('Please enter a valid email address'),
  primary_contact_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  avg_service_time: z.string().min(1, 'Average service time is required'),
  payment_methods: z.string().min(1, 'Payment methods are required'),
});

type ShopRegistrationFormData = z.infer<typeof shopRegistrationSchema>;

const ShopRegistrationScreen = () => {
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ShopRegistrationFormData>({
    resolver: zodResolver(shopRegistrationSchema),
    defaultValues: {
      shop_name: '',
      address: '',
      description: '',
      primary_contact_name: '',
      primary_contact_email: '',
      primary_contact_number: '',
      avg_service_time: '',
      payment_methods: '',
    },
  });

  const onSubmit = async (values: ShopRegistrationFormData) => {
    try {
      setIsLoading(true);
      console.log('Shop registration attempt:', values);

      // Call shop registration API
      const response = await shopsAPI.createShop({
        ...values,
        description: values.description || null,
        avg_service_time: parseInt(values.avg_service_time),
        status: 1, // Active status
      });
      
      Alert.alert(
        'Registration Successful',
        'Your barbershop has been registered successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to shop dashboard
              navigation.navigate('Home' as never);
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Shop registration failed:', error);
      Alert.alert('Registration Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center gap-3 mb-2">
            <Store size={24} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />
            <Text className="text-2xl font-bold text-foreground">Register Your Barbershop</Text>
          </View>
          <Text className="text-sm text-muted-foreground">
            Complete your barbershop registration to start managing your business
          </Text>
        </View>

        {/* Registration Form */}
        <Card className="p-6">
          <View className="gap-6">
            {/* Shop Information Section */}
            <View>
              <Text className="text-lg font-semibold text-foreground mb-4">Shop Information</Text>
              
              <View className="gap-4">
                <Controller
                  control={form.control}
                  name="shop_name"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormInput
                      label="Shop Name"
                      placeholder="Elite Barbershop"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
                      returnKeyType="next"
                      required
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name="address"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormInput
                      label="Address"
                      placeholder="123 Main Street, City, State"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
                      returnKeyType="next"
                      required
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormInput
                      label="Description (Optional)"
                      placeholder="Tell customers about your barbershop..."
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={3}
                      returnKeyType="next"
                      error={error?.message}
                    />
                  )}
                />
              </View>
            </View>

            {/* Contact Information Section */}
            <View>
              <Text className="text-lg font-semibold text-foreground mb-4">Contact Information</Text>
              
              <View className="gap-4">
                <Controller
                  control={form.control}
                  name="primary_contact_name"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormInput
                      label="Contact Person Name"
                      placeholder="John Doe"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
                      returnKeyType="next"
                      required
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name="primary_contact_email"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormInput
                      label="Contact Email"
                      placeholder="john@elitebarbershop.com"
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

                <Controller
                  control={form.control}
                  name="primary_contact_number"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormInput
                      label="Contact Phone"
                      placeholder="+1 (555) 123-4567"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      required
                      error={error?.message}
                    />
                  )}
                />
              </View>
            </View>

            {/* Business Information Section */}
            <View>
              <Text className="text-lg font-semibold text-foreground mb-4">Business Information</Text>
              
              <View className="gap-4">
                <Controller
                  control={form.control}
                  name="avg_service_time"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormInput
                      label="Average Service Time (minutes)"
                      placeholder="30"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                      returnKeyType="next"
                      required
                      error={error?.message}
                    />
                  )}
                />

                <Controller
                  control={form.control}
                  name="payment_methods"
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormInput
                      label="Payment Methods"
                      placeholder="Cash, Credit Card, Debit Card"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
                      returnKeyType="done"
                      required
                      error={error?.message}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => navigation.goBack()}
          >
            <Text>Cancel</Text>
          </Button>
          <Button
            className="flex-1"
            onPress={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            <Text>{isLoading ? 'Registering...' : 'Register Shop'}</Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ShopRegistrationScreen;
