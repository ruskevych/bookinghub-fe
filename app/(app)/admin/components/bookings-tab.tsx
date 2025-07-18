'use client';

import React from 'react';
import { Booking } from '../types';
import { BookingCard } from './booking-card';
import { TabContentLayout } from '@/components/layouts/TabContentLayout';

interface BookingsTabProps {
  bookings: Booking[];
}

export const BookingsTab: React.FC<BookingsTabProps> = ({ bookings }) => {
  return (
    <TabContentLayout title="All Bookings">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
        {bookings.length === 0 && (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No bookings found.
          </div>
        )}
      </div>
    </TabContentLayout>
  );
};
