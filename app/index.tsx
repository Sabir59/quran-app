import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const TEAL = '#12C4BE';

/**
 * Entry point — decides where to send the user based on auth state.
 *
 * 'initializing' → teal loading screen (session check in progress)
 * 'authenticated' | 'guest' → home
 * 'unauthenticated' → login
 *
 * AuthGuard in _layout.tsx handles all subsequent navigation changes
 * (e.g. user logs out from a main screen → redirected back to login).
 */
export default function Index() {
  const { status } = useAuth();

  if (status === 'initializing') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (status === 'authenticated' || status === 'guest') {
    return <Redirect href="/(main)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
