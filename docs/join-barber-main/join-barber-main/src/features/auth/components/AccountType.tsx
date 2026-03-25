import { TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text';

interface AccountTypeProps {
  title: string;
  description: string;
  onPress: () => void;
  icon: React.ReactNode;
  isSelected?: boolean;
  disabled?: boolean;
}

const AccountType = ({ title, description, onPress, icon, isSelected = false, disabled = false }: AccountTypeProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      className={`flex-row items-center gap-5 border rounded-lg py-4 px-3 ${
        disabled 
          ? 'border-gray-300 bg-gray-100 dark:bg-gray-800 opacity-50' 
          : isSelected 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-200'
      }`}
    >
        <View className='w-8 h-8 rounded-full items-center justify-center'>
            {icon}
        </View>
      <View className='flex-1'>
        <Text className='text-lg font-bold'>{title}</Text>
        <Text className='text-base text-muted-foreground'>{description}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default AccountType