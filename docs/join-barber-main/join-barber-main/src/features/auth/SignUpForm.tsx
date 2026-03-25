import React, { useRef } from 'react';
import { Alert, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { FormInput } from '@/components/ui-lib/form-input';
import { Button } from '@/components/ui/button';
import AccountType from './components/AccountType';
import { Scissors, Store, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpFormData } from './schema/auth';
import { authAPI, ApiError } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';
import { PhoneInputComponent, PhoneInputRef } from '@/components/ui-lib/phone-input';
import { Card } from '@/components/ui/card';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onAuthSuccess?: () => void;
}

const SignUpForm = ({ onSwitchToSignIn, onAuthSuccess }: SignUpFormProps) => {
  const { colorScheme } = useColorScheme();
  const { register } = useAuth();
  const phoneInputRef = useRef<PhoneInputRef>(null);
  
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      accountType: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (values: SignUpFormData) => {
    try {
      setIsLoading(true);
      console.log('Sign up attempt:', values);
      

      
      await register(values);
      console.log('Registration successful');
      
      onAuthSuccess?.();
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Handle API errors
      if (error.errors) {
        // Handle field-specific errors
        Object.keys(error.errors).forEach((field) => {
          const fieldName = field as keyof SignUpFormData;
          if (form.getFieldState(fieldName)) {
            form.setError(fieldName, {
              type: 'server',
              message: error.errors[field][0],
            });
          }
        });
      } else {
        // Handle general error
        Alert.alert('Registration Failed', error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-full gap-6">
      <View className='flex-row gap-4'>
        <View className='flex-1'>
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
        <View className='flex-1'>
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

      <Controller
        control={form.control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormInput
            label='Email'
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

      <Controller
        control={form.control}
        name="phone"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <PhoneInputComponent
            ref={phoneInputRef}
            label="Phone Number"
            value={value}
            onChangeText={onChange}
            onChangeFormattedText={onChange}
            placeholder="Enter your phone number"
            required
            error={error?.message}
          />
        )}
      />

      <Controller
        control={form.control}
        name="accountType"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className='gap-4'>
            <AccountType
              icon={<User size={32} color={colorScheme === 'dark' ? 'white' : 'black'} />}
              title='Customer'
              description='join queues at barber'
              isSelected={value === 'Customer'}
              onPress={() => onChange('Customer')}
            />
            <AccountType
              icon={<Store size={32} color={colorScheme === 'dark' ? 'white' : 'black'} />}
              title='Shop Owner'
              description='Manage your barbershop and queues'
              isSelected={value === 'Shop'}
              onPress={() => onChange('Shop')}
            />
            <AccountType
              icon={<Scissors size={32} color={colorScheme === 'dark' ? 'white' : 'black'} />}
              title='Barber'
              description='Work at a barbershop and serve customers'
              isSelected={value === 'Barber'}
              onPress={() => onChange('Barber')}
            />
            {error && (
              <Text className="text-sm text-red-500 mt-1">{error.message}</Text>
            )}
          </View>
        )}
      />
      
      <Controller
        control={form.control}
        name="password"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormInput
            label='Password'
            placeholder="********"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            returnKeyType="next"
            error={error?.message}
          />
        )}
      />
      
      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormInput
            label='Confirm Password'
            placeholder="********"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={form.handleSubmit(onSubmit)}
            error={error?.message}
          />
        )}
      />
      
      <Button 
        className='w-full mt-4' 
        size='lg' 
        onPress={form.handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <Text>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
      </Button>
      <View className='flex-row items-center justify-center gap-1'>
        <Text className='text-muted-foreground'>© 2025 Barber Queue. All rights reserved.</Text>
      </View>
    </View>
  );
};

export default SignUpForm;