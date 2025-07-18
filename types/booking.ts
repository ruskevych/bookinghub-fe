import { Service, TimeSlot } from '@/lib/api';

// Extend the existing types with additional booking flow data
export interface ExtendedService extends Service {
  provider_name?: string;
  provider_rating?: number;
  provider_image?: string;
  add_ons?: AddOnService[];
}

export interface AddOnService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export interface StaffMember {
  id: string;
  name: string;
  image?: string;
  specialties: string[];
  rating: number;
  reviews_count: number;
  available_times?: string[];
}

export interface BookingData {
  // Step 1: Service
  service: ExtendedService | null;
  
  // Step 2: Date & Time
  date: Date | null;
  timeSlot: TimeSlot | null;
  
  // Step 3: Staff
  staffMember: StaffMember | null;
  
  // Step 4: Add-ons
  selectedAddOns: AddOnService[];
  
  // Step 5: Special Requests
  specialRequests: string;
  
  // Step 6: Customer Information
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    emergencyContact?: string;
    accessibilityNeeds?: string;
  };
  
  // Step 7: Payment
  paymentMethod: string;
  promoCode?: string;
  
  // Calculated totals
  subtotal: number;
  discount: number;
  total: number;
}

export interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export const BOOKING_STEPS: BookingStep[] = [
  {
    id: 'service',
    title: 'Service Selection',
    description: 'Choose your service',
    completed: false,
    current: true,
  },
  {
    id: 'datetime',
    title: 'Date & Time',
    description: 'Pick your appointment',
    completed: false,
    current: false,
  },
  {
    id: 'staff',
    title: 'Staff Selection',
    description: 'Choose your provider',
    completed: false,
    current: false,
  },
  {
    id: 'addons',
    title: 'Add-on Services',
    description: 'Enhance your service',
    completed: false,
    current: false,
  },
  {
    id: 'requests',
    title: 'Special Requests',
    description: 'Any special needs',
    completed: false,
    current: false,
  },
  {
    id: 'info',
    title: 'Your Information',
    description: 'Contact details',
    completed: false,
    current: false,
  },
  {
    id: 'payment',
    title: 'Payment & Review',
    description: 'Complete your booking',
    completed: false,
    current: false,
  },
]; 