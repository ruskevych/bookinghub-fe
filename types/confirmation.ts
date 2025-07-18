import type { Booking } from '@/lib/api';

export interface ConfirmationPageParams {
  booking_id: string;
}

export interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

export interface CalendarEvent {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
}

export interface ProviderContact {
  name: string;
  phone: string;
  email: string;
  responseTime: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
}

export interface LocationDetails {
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
}

export interface BookingConfirmationData extends Booking {
  provider?: ProviderContact;
  location?: LocationDetails;
} 