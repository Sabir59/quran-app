import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { colorScheme, toggleColorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 w-8 h-8 items-center justify-center ${className}`}
      activeOpacity={0.7}
    >
      {isDarkColorScheme ? (
        <Sun size={20} color="#fbbf24" />
      ) : (
        <Moon size={20} color="#374151" />
      )}
    </TouchableOpacity>
  );
}
