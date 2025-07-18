import type { Booking } from '@/lib/api';
import type { Provider } from '@/types/provider';
import { DUMMY_PROVIDERS } from './dummy-providers';

// Mock booking data that simulates backend API responses
export const DUMMY_BOOKINGS: Record<string, Booking> = {
  'booking-001': {
    id: 'booking-001',
    user_id: 'user-123',
    business_id: '1',
    service_id: '1',
    time_slot_id: 'timeslot-001',
    status: 'Confirmed',
    service_name: 'Hair Cut & Style',
    start_time: '2024-02-15T14:00:00Z',
    end_time: '2024-02-15T15:00:00Z',
    notes: 'Please focus on creating a modern, layered cut. I have fine hair that needs volume.',
    created_at: '2024-02-10T10:30:00Z',
    updated_at: '2024-02-10T10:30:00Z',
    service: {
      id: '1',
      business_id: '1',
      name: 'Hair Cut & Style',
      description: 'Professional haircut with wash and styling',
      duration: 60,
      price: 75.00,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    time_slot: {
      id: 'timeslot-001',
      service_id: '1',
      business_id: '1',
      start_time: '2024-02-15T14:00:00Z',
      end_time: '2024-02-15T15:00:00Z',
      is_available: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },

  'booking-002': {
    id: 'booking-002',
    user_id: 'user-123',
    business_id: '2',
    service_id: '6',
    time_slot_id: 'timeslot-002',
    status: 'Pending',
    service_name: 'Oil Change & Inspection',
    start_time: '2024-02-16T09:00:00Z',
    end_time: '2024-02-16T10:30:00Z',
    notes: '2019 BMW 3 Series. Please check brake fluid and tire pressure as well.',
    created_at: '2024-02-11T14:20:00Z',
    updated_at: '2024-02-11T14:20:00Z',
    service: {
      id: '6',
      business_id: '2',
      name: 'Oil Change & Inspection',
      description: 'Full synthetic oil change with multi-point inspection',
      duration: 90,
      price: 95.00,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    time_slot: {
      id: 'timeslot-002',
      service_id: '6',
      business_id: '2',
      start_time: '2024-02-16T09:00:00Z',
      end_time: '2024-02-16T10:30:00Z',
      is_available: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },

  'booking-003': {
    id: 'booking-003',
    user_id: 'user-123',
    business_id: '3',
    service_id: '11',
    time_slot_id: 'timeslot-003',
    status: 'Completed',
    service_name: 'Deep Tissue Massage',
    start_time: '2024-02-14T16:00:00Z',
    end_time: '2024-02-14T17:00:00Z',
    notes: 'Focus on lower back and shoulder tension from desk work.',
    created_at: '2024-02-09T11:15:00Z',
    updated_at: '2024-02-14T17:30:00Z',
    service: {
      id: '11',
      business_id: '3',
      name: 'Deep Tissue Massage',
      description: 'Therapeutic massage targeting deep muscle tension',
      duration: 60,
      price: 120.00,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    time_slot: {
      id: 'timeslot-003',
      service_id: '11',
      business_id: '3',
      start_time: '2024-02-14T16:00:00Z',
      end_time: '2024-02-14T17:00:00Z',
      is_available: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },

  'booking-004': {
    id: 'booking-004',
    user_id: 'user-123',
    business_id: '4',
    service_id: '16',
    time_slot_id: 'timeslot-004',
    status: 'Cancelled',
    service_name: 'House Cleaning',
    start_time: '2024-02-17T10:00:00Z',
    end_time: '2024-02-17T12:00:00Z',
    notes: '2-bedroom apartment, focus on kitchen and bathrooms. No pets.',
    created_at: '2024-02-12T09:45:00Z',
    updated_at: '2024-02-13T15:20:00Z',
    service: {
      id: '16',
      business_id: '4',
      name: 'House Cleaning',
      description: 'Comprehensive home cleaning service',
      duration: 120,
      price: 150.00,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    time_slot: {
      id: 'timeslot-004',
      service_id: '16',
      business_id: '4',
      start_time: '2024-02-17T10:00:00Z',
      end_time: '2024-02-17T12:00:00Z',
      is_available: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }
};

// Extended booking data with provider and location information
export interface ExtendedBooking extends Booking {
  provider?: Provider;
  location?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    fullAddress: string;
    parking: {
      available: boolean;
      type: string;
      instructions: string;
    };
    accessibilityInfo?: string;
    landmarks?: string;
  };
}

// Generate extended booking data with provider information
export function getExtendedBooking(bookingId: string): ExtendedBooking | null {
  const booking = DUMMY_BOOKINGS[bookingId];
  if (!booking) return null;

  const provider = DUMMY_PROVIDERS[booking.business_id];
  if (!provider) return booking;

  // Generate location data based on provider
  const location = {
    name: provider.businessName || `${provider.name}'s Business`,
    address: provider.location.address,
    city: provider.location.city,
    state: provider.location.state,
    zipCode: provider.location.zipCode,
    fullAddress: `${provider.location.address}, ${provider.location.city}, ${provider.location.state} ${provider.location.zipCode}`,
    parking: {
      available: true,
      type: 'Free street parking and paid garage',
      instructions: 'Free 2-hour street parking available. Paid parking garage entrance on Oak Street.'
    },
    accessibilityInfo: 'Wheelchair accessible entrance. Elevator available.',
    landmarks: 'Located next to Starbucks, across from Central Park'
  };

  return {
    ...booking,
    provider,
    location
  };
}

// Get all booking IDs for testing
export function getAllBookingIds(): string[] {
  return Object.keys(DUMMY_BOOKINGS);
}

// Get bookings by user ID
export function getBookingsByUserId(userId: string): Booking[] {
  return Object.values(DUMMY_BOOKINGS).filter(booking => booking.user_id === userId);
}

// Get bookings by status
export function getBookingsByStatus(status: Booking['status']): Booking[] {
  return Object.values(DUMMY_BOOKINGS).filter(booking => booking.status === status);
}

// Generate a new booking ID
export function generateBookingId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `booking-${timestamp}-${random}`;
}

// Create a new booking
export function createDummyBooking(bookingData: Partial<Booking>): Booking {
  const newBooking: Booking = {
    id: generateBookingId(),
    user_id: bookingData.user_id || 'user-123',
    business_id: bookingData.business_id || '1',
    service_id: bookingData.service_id || '1',
    time_slot_id: bookingData.time_slot_id || 'timeslot-new',
    status: 'Pending',
    service_name: bookingData.service_name || 'Service',
    start_time: bookingData.start_time || new Date().toISOString(),
    end_time: bookingData.end_time || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    notes: bookingData.notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    service: bookingData.service || {
      id: '1',
      business_id: '1',
      name: 'Service',
      description: 'Service description',
      duration: 60,
      price: 75.00,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    time_slot: bookingData.time_slot || {
      id: 'timeslot-new',
      service_id: '1',
      business_id: '1',
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      is_available: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  // Add to dummy data
  DUMMY_BOOKINGS[newBooking.id] = newBooking;
  
  return newBooking;
}

// Update booking status
export function updateBookingStatus(bookingId: string, status: Booking['status']): Booking | null {
  const booking = DUMMY_BOOKINGS[bookingId];
  if (!booking) return null;

  booking.status = status;
  booking.updated_at = new Date().toISOString();
  
  return booking;
} 