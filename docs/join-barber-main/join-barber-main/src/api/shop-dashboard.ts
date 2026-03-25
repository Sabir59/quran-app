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
export interface ShopDashboardMetrics {
  total_shops: number;
  open_shops: number;
  closed_shops: number;
  total_barbers: number;
  people_waiting: number;
}

export interface ShopDashboardResponse {
  success: boolean;
  message: string;
  data: ShopDashboardMetrics;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Shop Dashboard API functions
export const shopDashboardAPI = {
  // Get shop dashboard metrics
  getDashboardMetrics: async (): Promise<ShopDashboardResponse> => {
    try {
      const response: AxiosResponse<ShopDashboardResponse> = await apiClient.get('/shop/dashboard/metrics');
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

  // Get shop dashboard overview
  getDashboardOverview: async (): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await apiClient.get('/shop/dashboard/overview');
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

export default shopDashboardAPI;
