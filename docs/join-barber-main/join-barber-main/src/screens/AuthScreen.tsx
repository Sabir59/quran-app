import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AuthContainer from '../features/auth/AuthContainer';
import { useAuth } from '@/contexts/AuthContext';

const AuthScreen = () => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  // Redirect to Home if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' as never }],
      });
    }
  }, [isAuthenticated, navigation]);

  // Don't render auth screen if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthContainer />
  );
};

export default AuthScreen;