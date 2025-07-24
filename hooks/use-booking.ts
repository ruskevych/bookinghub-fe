import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { serviceService, bookingService } from '@/lib/api';
import type { Service, TimeSlot, CreateBookingRequest } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface UseBookingReturn {
  // State
  services: Service[];
  selectedService: Service | null;
  selectedDate: Date | undefined;
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  loading: boolean;
  submitting: boolean;
  formData: BookingFormData;
  
  // Actions
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
  setFormData: (data: BookingFormData) => void;
  handleServiceSelect: (serviceId: string) => void;
  handleBooking: () => Promise<void>;
  loadServices: () => Promise<void>;
  getAvailableTimeSlots: () => TimeSlot[];
  
  // Utilities
  formatTime: (dateTime: string) => string;
  formatDuration: (minutes: number) => string;
}

export function useBooking(): UseBookingReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await serviceService.getServices();
      setServices(response.data.items);
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTimeSlots = useCallback(async (serviceId: string) => {
    try {
      const response = await serviceService.getServiceTimeSlots(serviceId);
      setTimeSlots(response.data);
    } catch (error) {
      console.error('Failed to load time slots:', error);
      toast.error('Failed to load available times');
    }
  }, []);

  const handleServiceSelect = useCallback((serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service || null);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    if (service) {
      loadTimeSlots(service.id);
    }
  }, [services, loadTimeSlots]);

  const getAvailableTimeSlots = useCallback(() => {
    if (!selectedDate) return [];
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return timeSlots.filter(slot => {
      const slotDate = new Date(slot.start_time).toISOString().split('T')[0];
      return slotDate === dateStr;
    });
  }, [selectedDate, timeSlots]);

  const handleBooking = useCallback(async () => {
    if (!selectedService || !selectedTimeSlot) {
      toast.error('Please select a service and time slot');
      return;
    }

    if (!isAuthenticated) {
      // Redirect to login with booking info in URL params for later completion
      const bookingParams = new URLSearchParams({
        service_id: selectedService.id,
        time_slot_id: selectedTimeSlot.id,
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        ...formData
      });
      router.push(`/login?booking=true&${bookingParams.toString()}`);
      return;
    }

    try {
      setSubmitting(true);
      
      const bookingRequest: CreateBookingRequest = {
        service_id: selectedService.id,
        time_slot_id: selectedTimeSlot.id,
        notes: formData.notes || undefined
      };

      const response = await bookingService.createBooking(bookingRequest);
      
      if (response.data) {
        toast.success('Booking confirmed successfully!');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          notes: ''
        });
        setSelectedService(null);
        setSelectedDate(undefined);
        setSelectedTimeSlot(null);
        
        // Redirect to confirmation page
        router.push(`/booking-confirmation?booking_id=${response.data.id}`);
      }
    } catch (error: unknown) {
      console.error('Booking failed:', error);
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        toast.error((error.response.data as { message?: string }).message || 'Failed to create booking');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create booking');
      }
    } finally {
      setSubmitting(false);
    }
  }, [selectedService, selectedTimeSlot, selectedDate, formData, isAuthenticated, router]);

  const formatTime = useCallback((dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }, []);

  const formatDuration = useCallback((minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }, []);

  return {
    // State
    services,
    selectedService,
    selectedDate,
    timeSlots,
    selectedTimeSlot,
    loading,
    submitting,
    formData,
    
    // Actions
    setSelectedService,
    setSelectedDate,
    setSelectedTimeSlot,
    setFormData,
    handleServiceSelect,
    handleBooking,
    loadServices,
    getAvailableTimeSlots,
    
    // Utilities
    formatTime,
    formatDuration,
  };
} 