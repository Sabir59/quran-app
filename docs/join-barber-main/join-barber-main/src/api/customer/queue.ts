import axios from 'axios';
import { API_CONFIG } from '@/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface QueueItem {
  id: string;
  shop_id: string;
  shop_name: string;
  location: string;
  position: number;
  estimated_wait_time: string;
  joined_at: string;
  status: 'waiting' | 'next' | 'in_service' | 'completed' | 'left';
  service_name?: string;
  barber_name?: string;
  created_at: string;
  updated_at: string;
}

export interface QueueStats {
  total_in_queue: number;
  average_wait_time: string;
  estimated_completion: string;
}

export interface QueueResponse {
  data: QueueItem;
}

export interface QueueStatsResponse {
  data: QueueStats;
}

// API Client
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Add auth interceptor
apiClient.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Functions
export const queueAPI = {
  // Get current user's queue status
  getMyQueueStatus: async (): Promise<QueueResponse> => {
    try {
      const response = await apiClient.get('/queue/my-status');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch queue status');
    }
  },

  // Get queue statistics
  getQueueStats: async (shopId: string): Promise<QueueStatsResponse> => {
    try {
      const response = await apiClient.get(`/queue/${shopId}/stats`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch queue statistics');
    }
  },

  // Join queue
  joinQueue: async (shopId: string, serviceId?: string): Promise<QueueResponse> => {
    try {
      const response = await apiClient.post('/queue/join', {
        shop_id: shopId,
        service_id: serviceId,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to join queue');
    }
  },

  // Leave queue
  leaveQueue: async (queueId: string, reason?: string): Promise<QueueResponse> => {
    try {
      const response = await apiClient.post(`/queue/${queueId}/leave`, { reason });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to leave queue');
    }
  },

  // Update queue position (if user wants to move up/down)
  updateQueuePosition: async (queueId: string, newPosition: number): Promise<QueueResponse> => {
    try {
      const response = await apiClient.put(`/queue/${queueId}/position`, {
        position: newPosition,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update queue position');
    }
  },

  // Get queue history
  getQueueHistory: async (page: number = 1, limit: number = 10): Promise<{ data: QueueItem[]; total: number }> => {
    try {
      const response = await apiClient.get(`/queue/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch queue history');
    }
  },

  // Notify when ready (for barber to call customer)
  notifyReady: async (queueId: string): Promise<QueueResponse> => {
    try {
      const response = await apiClient.post(`/queue/${queueId}/notify-ready`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to notify ready');
    }
  },
};
