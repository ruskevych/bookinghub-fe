'use client';

import React, { useState } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Booking, TimeSlot, Service } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/registry/new-york-v4/ui/dialog';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';

// Setup the localizer
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking | TimeSlot | { [key: string]: unknown };
  type: 'booking' | 'timeSlot';
}

interface CalendarTabProps {
  bookings: Booking[];
  timeSlots: TimeSlot[];
  services: Service[];
}

export const CalendarTab: React.FC<CalendarTabProps> = ({ bookings, timeSlots, services }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  type CalendarView = 'month' | 'week' | 'work_week' | 'day' | 'agenda';
  const [viewType, setViewType] = useState<CalendarView>('month');
  const [filterType, setFilterType] = useState<string>('all');

  // Convert bookings and time slots to calendar events
  const getEvents = (): CalendarEvent[] => {
    const bookingEvents = bookings.map(booking => ({
      id: booking.id,
      title: `Booking: ${booking.service_name}`,
      start: new Date(booking.start_time),
      end: new Date(booking.end_time),
      resource: booking,
      type: 'booking' as const
    }));

    const timeSlotEvents = timeSlots.map(slot => {
      const service = services.find(s => s.id === slot.service_id);
      return {
        id: slot.id,
        title: `Available: ${service?.name || 'Unknown Service'}`,
        start: new Date(slot.start_time),
        end: new Date(slot.end_time),
        resource: { ...slot, service },
        type: 'timeSlot' as const
      };
    });

    // Apply filters
    let events = [...bookingEvents, ...timeSlotEvents];
    if (filterType === 'bookings') {
      events = bookingEvents;
    } else if (filterType === 'timeSlots') {
      events = timeSlotEvents;
    }

    return events;
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const isBooking = event.type === 'booking';
    const backgroundColor = isBooking ? '#3182ce' : '#38a169';
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  const renderEventDetails = () => {
    if (!selectedEvent) return null;

    if (selectedEvent.type === 'booking') {
      const booking = selectedEvent.resource as Booking;
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">Service:</div>
            <div>{booking.service_name}</div>
            
            <div className="font-semibold">Status:</div>
            <div className={`font-medium ${getStatusColor(booking.status)}`}>{booking.status}</div>
            
            <div className="font-semibold">Start Time:</div>
            <div>{formatDateTime(booking.start_time)}</div>
            
            <div className="font-semibold">End Time:</div>
            <div>{formatDateTime(booking.end_time)}</div>
            
            {booking.notes && (
              <>
                <div className="font-semibold">Notes:</div>
                <div>{booking.notes}</div>
              </>
            )}
          </div>
        </div>
      );
    } else {
      const timeSlot = selectedEvent.resource as TimeSlot & { service?: Service };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-semibold">Service:</div>
            <div>{timeSlot.service?.name || 'Unknown'}</div>
            
            <div className="font-semibold">Status:</div>
            <div className={timeSlot.is_available ? 'text-green-600' : 'text-red-600'}>
              {timeSlot.is_available ? 'Available' : 'Unavailable'}
            </div>
            
            <div className="font-semibold">Start Time:</div>
            <div>{formatDateTime(timeSlot.start_time)}</div>
            
            <div className="font-semibold">End Time:</div>
            <div>{formatDateTime(timeSlot.end_time)}</div>
          </div>
        </div>
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600';
      case 'Pending': return 'text-yellow-600';
      case 'Cancelled': return 'text-red-600';
      case 'Completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatDateTime = (dateString: string) => {
    return moment(dateString).format('MMM DD, YYYY h:mm A');
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendar View</h2>
        <div className="flex space-x-4">
          <Select value={viewType} onValueChange={(value) => setViewType(value as CalendarView)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="bookings">Bookings Only</SelectItem>
              <SelectItem value="timeSlots">Time Slots Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[600px] bg-white rounded-md shadow p-4 w-full">
        <Calendar
          localizer={localizer}
          events={getEvents()}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', width: '100%' }}
          onSelectEvent={handleEventSelect}
          eventPropGetter={eventStyleGetter}
          view={viewType}
          onView={(view) => setViewType(view as CalendarView)}
          views={['month', 'week', 'work_week', 'day', 'agenda']}
        />
      </div>

      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.type === 'booking' ? 'Booking Details' : 'Time Slot Details'}
            </DialogTitle>
          </DialogHeader>
          {renderEventDetails()}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setShowEventDetails(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
