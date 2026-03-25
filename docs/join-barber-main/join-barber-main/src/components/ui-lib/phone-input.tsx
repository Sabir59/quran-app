import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import PhoneInput, {
  isValidPhoneNumber,
  ICountry,
} from 'react-native-international-phone-number';
import { Text } from '@/components/ui/text';
import { useColorScheme } from 'nativewind';
import { cn } from '@/lib/utils';

export interface PhoneInputProps {
  label?: string;
  required?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  onChangeFormattedText?: (text: string) => void;
  onCountryChange?: (country: ICountry) => void;
  defaultCode?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export interface PhoneInputRef {
  isValidNumber: (number: string) => boolean;
  getCountryCode: () => string;
  getCallingCode: () => string;
  getNumberAfterPossiblyEliminatingZero: () => { number: string; formattedNumber: string };
}

const PhoneInputComponent = forwardRef<PhoneInputRef, PhoneInputProps>(({
  label,
  required = false,
  value = '',
  onChangeText,
  onChangeFormattedText,
  onCountryChange,
  defaultCode = 'US',
  placeholder = 'Enter phone number',
  error,
  disabled = false,
  autoFocus = false,
  containerClassName,
  labelClassName,
  errorClassName,
}, ref) => {
  const { colorScheme } = useColorScheme();
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

  useImperativeHandle(ref, () => ({
    isValidNumber: (number: string) => {
      return selectedCountry ? isValidPhoneNumber(number, selectedCountry) : false;
    },
    getCountryCode: () => {
      return selectedCountry?.cca2 || '';
    },
    getCallingCode: () => {
      return selectedCountry?.idd?.root || '';
    },
    getNumberAfterPossiblyEliminatingZero: () => {
      return { number: value, formattedNumber: value };
    },
  }));

  const handleInputValue = (phoneNumber: string) => {
    onChangeText?.(phoneNumber);
    onChangeFormattedText?.(phoneNumber);
  };

  const handleSelectedCountry = (country: ICountry) => {
    setSelectedCountry(country);
    onCountryChange?.(country);
  };

  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <View className="flex-row items-center mb-2">
          <Text className={cn('text-sm font-medium text-foreground', labelClassName)}>
            {label}
          </Text>
          {required && <Text className="text-red-500 ml-1">*</Text>}
        </View>
      )}


      <PhoneInput
        value={value}
        selectedCountry={selectedCountry}
        onChangePhoneNumber={handleInputValue}
        onChangeSelectedCountry={handleSelectedCountry}
        defaultCountry={defaultCode as any}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        phoneInputStyles={{
          container: {
            backgroundColor: 'transparent',
            borderBottomWidth: 1,
            borderBottomColor: 'gray',
          },
           flagContainer: {
            backgroundColor: 'transparent',
            paddingHorizontal:6
          },
          input:{
            paddingLeft:0
          }
        }}
      />

      {error && (
        <Text className={cn('text-sm text-red-500 mt-1', errorClassName)}>
          {error}
        </Text>
      )}
    </View>
  );
});

PhoneInputComponent.displayName = 'PhoneInputComponent';

export { PhoneInputComponent };
