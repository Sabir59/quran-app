import React from 'react';
import { Alert, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { FormInput } from '@/components/ui-lib/form-input';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInFormData } from './schema/auth';
import { authAPI, ApiError } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onAuthSuccess?: () => void;
}

const SignInForm = ({ onSwitchToSignUp, onAuthSuccess }: SignInFormProps) => {
  const { login } = useAuth();
  
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (values: SignInFormData) => {
    try {
      setIsLoading(true);
      console.log('Login attempt:', values);
      
      await login(values.email, values.password);
      console.log('Login successful');
      
      onAuthSuccess?.();
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Handle API errors
      if (error.errors) {
        // Handle field-specific errors
        Object.keys(error.errors).forEach((field) => {
          const fieldName = field as keyof SignInFormData;
          if (form.getFieldState(fieldName)) {
            form.setError(fieldName, {
              type: 'server',
              message: error.errors[field][0],
            });
          }
        });
      } else {
        // Handle general error
        Alert.alert('Login Failed', error.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-full gap-6">
      <Controller
        control={form.control}
        name="email"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormInput
            label='Email'
            placeholder="Enter your email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            error={error?.message}
          />
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormInput
            label='Password'
            forgotPasswordText='Forgot password?'
            onForgotPassword={() => {}}
            placeholder="Enter your password"
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
        <Text>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
      </Button>

      <View className='flex-row items-center justify-center gap-1'>
        <Text className='text-muted-foreground'>© 2025 Barber Queue. All rights reserved.</Text>
      </View>
      
    </View>
  );
};

export default SignInForm;