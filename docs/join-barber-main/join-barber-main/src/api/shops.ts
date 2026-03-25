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
export interface ShopService {
  id: number;
  name: string;
  detail: string | null;
  price: number;
  time: number;
  status: boolean;
}

export interface OpeningHour {
  day: string;
  on: boolean;
  start_time: string;
  end_time: string;
}

export interface Shop {
  id: number;
  shop_name: string;
  address: string;
  description: string | null;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_number: string;
  avg_service_time: number;
  payment_methods: string;
  status: number;
  created_at: string;
  updated_at: string;
  services: ShopService[];
  opening_hours: OpeningHour[];
}

export interface ShopsResponse {
  success: boolean;
  message: string;
  data: Shop[];
}

export interface ShopResponse {
  success: boolean;
  message: string;
  data: Shop;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Shops API functions
export const shopsAPI = {
  // Get all shops
  getAllShops: async (): Promise<ShopsResponse> => {
    try {
      const response: AxiosResponse<ShopsResponse> = await apiClient.get('/shops');
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

  // Get shop details
  getShopDetails: async (shopId: number): Promise<ShopsResponse> => {
    try {
      const response: AxiosResponse<ShopsResponse> = await apiClient.get(`/shops/?id=${shopId}`);
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

  // Get my shops (for shop owners)
  getMyShops: async (): Promise<ShopsResponse> => {
    try {
      const response: AxiosResponse<ShopsResponse> = await apiClient.get('/my-shops');
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

  // Create new shop
  createShop: async (shopData: Omit<Shop, 'id' | 'created_at' | 'updated_at' | 'services' | 'opening_hours'>): Promise<ShopResponse> => {
    try {
      const response: AxiosResponse<ShopResponse> = await apiClient.post('/shops', shopData);
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

export default shopsAPI;
