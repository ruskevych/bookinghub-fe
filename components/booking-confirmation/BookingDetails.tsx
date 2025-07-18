'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Separator } from '@/registry/new-york-v4/ui/separator';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  FileText,
  Star,
  Timer
} from 'lucide-react';
import { format } from 'date-fns';
import type { Booking } from '@/lib/api';

interface BookingDetailsProps {
  booking: Booking;
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes}min`;
    }
    const hours = Math.floor(durationMinutes / 60);
    const remainingMinutes = durationMinutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Appointment Details</CardTitle>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Service Information */}
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {booking.service_name}
              </h3>
              {booking.service?.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {booking.service.description}
                </p>
              )}
              {booking.notes && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Special requests:</span> {booking.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Date & Time Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Calendar className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {format(new Date(booking.start_time), 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Timer className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatDuration(booking.start_time, booking.end_time)}
              </p>
            </div>
          </div>

          {booking.service?.price && (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <DollarSign className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ${booking.service.price.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Booking Reference */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Booking Reference
              </p>
              <p className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
                #{booking.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Booked on
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {format(new Date(booking.created_at), 'MMM dd, yyyy')} at {format(new Date(booking.created_at), 'h:mm a')}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {booking.service?.price && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                <span className="text-gray-900 dark:text-gray-100">${booking.service.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Booking Fee</span>
                <span className="text-gray-900 dark:text-gray-100">$0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900 dark:text-gray-100">Total Paid</span>
                <span className="text-gray-900 dark:text-gray-100">${booking.service.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 