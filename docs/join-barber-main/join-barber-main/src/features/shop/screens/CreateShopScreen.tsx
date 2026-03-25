import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui-lib/form-input';
import { PhoneInputComponent } from '@/components/ui-lib/phone-input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useColorScheme } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Store, ChevronDown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Step configuration
const STEPS = [
  { id: 'details', title: 'Details', icon: Store },
  { id: 'hours', title: 'Hours', icon: Store },
  { id: 'services', title: 'Services', icon: Store },
  { id: 'barbers', title: 'Barbers', icon: Store },
];

// Dropdown options
const countryOptions = [
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
];

const currencyOptions = [
  { value: 'GBP', label: 'GBP (£) - British Pound' },
  { value: 'USD', label: 'USD ($) - US Dollar' },
  { value: 'CAD', label: 'CAD ($) - Canadian Dollar' },
  { value: 'AUD', label: 'AUD ($) - Australian Dollar' },
];

const timezoneOptions = [
  { value: 'Europe/London', label: 'London +00:00' },
  { value: 'America/New_York', label: 'New York -05:00' },
  { value: 'America/Toronto', label: 'Toronto -05:00' },
  { value: 'Australia/Sydney', label: 'Sydney +10:00' },
];

const paymentMethodOptions = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'digital', label: 'Digital Payment' },
  { value: 'all', label: 'All Methods' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const CreateShopScreen = () => {
  const { colorScheme } = useColorScheme();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState('details');
  const insets = useSafeAreaInsets();

  // Form state
  const [formData, setFormData] = useState({
    shopName: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactNumber: '',
    avgServiceTime: '30',
    postalCode: '',
    country: 'GB',
    currency: 'GBP',
    timezone: 'Europe/London',
    address: '',
    paymentMethods: '',
    status: 'active',
    description: '',
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'details') {
      if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
      if (!formData.primaryContactName.trim()) newErrors.primaryContactName = 'Contact name is required';
      if (!formData.primaryContactEmail.trim()) newErrors.primaryContactEmail = 'Contact email is required';
      if (!formData.primaryContactNumber.trim()) newErrors.primaryContactNumber = 'Contact number is required';
      if (!formData.avgServiceTime.trim()) newErrors.avgServiceTime = 'Service time is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.currency) newErrors.currency = 'Currency is required';
      if (!formData.timezone) newErrors.timezone = 'Timezone is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.paymentMethods) newErrors.paymentMethods = 'Payment methods are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateCurrentStep()) {
      const currentIndex = STEPS.findIndex(step => step.id === currentStep);
      if (currentIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[currentIndex + 1].id);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigation.goBack();
  };

  // Render dropdown component
  const renderDropdown = (
    label: string,
    value: string,
    options: Array<{ value: string; label: string }>,
    field: string,
    required = false
  ) => (
    <View>
      <View className="flex-row items-center mb-2">
        <Text className="text-sm font-medium text-foreground">{label}</Text>
        {required && <Text className="text-red-500 ml-1">*</Text>}
      </View>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TouchableOpacity
            className={`flex-row items-center justify-between border border-input bg-background rounded-md px-3 py-3 ${errors[field] ? 'border-red-500' : 'border-border'}`}
            activeOpacity={0.7}
          >
            <Text className={`flex-1 ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
              {value ? options.find(opt => opt.value === value)?.label || 'Select option' : 'Select option'}
            </Text>
            <ChevronDown size={16} color="#6B7280" />
          </TouchableOpacity>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          portalHost="root"
          side="bottom"
          align="start"
          className="w-56"
          insets={{
            top: insets.top,
            bottom: insets.bottom,
            left: 12,
            right: 12,
          }}
        >
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onPress={() => handleFieldChange(field, option.value)}
            >
              <Text className="text-foreground">{option.label}</Text>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {errors[field] && (
        <Text className="text-sm text-red-500 mt-1">{errors[field]}</Text>
      )}
    </View>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return (
          <Card className="p-6">
            <View className="gap-6">
              {/* Basic Information Header */}
              <View className="flex-row items-center gap-3">
                <Store size={20} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />
                <Text className="text-lg font-semibold text-foreground">Basic Information</Text>
              </View>

              <View className="gap-4">
                {/* Shop Name */}
                <FormInput
                  label="Shop Name"
                  placeholder="Enter your shop name"
                  value={formData.shopName}
                  onChangeText={(value) => handleFieldChange('shopName', value)}
                  autoCapitalize="words"
                  returnKeyType="next"
                  required
                  error={errors.shopName}
                />

                {/* Primary Contact Name */}
                <FormInput
                  label="Primary Contact Name"
                  placeholder="Enter contact person name"
                  value={formData.primaryContactName}
                  onChangeText={(value) => handleFieldChange('primaryContactName', value)}
                  autoCapitalize="words"
                  returnKeyType="next"
                  required
                  error={errors.primaryContactName}
                />

                {/* Primary Contact Email */}
                <FormInput
                  label="Primary Contact Email"
                  placeholder="Enter contact email"
                  value={formData.primaryContactEmail}
                  onChangeText={(value) => handleFieldChange('primaryContactEmail', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  required
                  error={errors.primaryContactEmail}
                />

                {/* Primary Contact Number */}
                <PhoneInputComponent
                  label="Primary Contact Number"
                  value={formData.primaryContactNumber}
                  onChangeText={(value) => handleFieldChange('primaryContactNumber', value)}
                  placeholder="Enter phone number"
                  required
                  error={errors.primaryContactNumber}
                />

                {/* Average Service Time */}
                <FormInput
                  label="Average Service Time (minutes)"
                  placeholder="30"
                  value={formData.avgServiceTime}
                  onChangeText={(value) => handleFieldChange('avgServiceTime', value)}
                  keyboardType="numeric"
                  returnKeyType="next"
                  required
                  error={errors.avgServiceTime}
                />

                {/* Postal Code */}
                <FormInput
                  label="Postal Code"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChangeText={(value) => handleFieldChange('postalCode', value)}
                  autoCapitalize="characters"
                  returnKeyType="next"
                />

                {/* Country */}
                {renderDropdown('Country', formData.country, countryOptions, 'country', true)}

                {/* Currency */}
                {renderDropdown('Currency', formData.currency, currencyOptions, 'currency', true)}

                {/* Timezone */}
                {renderDropdown('Timezone', formData.timezone, timezoneOptions, 'timezone', true)}

                {/* Address */}
                <FormInput
                  label="Address"
                  placeholder="Address"
                  value={formData.address}
                  onChangeText={(value) => handleFieldChange('address', value)}
                  autoCapitalize="words"
                  returnKeyType="next"
                  required
                  error={errors.address}
                />

                {/* Payment Methods */}
                {renderDropdown('Payment Methods', formData.paymentMethods, paymentMethodOptions, 'paymentMethods', true)}

                {/* Status */}
                {renderDropdown('Status', formData.status, statusOptions, 'status')}

                {/* Description */}
                <FormInput
                  label="Description"
                  placeholder="Describe your shop (services, specialties, etc.)"
                  value={formData.description}
                  onChangeText={(value) => handleFieldChange('description', value)}
                  multiline
                  numberOfLines={3}
                  returnKeyType="next"
                />
              </View>
            </View>
          </Card>
        );

      case 'hours':
        return (
          <Card className="p-6">
            <Text className="text-lg font-semibold text-foreground mb-4">Opening Hours</Text>
            <Text className="text-muted-foreground">Opening hours configuration coming soon...</Text>
          </Card>
        );

      case 'services':
        return (
          <Card className="p-6">
            <Text className="text-lg font-semibold text-foreground mb-4">Services</Text>
            <Text className="text-muted-foreground">Services configuration coming soon...</Text>
          </Card>
        );

      case 'barbers':
        return (
          <Card className="p-6">
            <Text className="text-lg font-semibold text-foreground mb-4">Barbers</Text>
            <Text className="text-muted-foreground">Barber management coming soon...</Text>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Header */}
        {/* Back Button */}
        <TouchableOpacity
          className="flex-row items-center gap-2 mb-6"
          onPress={handleCancel}
        >
          <ArrowLeft size={16} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />
          <Text className='font-semibold text-lg'>Back</Text>
        </TouchableOpacity>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">Create New Shop</Text>
          <Text className="text-muted-foreground mt-1">
            Set up your barbershop details and opening hours
          </Text>
        </View>


        {/* Step Navigation */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            <View className="flex-row gap-4 px-6">
              {STEPS.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = STEPS.findIndex(s => s.id === currentStep) > index;

                return (
                  <TouchableOpacity
                    key={step.id}
                    onPress={() => setCurrentStep(step.id)}
                    className={`py-3 px-4 border-b-2 ${isActive
                        ? 'border-primary'
                        : isCompleted
                          ? 'border-green-500'
                          : 'border-transparent'
                      }`}
                  >
                    <Text
                      className={`text-sm font-medium whitespace-nowrap ${isActive
                          ? 'text-primary'
                          : isCompleted
                            ? 'text-green-600'
                            : 'text-muted-foreground'
                        }`}
                    >
                      {step.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Step Content */}
        {renderStepContent()}

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
            onPress={handleNext}
          >
            <Text>
              {currentStep === 'barbers' ? 'Create Shop' : 'Next'}
            </Text>
          </Button>
        </View>

        {/* Footer */}
        <View className="items-center py-4">
          <Text className="text-sm text-muted-foreground">
            © 2025 Join Barber. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateShopScreen;
