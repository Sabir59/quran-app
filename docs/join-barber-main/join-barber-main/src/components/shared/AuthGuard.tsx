import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback, 
  requireAuth = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-foreground">Loading...</Text>
      </View>
    );
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground text-lg">Please log in to continue</Text>
      </View>
    );
  }

  // If authentication is not required and user is authenticated (e.g., prevent logged-in users from accessing login page)
  if (!requireAuth && isAuthenticated) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-foreground text-lg">You are already logged in</Text>
      </View>
    );
  }

  // User is authenticated and can access the protected content
  return <>{children}</>;
};

export default AuthGuard;
