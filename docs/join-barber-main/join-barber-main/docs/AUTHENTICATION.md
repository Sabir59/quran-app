# Authentication System Documentation

## Overview

This document describes the comprehensive authentication system implemented in the React Native application. The system provides secure user registration, login, role-based access control, and token management.

## Architecture

### Core Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Global authentication state management
   - Provides authentication methods to the entire app
   - Handles token persistence and user data

2. **Auth API** (`src/api/auth.ts`)
   - Axios-based API client with interceptors
   - Handles all authentication-related API calls
   - Implements automatic token refresh

3. **Form Validation** (`src/features/auth/schema/auth.ts`)
   - Zod schemas for form validation
   - Type-safe form data handling
   - Real-time validation feedback

4. **UI Components**
   - `SignUpForm.tsx` - User registration with role selection
   - `SignInForm.tsx` - User login
   - `AuthContainer.tsx` - Tabbed authentication interface
   - `PhoneInputComponent.tsx` - International phone number input

## Features

### 1. User Registration
- **Multi-step form** with validation
- **Role selection** (Customer, Shop Owner, Barber, Admin)
- **Phone number validation** with country codes
- **Password confirmation** with strength requirements
- **Real-time validation** with error messages

### 2. User Login
- **Email/password authentication**
- **Remember me functionality**
- **Error handling** for invalid credentials
- **Automatic redirection** based on user role

### 3. Token Management
- **JWT token storage** in AsyncStorage
- **Automatic token refresh** on 401 errors
- **Token expiration handling**
- **Secure token transmission** via Authorization headers

### 4. Role-Based Access Control
- **Dynamic navigation** based on user role
- **Protected routes** with authentication guards
- **Role-specific dashboards**
- **Permission-based UI rendering**

### 5. Security Features
- **Password hashing** (handled by backend)
- **HTTPS communication** with API
- **Token-based session management**
- **Automatic logout** on token expiration

## API Integration

### Base Configuration
```typescript
API_CONFIG = {
  BASE_URL: 'https://joinbarber.com/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
}
```

### Endpoints

#### Registration
```typescript
POST /auth/register
{
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  password: string,
  password_confirmation: string,
  role: "Customer" | "Shop" | "Admin" | "Barber"
}
```

#### Login
```typescript
POST /auth/login
{
  email: string,
  password: string
}
```

#### Token Refresh
```typescript
POST /auth/refresh
{
  refresh_token: string
}
```

#### Logout
```typescript
POST /auth/logout
Authorization: Bearer <token>
```

## Usage Examples

### Protecting a Component
```typescript
import AuthGuard from '@/components/shared/AuthGuard';

const ProtectedComponent = () => {
  return (
    <AuthGuard>
      <View>
        <Text>This content is only visible to authenticated users</Text>
      </View>
    </AuthGuard>
  );
};
```

### Using Authentication Context
```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>Welcome, {user?.first_name}!</Text>
      ) : (
        <Button onPress={handleLogin} title="Login" />
      )}
    </View>
  );
};
```

### Form Validation
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/features/auth/schema/auth';

const SignUpForm = () => {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      accountType: '',
    },
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

## Error Handling

### API Error Response Format
```typescript
interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
```

### Common Error Scenarios
1. **Network errors** - Automatic retry with exponential backoff
2. **Validation errors** - Displayed inline with form fields
3. **Authentication errors** - Automatic token refresh or logout
4. **Server errors** - User-friendly error messages

## Testing

### Unit Tests
- Form validation schemas
- Authentication context methods
- API client functions

### Integration Tests
- End-to-end authentication flow
- Role-based navigation
- Token refresh mechanism

### Manual Testing Checklist
- [ ] User registration with all roles
- [ ] Login with valid/invalid credentials
- [ ] Token refresh on expiration
- [ ] Role-based dashboard access
- [ ] Logout functionality
- [ ] Phone number validation
- [ ] Form validation messages

## Security Considerations

### Best Practices
1. **Never store sensitive data** in plain text
2. **Use HTTPS** for all API communications
3. **Implement proper token expiration**
4. **Validate all user inputs**
5. **Handle authentication errors gracefully**

### Token Security
- **Access tokens** expire after 1 hour
- **Refresh tokens** expire after 30 days
- **Automatic token rotation** on refresh
- **Secure token storage** in AsyncStorage

## Troubleshooting

### Common Issues

#### Token Refresh Fails
```typescript
// Check if refresh token exists
const refreshToken = await AsyncStorage.getItem('refresh_token');
if (!refreshToken) {
  // Redirect to login
  await logout();
}
```

#### Form Validation Errors
```typescript
// Check form errors
const errors = form.formState.errors;
if (errors.email) {
  console.log('Email error:', errors.email.message);
}
```

#### API Connection Issues
```typescript
// Check network connectivity
if (!response.data) {
  throw new Error('Network error occurred. Please try again.');
}
```

## Future Enhancements

### Planned Features
1. **Biometric authentication** (fingerprint/face ID)
2. **Two-factor authentication** (2FA)
3. **Social login** (Google, Facebook)
4. **Password reset** functionality
5. **Account verification** via email/SMS

### Performance Optimizations
1. **Token caching** in memory
2. **Request batching** for multiple API calls
3. **Offline authentication** support
4. **Background token refresh**

## Dependencies

### Required Packages
```json
{
  "@hookform/resolvers": "^3.3.2",
  "@react-native-async-storage/async-storage": "^1.19.3",
  "axios": "^1.6.2",
  "react-hook-form": "^7.48.2",
  "react-native-phone-number-input": "^1.1.0",
  "zod": "^3.22.4"
}
```

### Optional Packages
```json
{
  "react-native-biometrics": "^3.0.1",
  "react-native-keychain": "^8.1.3"
}
```

## Support

For authentication-related issues or questions:
1. Check this documentation
2. Review the API documentation
3. Check the console for error messages
4. Verify network connectivity
5. Contact the development team

---

*Last updated: January 2025*
