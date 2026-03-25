import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useEffect } from 'react';

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
  
  return {
    colorScheme,
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
  };
}