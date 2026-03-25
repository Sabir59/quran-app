import { View } from 'react-native'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

export default function FormSwitch() {
  return (
    <View className='flex-row gap-2'>
      <Button className='flex-1'>
        <Text>Sign In</Text>
      </Button>
      <Button className='flex-1'>
        <Text>Sign Up</Text>
      </Button>
    </View>
  )
}