'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Service, TimeSlot, Booking, Staff } from '../types';

export const useAdminDashboard = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Check if user is admin (assuming business_id indicates admin role)
  const isAdmin = user?.business_id !== undefined;

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Load dummy data on mount
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      setLoading(true);
      setTimeout(() => {
        setServices([
          { id: '1', name: 'Haircut', description: 'Professional haircut service', duration: 45, price: 30, business_id: user?.business_id || '' },
          { id: '2', name: 'Beard Trim', description: 'Detailed beard trimming', duration: 20, price: 15, business_id: user?.business_id || '' },
          { id: '3', name: 'Shave', description: 'Classic straight razor shave', duration: 30, price: 20, business_id: user?.business_id || '' },
        ]);
        setTimeSlots([
          { id: 'ts1', service_id: '1', start_time: '2025-07-17T09:00', end_time: '2025-07-17T09:45', is_available: true },
          { id: 'ts2', service_id: '2', start_time: '2025-07-17T10:00', end_time: '2025-07-17T10:20', is_available: false },
          { id: 'ts3', service_id: '3', start_time: '2025-07-17T11:00', end_time: '2025-07-17T11:30', is_available: true },
        ]);
        setBookings([
          { id: 'b1', user_id: 'u1', service_id: '1', service_name: 'Haircut', start_time: '2025-07-17T09:00', end_time: '2025-07-17T09:45', status: 'Confirmed', notes: 'Please be on time.' },
          { id: 'b2', user_id: 'u2', service_id: '2', service_name: 'Beard Trim', start_time: '2025-07-17T10:00', end_time: '2025-07-17T10:20', status: 'Pending' },
          { id: 'b3', user_id: 'u3', service_id: '3', service_name: 'Shave', start_time: '2025-07-17T11:00', end_time: '2025-07-17T11:30', status: 'Completed', notes: 'Customer prefers hot towel.' },
        ]);
        
        setStaff([
          { 
            id: 's1', 
            name: 'John Smith', 
            email: 'john@example.com', 
            phone: '555-123-4567', 
            role: 'Senior Stylist',
            specialties: ['Haircut', 'Beard Trim', 'Coloring'],
            availability: [
              { day: 'Monday', start_time: '09:00', end_time: '17:00' },
              { day: 'Tuesday', start_time: '09:00', end_time: '17:00' },
              { day: 'Wednesday', start_time: '09:00', end_time: '17:00' },
              { day: 'Thursday', start_time: '09:00', end_time: '17:00' },
              { day: 'Friday', start_time: '09:00', end_time: '17:00' },
            ],
            performance: {
              bookings_handled: 124,
              avg_rating: 4.8,
              total_ratings: 98
            },
            photo_url: 'https://randomuser.me/api/portraits/men/32.jpg',
            bio: 'Experienced stylist with over 10 years in the industry.',
            business_id: user?.business_id || ''
          },
          { 
            id: 's2', 
            name: 'Sarah Johnson', 
            email: 'sarah@example.com', 
            phone: '555-987-6543', 
            role: 'Junior Stylist',
            specialties: ['Haircut', 'Shave'],
            availability: [
              { day: 'Monday', start_time: '12:00', end_time: '20:00' },
              { day: 'Wednesday', start_time: '12:00', end_time: '20:00' },
              { day: 'Friday', start_time: '12:00', end_time: '20:00' },
              { day: 'Saturday', start_time: '10:00', end_time: '18:00' },
            ],
            performance: {
              bookings_handled: 78,
              avg_rating: 4.5,
              total_ratings: 62
            },
            photo_url: 'https://randomuser.me/api/portraits/women/44.jpg',
            bio: 'Passionate about creating perfect styles for every client.',
            business_id: user?.business_id || ''
          },
          { 
            id: 's3', 
            name: 'Miguel Rodriguez', 
            email: 'miguel@example.com', 
            phone: '555-456-7890', 
            role: 'Master Barber',
            specialties: ['Beard Trim', 'Shave', 'Haircut'],
            availability: [
              { day: 'Tuesday', start_time: '10:00', end_time: '18:00' },
              { day: 'Thursday', start_time: '10:00', end_time: '18:00' },
              { day: 'Saturday', start_time: '09:00', end_time: '17:00' },
              { day: 'Sunday', start_time: '11:00', end_time: '16:00' },
            ],
            performance: {
              bookings_handled: 156,
              avg_rating: 4.9,
              total_ratings: 142
            },
            photo_url: 'https://randomuser.me/api/portraits/men/67.jpg',
            bio: 'Specializing in classic barbering techniques with modern flair.',
            business_id: user?.business_id || ''
          },
        ]);
        setLoading(false);
      }, 700); // Simulate network delay
    }
  }, [isAuthenticated, isAdmin, user?.business_id]);

  return {
    services,
    setServices,
    timeSlots,
    setTimeSlots,
    bookings,
    staff,
    setStaff,
    loading,
    isAuthenticated,
    isAdmin,
    user
  };
};
