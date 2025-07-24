import axios, { AxiosResponse } from 'axios';

// API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  telegram_id?: number;
  whatsapp_id?: string;
  business_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  timezone: string;
  contact_info?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  service_id: string;
  business_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  business_id: string;
  service_id: string;
  time_slot_id: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  service_name: string;
  start_time: string;
  end_time: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  service?: Service;
  time_slot?: TimeSlot;
}

export interface CreateBookingRequest {
  service_id: string;
  time_slot_id: string;
  notes?: string;
}

export interface UserPreferences {
  notification_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  telegram_notifications: boolean;
  whatsapp_notifications: boolean;
  preferred_language: string;
  timezone: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface ErrorResponse {
  error: {
    message: string;
    code: number;
  };
}

// API Client Configuration
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const getStoredRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = getStoredRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:3000/api/auth/refresh', {
            refresh_token: refreshToken,
          });
          
          const { access_token, refresh_token: newRefreshToken } = response.data;
          setTokens(access_token, newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// API Services
export const authService = {
  login: (credentials: LoginRequest) => api.post<AuthResponse>('/api/auth/login', credentials),
  register: (userData: RegisterRequest) => api.post<AuthResponse>('/api/auth/register', userData),
  refresh: () => api.post<AuthResponse>('/api/auth/refresh'),
};

export const userService = {
  getUsers: (params?: PaginationParams) => api.get<PaginatedResponse<User>>('/api/users', { params }),
  getUser: (id: string) => api.get<User>(`/api/users/${id}`),
  updateUser: (id: string, data: Partial<User>) => api.put<User>(`/api/users/${id}`, data),
  getPreferences: () => api.get<UserPreferences>('/api/user/preferences'),
  updatePreferences: (data: Partial<UserPreferences>) => api.put<UserPreferences>('/api/user/preferences', data),
};

export const businessService = {
  getBusinesses: (params?: PaginationParams) => api.get<PaginatedResponse<Business>>('/api/businesses', { params }),
  createBusiness: (data: Omit<Business, 'id' | 'created_at' | 'updated_at'>) => api.post<Business>('/api/businesses', data),
  getBusiness: (id: string) => api.get<Business>(`/api/businesses/${id}`),
  updateBusiness: (id: string, data: Partial<Business>) => api.put<Business>(`/api/businesses/${id}`, data),
  deleteBusiness: (id: string) => api.delete(`/api/businesses/${id}`),
};

export const serviceService = {
  getServices: (params?: PaginationParams) => api.get<PaginatedResponse<Service>>('/api/services', { params }),
  getService: (id: string) => api.get<Service>(`/api/services/${id}`),
  updateService: (id: string, data: Partial<Service>) => api.put<Service>(`/api/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/api/services/${id}`),
  getServiceTimeSlots: (id: string) => api.get<TimeSlot[]>(`/api/services/${id}/time-slots`),
};

export const timeSlotsService = {
  getTimeSlots: (params?: PaginationParams) => api.get<PaginatedResponse<TimeSlot>>('/api/time-slots', { params }),
  createTimeSlot: (data: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>) => api.post<TimeSlot>('/api/time-slots', data),
  getTimeSlot: (id: string) => api.get<TimeSlot>(`/api/time-slots/${id}`),
  updateTimeSlot: (id: string, data: Partial<TimeSlot>) => api.put<TimeSlot>(`/api/time-slots/${id}`, data),
  deleteTimeSlot: (id: string) => api.delete(`/api/time-slots/${id}`),
};

export const bookingService = {
  getBookings: (params?: PaginationParams) => api.get<PaginatedResponse<Booking>>('/api/bookings', { params }),
  createBooking: (data: CreateBookingRequest) => api.post<Booking>('/api/bookings', data),
  getBooking: (id: string) => api.get<Booking>(`/api/bookings/${id}`),
  deleteBooking: (id: string) => api.delete(`/api/bookings/${id}`),
  confirmBooking: (id: string) => api.patch<Booking>(`/api/bookings/${id}/confirm`),
  cancelBooking: (id: string) => api.patch<Booking>(`/api/bookings/${id}/cancel`),
  completeBooking: (id: string) => api.patch<Booking>(`/api/bookings/${id}/complete`),
  updateBookingStatus: (id: string, status: Booking['status']) => api.patch<Booking>(`/api/bookings/${id}/status`, { status }),
};

export const adminService = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getBookings: (params?: PaginationParams) => api.get<PaginatedResponse<Booking>>('/api/admin/bookings', { params }),
  getUsers: (params?: PaginationParams) => api.get<PaginatedResponse<User>>('/api/admin/users', { params }),
  getBusinesses: (params?: PaginationParams) => api.get<PaginatedResponse<Business>>('/api/admin/businesses', { params }),
};

export const healthService = {
  check: () => api.get('/health'),
};

export default api; 