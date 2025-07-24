'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Calendar, Plus, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import type { Booking } from '@/lib/api';
import type { Provider } from '@/types/provider';
interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceRadius: number;
  fullAddress?: string;
}
import { useBookings } from '@/hooks/use-bookings';
import { useAuth } from '@/hooks/use-auth';

interface CalendarIntegrationProps {
  booking: Booking;
  onAddToCalendar?: (service: string) => void;
}

export function CalendarIntegration({ booking, onAddToCalendar }: CalendarIntegrationProps) {
  const { user } = useAuth();
  const { bookings } = useBookings({ userId: user?.id || '' });
  const foundBooking = bookings.find((b: Booking) => b.id === booking.id);
  const providerInfo = foundBooking?.provider || null;
  const locationInfo = foundBooking?.location || null;

  const generateCalendarEvent = () => {
    const startDate = new Date(booking.start_time);
    const endDate = new Date(booking.end_time);
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const location = locationInfo?.fullAddress || 'Location TBD';
    const providerName = providerInfo?.name || 'Provider';
    const providerPhone = providerInfo?.phone || '';
    const providerEmail = providerInfo?.email || '';
    
    const description = `
${booking.service_name}
${booking.notes ? `\nSpecial requests: ${booking.notes}` : ''}

Provider: ${providerName}
Phone: ${providerPhone}
Email: ${providerEmail}

Booking Reference: #${booking.id.slice(0, 8).toUpperCase()}

Location: ${location}

Please arrive 10-15 minutes early for check-in.
`.trim();

    return {
      title: `${booking.service_name} Appointment`,
      startTime: formatDateForCalendar(startDate),
      endTime: formatDateForCalendar(endDate),
      description,
      location
    };
  };

  const getGoogleCalendarUrl = () => {
    const event = generateCalendarEvent();
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${event.startTime}/${event.endTime}`,
      details: event.description,
      location: event.location
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const getOutlookUrl = () => {
    const event = generateCalendarEvent();
    const startDate = new Date(booking.start_time);
    const endDate = new Date(booking.end_time);
    
    const params = new URLSearchParams({
      subject: event.title,
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      body: event.description,
      location: event.location,
      allday: 'false'
    });
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  const getYahooCalendarUrl = () => {
    const event = generateCalendarEvent();
    const startDate = new Date(booking.start_time);
    const endDate = new Date(booking.end_time);
    
    const params = new URLSearchParams({
      v: '60',
      title: event.title,
      st: format(startDate, "yyyyMMdd'T'HHmmss'Z'"),
      et: format(endDate, "yyyyMMdd'T'HHmmss'Z'"),
      desc: event.description,
      in_loc: event.location
    });
    
    return `https://calendar.yahoo.com/?${params.toString()}`;
  };

  const generateICSFile = () => {
    const event = generateCalendarEvent();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Booking App//Calendar Event//EN
BEGIN:VEVENT
UID:${booking.id}@bookingapp.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${event.startTime}
DTEND:${event.endTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-${booking.id.slice(0, 8)}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    onAddToCalendar?.('ics');
  };

  const handleCalendarAction = (service: string, url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    onAddToCalendar?.(service);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Add to Calendar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Event Preview */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            {booking.service_name} Appointment
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>{format(new Date(booking.start_time), 'EEEE, MMMM dd, yyyy')}</p>
            <p>
              {format(new Date(booking.start_time), 'h:mm a')} - {format(new Date(booking.end_time), 'h:mm a')}
            </p>
            <p>📍 123 Main Street, Suite 200, Downtown, CA 90210</p>
          </div>
        </div>

        {/* Calendar Service Buttons */}
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900 dark:text-gray-100">Choose your calendar app:</h5>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleCalendarAction('google', getGoogleCalendarUrl())}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Google Calendar
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleCalendarAction('outlook', getOutlookUrl())}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Outlook Calendar
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleCalendarAction('yahoo', getYahooCalendarUrl())}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Yahoo Calendar
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={generateICSFile}
            >
              <Download className="h-4 w-4 mr-2" />
              Download .ics file (Apple Calendar, etc.)
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            📅 Calendar Tips
          </h5>
          <div className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
            <p>• Set a reminder 30-60 minutes before your appointment</p>
            <p>• Include travel time to arrive 10-15 minutes early</p>
            <p>• Add the provider&apos;s contact information to the event</p>
          </div>
        </div>

        {/* Mobile Calendar Apps */}
        <div className="pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            On mobile? The .ics file works with most calendar apps including Apple Calendar, Samsung Calendar, and others.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 