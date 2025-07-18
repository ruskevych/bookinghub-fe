'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Booking } from '../types';
import { formatDateTime, getStatusColor } from '../utils';

interface BookingCardProps {
  booking: Booking;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="text-base">{booking.service_name}</span>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <p><strong>Date:</strong> {formatDateTime(booking.start_time)}</p>
          <p><strong>User:</strong> {booking.user_id}</p>
          {booking.notes && (
            <p><strong>Notes:</strong> {booking.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
