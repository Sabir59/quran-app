import React, { forwardRef } from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

export interface FormInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  error?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  forgotPasswordText?: string;
  onForgotPassword?: () => void;
}

const FormInput = forwardRef<TextInput, FormInputProps>(({
  label,
  forgotPasswordText,
  onForgotPassword,
  required = false,
  icon,
  rightIcon,
  onRightIconPress,
  error,
  className,
  containerClassName,
  labelClassName,
  errorClassName,
  ...props
}, ref) => {
  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <View className="flex-row items-center mb-2">
          <Text className={cn('text-sm font-medium text-foreground', labelClassName)}>
            {label}
          </Text>
          {required && (
            <Text className="text-red-500 ml-1">*</Text>
          )}
          {forgotPasswordText && (
            <Text className="text-muted-foreground ml-auto" onPress={onForgotPassword}>
              {forgotPasswordText}
            </Text>
          )}
        </View>
      )}
      
      <View className={cn(
        'flex-row items-center border border-input bg-background rounded-md px-3 py-1',
        'focus-within:border-ring',
        error && 'border-red-500',
        className
      )}>
        {icon && (
          <View className="mr-3">
            {icon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          className="flex-1 text-foreground placeholder:text-muted-foreground"
          placeholderTextColor="#6b7280"
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            className="ml-3"
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className={cn('text-sm text-red-500 mt-1', errorClassName)}>
          {error}
        </Text>
      )}
    </View>
  );
});

FormInput.displayName = 'FormInput';

export { FormInput };