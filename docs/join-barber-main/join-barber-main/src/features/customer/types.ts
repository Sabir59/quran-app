export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  primary_role: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  customer_id: number;
  barber_id: number;
  shop_id: number;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Barber {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  experience_years: number;
  is_available: boolean;
  shop_id: number;
  created_at: string;
  updated_at: string;
}

export interface Shop {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  owner_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
