import React, { useRef, useState } from 'react';
import { View, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { PhoneInputComponent, PhoneInputRef } from './phone-input';

const PhoneInputTest = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [isValid, setIsValid] = useState(false);
  const phoneInputRef = useRef<PhoneInputRef>(null);

  const handleValidatePhone = () => {
    if (phoneInputRef.current && phoneNumber) {
      const valid = phoneInputRef.current.isValidNumber(phoneNumber);
      setIsValid(valid);
      
      if (valid) {
        const countryCode = phoneInputRef.current.getCountryCode();
        const callingCode = phoneInputRef.current.getCallingCode();
        const numberInfo = phoneInputRef.current.getNumberAfterPossiblyEliminatingZero();
        
        Alert.alert(
          'Phone Number Valid!',
          `Country: ${countryCode}\nCalling Code: +${callingCode}\nNumber: ${numberInfo.formattedNumber}`
        );
      } else {
        Alert.alert('Invalid Phone Number', 'Please enter a valid phone number for the selected country.');
      }
    }
  };

  return (
    <View className="p-4 gap-4">
      <Text className="text-lg font-bold">Phone Input Test</Text>
      
      <PhoneInputComponent
        ref={phoneInputRef}
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        onChangeFormattedText={setFormattedPhone}
        placeholder="Enter your phone number"
        required
        defaultCode="PK"
      />
      
      <View className="gap-2">
        <Text>Raw Value: {phoneNumber}</Text>
        <Text>Formatted Value: {formattedPhone}</Text>
        <Text>Valid: {isValid ? 'Yes' : 'No'}</Text>
      </View>
      
      <Button onPress={handleValidatePhone} disabled={!phoneNumber}>
        <Text>Validate Phone Number</Text>
      </Button>
    </View>
  );
};

export default PhoneInputTest;
