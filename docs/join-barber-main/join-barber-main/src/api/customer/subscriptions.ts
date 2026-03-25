import axios from "axios";
import { API_CONFIG } from "@/lib/constants";

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Types for subscription operations
export interface Subscription {
  id: string;
  shop_id: string;
  shop_name: string;
  shop_address: string;
  shop_phone: string;
  subscription_type: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  price: number;
  currency: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionRequest {
  shop_id: string;
  subscription_type: 'monthly' | 'yearly' | 'lifetime';
  auto_renew: boolean;
}

export interface UpdateSubscriptionRequest {
  auto_renew?: boolean;
  status?: 'active' | 'cancelled';
}

export interface SubscriptionsResponse {
  data: Subscription[];
  message: string;
}

export interface SubscriptionResponse {
  data: Subscription;
  message: string;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  expired: number;
  cancelled: number;
}

// API functions for subscriptions
export const subscriptionsAPI = {
  // Get all subscriptions for the current user
  getSubscriptions: async (): Promise<SubscriptionsResponse> => {
    try {
      const response = await apiClient.get('/subscriptions');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subscriptions');
    }
  },

  // Get a specific subscription by ID
  getSubscription: async (subscriptionId: string): Promise<SubscriptionResponse> => {
    try {
      const response = await apiClient.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subscription');
    }
  },

  // Create a new subscription
  createSubscription: async (subscriptionData: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
    try {
      const response = await apiClient.post('/subscriptions', subscriptionData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create subscription');
    }
  },

  // Update an existing subscription
  updateSubscription: async (subscriptionId: string, subscriptionData: UpdateSubscriptionRequest): Promise<SubscriptionResponse> => {
    try {
      const response = await apiClient.put(`/subscriptions/${subscriptionId}`, subscriptionData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update subscription');
    }
  },

  // Cancel a subscription
  cancelSubscription: async (subscriptionId: string): Promise<{ message: string }> => {
    try {
      const response = await apiClient.patch(`/subscriptions/${subscriptionId}/cancel`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel subscription');
    }
  },

  // Renew a subscription
  renewSubscription: async (subscriptionId: string): Promise<SubscriptionResponse> => {
    try {
      const response = await apiClient.patch(`/subscriptions/${subscriptionId}/renew`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to renew subscription');
    }
  },

  // Toggle auto-renew for a subscription
  toggleAutoRenew: async (subscriptionId: string, autoRenew: boolean): Promise<SubscriptionResponse> => {
    try {
      const response = await apiClient.patch(`/subscriptions/${subscriptionId}/auto-renew`, {
        auto_renew: autoRenew
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update auto-renew setting');
    }
  },

  // Get subscription statistics
  getSubscriptionStats: async (): Promise<SubscriptionStats> => {
    try {
      const response = await apiClient.get('/subscriptions/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subscription statistics');
    }
  },

  // Get subscriptions by shop ID
  getSubscriptionsByShop: async (shopId: string): Promise<SubscriptionsResponse> => {
    try {
      const response = await apiClient.get(`/shops/${shopId}/subscriptions`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch shop subscriptions');
    }
  },
};
