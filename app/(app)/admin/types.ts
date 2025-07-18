export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  business_id: string;
  category?: string;
  photo_url?: string;
  max_capacity?: number;
  is_group_service?: boolean;
  location?: string;
}

export interface TimeSlot {
  id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  service_name: string;
  start_time: string;
  end_time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  notes?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialties: string[];
  availability: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
  performance: {
    bookings_handled: number;
    avg_rating: number;
    total_ratings: number;
  };
  photo_url?: string;
  bio?: string;
  business_id: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  duration: number;
  price: number;
  business_id: string;
  category: string;
  photo_url: string;
  max_capacity: number;
  is_group_service: boolean;
  location: string;
}

export interface TimeSlotFormData {
  service_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  specialties: string[];
  availability: {
    day: string;
    start_time: string;
    end_time: string;
  }[];
  photo_url: string;
  bio: string;
  business_id: string;
}
