import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/lib/constants';

// Types
export interface Booking {
  id: string;
  shop_id: string;
  shop_name: string;
  service_name: string;
  barber_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'completed' | 'cancelled' | 'no_show' | 'upcoming';
  price: number;
  rating?: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingStats {
  total_bookings: number;
  completed: number;
  cancelled: number;
  no_show: number;
  left_early: number;
}

export interface BookingFilters {
  status?: string;
  shop_name?: string;
  from_date?: string;
  to_date?: string;
}

export interface BookingsResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
}

export interface BookingStatsResponse {
  data: BookingStats;
}

export interface BookingResponse {
  data: Booking;
}

// API Client
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

// API Functions
export const bookingsAPI = {
  // Get booking history with filters
  getBookingHistory: async (filters?: BookingFilters, page: number = 1, limit: number = 10): Promise<BookingsResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.shop_name) params.append('shop_name', filters.shop_name);
      if (filters?.from_date) params.append('from_date', filters.from_date);
      if (filters?.to_date) params.append('to_date', filters.to_date);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await apiClient.get(`/bookings/history?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking history');
    }
  },

  // Get booking statistics
  getBookingStats: async (): Promise<BookingStatsResponse> => {
    try {
      const response = await apiClient.get('/bookings/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking statistics');
    }
  },

  // Get single booking details
  getBooking: async (bookingId: string): Promise<BookingResponse> => {
    try {
      const response = await apiClient.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking details');
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId: string, reason?: string): Promise<BookingResponse> => {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/cancel`, { reason });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  },

  // Reschedule booking
  rescheduleBooking: async (bookingId: string, newDate: string, newTime: string): Promise<BookingResponse> => {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/reschedule`, {
        appointment_date: newDate,
        appointment_time: newTime,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reschedule booking');
    }
  },

  // Rate booking
  rateBooking: async (bookingId: string, rating: number, review?: string): Promise<BookingResponse> => {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/rate`, {
        rating,
        review,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to rate booking');
    }
  },

  // Book again (create new booking based on previous)
  bookAgain: async (bookingId: string, newDate: string, newTime: string): Promise<BookingResponse> => {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/book-again`, {
        appointment_date: newDate,
        appointment_time: newTime,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to book again');
    }
  },
};
