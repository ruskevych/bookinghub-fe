'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { 
  BookingDetails, 
  ProviderInfo, 
  LocationMap, 
  CalendarIntegration, 
  BookingActions 
} from '@/components/booking-confirmation';
import type { Booking } from '@/lib/api';
import { useBookings } from '@/hooks/use-bookings';
import { useAuth } from '@/hooks/use-auth';

export default function TestConfirmationPage() {
  const [activeComponent, setActiveComponent] = useState<string>('all');
  const [mockBooking, setMockBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { bookings } = useBookings({ userId: user?.id || '' });

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      setMockBooking(bookings[0]);
    }
    setLoading(false);
  }, [bookings]);

  const mockLocation = {
    name: "Test Location",
    fullAddress: "123 Main St, Test City, TS 12345",
    address: "123 Main St",
    city: "Test City",
    state: "TS",
    zipCode: "12345",
    serviceRadius: 10,
  };

  const components = [
    { id: 'all', name: 'All Components', component: null },
    { id: 'details', name: 'Booking Details', component: mockBooking ? <BookingDetails booking={mockBooking} /> : null },
    { id: 'provider', name: 'Provider Info', component: mockBooking ? <ProviderInfo booking={mockBooking} /> : null },
    { id: 'location', name: 'Location Map', component: mockBooking ? <LocationMap booking={mockBooking} location={mockLocation} /> : null },
    { id: 'calendar', name: 'Calendar Integration', component: mockBooking ? <CalendarIntegration booking={mockBooking} /> : null },
    { id: 'actions', name: 'Booking Actions', component: mockBooking ? <BookingActions booking={mockBooking} /> : null },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading test data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mockBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">Failed to load test data</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const renderComponent = () => {
    if (activeComponent === 'all') {
      return (
        <div className="space-y-8">
          <BookingDetails booking={mockBooking} />
          <ProviderInfo booking={mockBooking} />
          <LocationMap booking={mockBooking} location={mockLocation} />
          <div className="grid gap-8 lg:grid-cols-2">
            <CalendarIntegration booking={mockBooking} />
            <BookingActions booking={mockBooking} />
          </div>
        </div>
      );
    }

    const selected = components.find(c => c.id === activeComponent);
    return selected?.component || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Booking Confirmation Test Page</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Test individual components or view all components together
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {components.map((comp) => (
                  <Button
                    key={comp.id}
                    variant={activeComponent === comp.id ? "default" : "outline"}
                    onClick={() => setActiveComponent(comp.id)}
                    size="sm"
                  >
                    {comp.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Component Display */}
          <div className="space-y-8">
            {renderComponent()}
          </div>

          {/* Test Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Button 
                  onClick={() => window.open('/booking-confirmation?booking_id=booking-001', '_blank')}
                  className="w-full"
                >
                  Test Confirmed Booking
                </Button>
                <Button 
                  onClick={() => window.open('/booking-confirmation?booking_id=booking-002', '_blank')}
                  className="w-full"
                >
                  Test Pending Booking
                </Button>
                <Button 
                  onClick={() => window.open('/booking-confirmation?booking_id=booking-003', '_blank')}
                  className="w-full"
                >
                  Test Completed Booking
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 