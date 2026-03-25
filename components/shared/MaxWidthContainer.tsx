import { View, Text } from 'react-native'
import React from 'react'

const MaxWidthWrapper = ({
  children,
  classNames = ''
}: {
  children: React.ReactNode;
  classNames?: string;
}) => {
  return (
    <View className={`w-full mx-auto px-5 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1200px] 2xl:max-w-[1400px] ${classNames}`}>
      {children}
    </View>
  )
}

export default MaxWidthWrapper