import axios from "axios";
import { API_CONFIG } from "@/lib/constants";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Types for sub-user operations
export interface SubUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  relation: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSubUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  relation: string;
  is_active: boolean;
}

export interface UpdateSubUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  relation?: string;
  is_active?: boolean;
}

export interface SubUsersResponse {
  data: SubUser[];
  message: string;
}

export interface SubUserResponse {
  data: SubUser;
  message: string;
}

// API functions for sub-users
export const familyAPI = {
  // Get all sub-users for the current user
  getSubUsers: async (): Promise<SubUsersResponse> => {
    try {
      const response = await apiClient.get('/sub-users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sub-users');
    }
  },

  // Get a specific sub-user by ID
  getSubUser: async (subUserId: string): Promise<SubUserResponse> => {
    try {
      const response = await apiClient.get(`/sub-users/${subUserId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sub-user');
    }
  },

  // Create a new sub-user
  createSubUser: async (subUserData: CreateSubUserRequest): Promise<SubUserResponse> => {
    try {
      const response = await apiClient.post('/sub-users', subUserData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create sub-user');
    }
  },

  // Update an existing sub-user
  updateSubUser: async (subUserId: string, subUserData: UpdateSubUserRequest): Promise<SubUserResponse> => {
    try {
      const response = await apiClient.put(`/sub-users/${subUserId}`, subUserData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update sub-user');
    }
  },

  // Delete a sub-user
  deleteSubUser: async (subUserId: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.delete(`/sub-users/${subUserId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete sub-user');
    }
  },

  // Toggle sub-user active status
  toggleSubUserStatus: async (subUserId: string, isActive: boolean): Promise<SubUserResponse> => {
    try {
      const response = await apiClient.patch(`/sub-users/${subUserId}/status`, {
        is_active: isActive
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update sub-user status');
    }
  },

  // Get sub-user statistics (optional)
  getSubUserStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> => {
    try {
      const response = await apiClient.get('/sub-users/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sub-user statistics');
    }
  },
};
