'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/lib/api';
import type { Booking } from '@/lib/api';
import { toast } from 'sonner';

interface UseBookingConfirmationReturn {
  booking: Booking | null;
  loading: boolean;
  error: string | null;
  isResending: boolean;
  isSharing: boolean;
  loadBooking: (bookingId: string) => Promise<void>;
  resendConfirmation: (bookingId: string) => Promise<void>;
  addToCalendar: (service: string) => void;
  shareBooking: (bookingId: string) => Promise<void>;
}

export function useBookingConfirmation(): UseBookingConfirmationReturn {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const router = useRouter();

  const loadBooking = useCallback(async (bookingId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use dummy data for now - replace with actual API call later
      const { DUMMY_BOOKINGS } = await import('@/data/dummy-bookings');
      
      const booking = DUMMY_BOOKINGS[bookingId];
      
      if (booking) {
        setBooking(booking);
      } else {
        setError('Booking not found');
      }
    } catch (error: any) {
      console.error('Failed to load booking:', error);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, []);

  const resendConfirmation = useCallback(async (bookingId: string) => {
    try {
      setIsResending(true);
      
      // Mock API call - replace with actual resend confirmation endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Confirmation email sent successfully!');
    } catch (error: any) {
      console.error('Failed to resend confirmation:', error);
      toast.error('Failed to resend confirmation email');
    } finally {
      setIsResending(false);
    }
  }, []);

  const addToCalendar = useCallback((service: string) => {
    // Track calendar integration usage
    console.log(`Calendar integration used: ${service}`);
    
    // You could add analytics tracking here
    // analytics.track('calendar_integration_used', { service, booking_id: booking?.id });
    
    toast.success(`Opening ${service === 'ics' ? 'calendar file' : service} calendar...`);
  }, []);

  const shareBooking = useCallback(async (bookingId: string) => {
    if (!booking) return;
    
    try {
      setIsSharing(true);
      
      const shareData = {
        title: `${booking.service_name} Appointment`,
        text: `I have an appointment for ${booking.service_name} on ${new Date(booking.start_time).toLocaleDateString()}`,
        url: `${window.location.origin}/booking-confirmation?booking_id=${bookingId}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Appointment details shared successfully!');
      } else {
        // Fallback to copying to clipboard
        const shareText = `${shareData.title}

${shareData.text}

View details: ${shareData.url}

Booking Reference: #${booking.id.slice(0, 8).toUpperCase()}
Date: ${new Date(booking.start_time).toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}
Time: ${new Date(booking.start_time).toLocaleTimeString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit', 
  hour12: true 
})} - ${new Date(booking.end_time).toLocaleTimeString('en-US', { 
  hour: 'numeric', 
  minute: '2-digit', 
  hour12: true 
})}`;

        await navigator.clipboard.writeText(shareText);
        toast.success('Appointment details copied to clipboard!');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Failed to share booking:', error);
        toast.error('Failed to share appointment details');
      }
    } finally {
      setIsSharing(false);
    }
  }, [booking]);

  return {
    booking,
    loading,
    error,
    isResending,
    isSharing,
    loadBooking,
    resendConfirmation,
    addToCalendar,
    shareBooking,
  };
} 