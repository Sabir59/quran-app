import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/lib/constants';
import { SignUpFormData, SignInFormData } from '@/features/auth/schema/auth';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await apiClient.post('/auth/refresh', {
            refresh_token: refreshToken,
          });

          if (response.data.success) {
            // Store new tokens
            await AsyncStorage.setItem('auth_token', response.data.data.token);
            if (response.data.data.refresh_token) {
              await AsyncStorage.setItem('refresh_token', response.data.data.refresh_token);
            }

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }

      // If refresh fails, clear storage and redirect to login
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user_data']);
    }
    return Promise.reject(error);
  }
);

// Types for API responses
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      full_name: string;
      email: string;
      phone: string | null;
      active: boolean;
      roles: string[];
      primary_role: string;
      created_at: string;
      updated_at: string;
    };
    token: string;
    token_type: string;
    refresh_token?: string;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Auth API functions
export const authAPI = {
  // Register user
  register: async (userData: SignUpFormData): Promise<AuthResponse> => {
    try {
      const payload = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
        role: userData.accountType,
      };



      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/register', payload);
      
      if (response.data.success) {
        // Store token, refresh token, and user data
        await AsyncStorage.setItem('auth_token', response.data.data.token);
        if (response.data.data.refresh_token) {
          await AsyncStorage.setItem('refresh_token', response.data.data.refresh_token);
        }
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw {
        success: false,
        message: 'Network error occurred. Please try again.',
      } as ApiError;
    }
  },

  // Login user
  login: async (credentials: SignInFormData): Promise<AuthResponse> => {
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
      };



      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/login', payload);
      
      if (response.data.success) {
        // Store token, refresh token, and user data
        await AsyncStorage.setItem('auth_token', response.data.data.token);
        if (response.data.data.refresh_token) {
          await AsyncStorage.setItem('refresh_token', response.data.data.refresh_token);
        }
        await AsyncStorage.setItem('user_data', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ApiError;
      }
      throw {
        success: false,
        message: 'Network error occurred. Please try again.',
      } as ApiError;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.warn('Logout API call failed, but clearing local storage');
    } finally {
      // Always clear local storage
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user_data']);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/user');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // User not authenticated, clear storage
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');
      }
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return !!token;
    } catch {
      return false;
    }
  },

  // Get stored user data
  getStoredUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  // Get stored token
  getStoredToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch {
      return null;
    }
  },

  // Refresh token
  refresh: async (): Promise<AuthResponse> => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (response.data.success) {
        // Store new tokens
        await AsyncStorage.setItem('auth_token', response.data.data.token);
        if (response.data.data.refresh_token) {
          await AsyncStorage.setItem('refresh_token', response.data.data.refresh_token);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens on refresh failure
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user_data']);
      throw error;
    }
  },


};

export default authAPI;
