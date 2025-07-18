import { format } from 'date-fns';
import { Booking } from './types';

/**
 * Format a date-time string to a human-readable format
 */
export const formatDateTime = (dateTime: string): string => {
  return format(new Date(dateTime), 'PPP p');
};

/**
 * Format duration in minutes to a human-readable format
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

/**
 * Get appropriate CSS class for booking status
 */
export const getStatusColor = (status: Booking['status']): string => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    case 'Completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};
