'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Service, TimeSlot, Booking, Staff } from '../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useAdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isAdmin = user?.business_id !== undefined;
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Queries for admin data
  const servicesQuery = useQuery({
    queryKey: ['admin-services', user?.business_id],
    queryFn: async () => [
      { id: '1', name: 'Haircut', description: 'Professional haircut service', duration: 45, price: 30, business_id: user?.business_id || '' },
      { id: '2', name: 'Beard Trim', description: 'Detailed beard trimming', duration: 20, price: 15, business_id: user?.business_id || '' },
      { id: '3', name: 'Shave', description: 'Classic straight razor shave', duration: 30, price: 20, business_id: user?.business_id || '' },
    ],
    enabled: isAuthenticated && isAdmin,
  });

  const timeSlotsQuery = useQuery({
    queryKey: ['admin-timeSlots', user?.business_id],
    queryFn: async () => [
      { id: 'ts1', service_id: '1', start_time: '2025-07-17T09:00', end_time: '2025-07-17T09:45', is_available: true },
      { id: 'ts2', service_id: '2', start_time: '2025-07-17T10:00', end_time: '2025-07-17T10:20', is_available: false },
      { id: 'ts3', service_id: '3', start_time: '2025-07-17T11:00', end_time: '2025-07-17T11:30', is_available: true },
    ],
    enabled: isAuthenticated && isAdmin,
  });

  const bookingsQuery = useQuery({
    queryKey: ['admin-bookings', user?.business_id],
    queryFn: async () => [
      { id: 'b1', user_id: 'u1', service_id: '1', service_name: 'Haircut', start_time: '2025-07-17T09:00', end_time: '2025-07-17T09:45', status: 'Confirmed', notes: 'Please be on time.' },
      { id: 'b2', user_id: 'u2', service_id: '2', service_name: 'Beard Trim', start_time: '2025-07-17T10:00', end_time: '2025-07-17T10:20', status: 'Pending' },
      { id: 'b3', user_id: 'u3', service_id: '3', service_name: 'Shave', start_time: '2025-07-17T11:00', end_time: '2025-07-17T11:30', status: 'Completed', notes: 'Customer prefers hot towel.' },
    ],
    enabled: isAuthenticated && isAdmin,
  });

  const staffQuery = useQuery({
    queryKey: ['admin-staff', user?.business_id],
    queryFn: async () => [
      { id: 's1', name: 'Alice', email: 'alice@example.com', phone: '123-456-7890', role: 'Stylist', specialties: ['Haircut'], rating: 4.8, reviews_count: 12 },
      { id: 's2', name: 'Bob', email: 'bob@example.com', phone: '234-567-8901', role: 'Barber', specialties: ['Beard Trim'], rating: 4.6, reviews_count: 8 },
    ],
    enabled: isAuthenticated && isAdmin,
  });

  return {
    services: servicesQuery.data || [],
    setServices: (updater) => {
      queryClient.setQueryData(['admin-services', user?.business_id], (prev) => typeof updater === 'function' ? updater(prev || []) : updater);
    },
    timeSlots: timeSlotsQuery.data || [],
    setTimeSlots: (updater) => {
      queryClient.setQueryData(['admin-timeSlots', user?.business_id], (prev) => typeof updater === 'function' ? updater(prev || []) : updater);
    },
    bookings: bookingsQuery.data || [],
    staff: staffQuery.data || [],
    setStaff: (updater) => {
      queryClient.setQueryData(['admin-staff', user?.business_id], (prev) => typeof updater === 'function' ? updater(prev || []) : updater);
    },
    loading: servicesQuery.isLoading || timeSlotsQuery.isLoading || bookingsQuery.isLoading || staffQuery.isLoading,
    isAuthenticated,
    isAdmin,
    user,
  };
};
