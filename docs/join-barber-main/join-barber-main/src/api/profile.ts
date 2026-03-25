import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/lib/constants';

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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

// Types for API responses
export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: {
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
      address?: string;
      city?: string;
      postcode?: string;
      country?: string;
    };
  };
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Profile API functions
export const profileAPI = {
  // Get current user profile
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response: AxiosResponse<ProfileResponse> = await apiClient.get('/profile');
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

  // Update profile
  updateProfile: async (profileData: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  }): Promise<ProfileResponse> => {
    try {
      const response: AxiosResponse<ProfileResponse> = await apiClient.put('/profile', profileData);
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

  // Change password
  changePassword: async (passwordData: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<PasswordChangeResponse> => {
    try {
      const response: AxiosResponse<PasswordChangeResponse> = await apiClient.post('/profile/change-password', passwordData);
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
};

export default profileAPI;
