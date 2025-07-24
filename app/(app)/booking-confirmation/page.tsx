'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Separator } from '@/registry/new-york-v4/ui/separator';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Star,
  Download,
  MessageCircle,
  Navigation,
  RefreshCw,
  X,
  Share,
  User,
  CreditCard,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { bookingService } from '@/lib/api';
import type { Booking } from '@/lib/api';

// Import confirmation components
import { BookingDetails } from '@/components/booking-confirmation/BookingDetails';
import { ProviderInfo } from '@/components/booking-confirmation/ProviderInfo';
import { LocationMap } from '@/components/booking-confirmation/LocationMap';
import { CalendarIntegration } from '@/components/booking-confirmation/CalendarIntegration';
import { BookingActions } from '@/components/booking-confirmation/BookingActions';
import { useBookingConfirmation } from '@/hooks/use-booking-confirmation';

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  
  const bookingId = searchParams.get('booking_id');
  const {
    booking,
    loading,
    error,
    loadBooking,
    resendConfirmation,
    addToCalendar,
    shareBooking,
    isResending,
    isSharing
  } = useBookingConfirmation();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!bookingId) {
      toast.error('No booking ID provided');
      router.push('/dashboard');
      return;
    }

    loadBooking(bookingId);
  }, [bookingId, isAuthenticated, router, loadBooking]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading your booking confirmation...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center py-12">
              <CardContent>
                <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Booking Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error || 'We could not find the booking you are looking for.'}
                </p>
                <div className="space-x-4">
                  <Button onClick={() => router.push('/dashboard')} variant="outline">
                    Go to Dashboard
                  </Button>
                  <Button onClick={() => router.push('/booking')} className="bg-green-600 hover:bg-green-700">
                    Make New Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Success Header */}
          <Card className="text-center bg-white/80 backdrop-blur-sm border-green-200 dark:border-green-800">
            <CardContent className="pt-8 pb-6">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Your appointment has been successfully booked
              </p>
              <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>Confirmation #{booking.id.slice(0, 8)}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <BookingDetails booking={booking} />
              
              <ProviderInfo 
                booking={booking}
                onMessage={() => {/* TODO: Implement messaging */}}
                onCall={() => {/* TODO: Implement calling */}}
              />
              
              <LocationMap location={null} booking={booking} />
            </div>

            {/* Right Column - Actions & Quick Info */}
            <div className="space-y-6">
              <CalendarIntegration 
                booking={booking}
                onAddToCalendar={addToCalendar}
              />
              
              <BookingActions 
                booking={booking}
                onReschedule={() => router.push(`/booking?reschedule=${booking.id}`)}
                onCancel={() => router.push(`/dashboard?cancel=${booking.id}`)}
                onShare={() => shareBooking(booking.id)}
                isSharing={isSharing}
              />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => resendConfirmation(booking.id)}
                    disabled={isResending}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {isResending ? 'Sending...' : 'Resend Email Confirmation'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.print()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Print/Save as PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push('/dashboard')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View All Bookings
                  </Button>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What&apos;s Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-4 w-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="font-medium">Email Confirmation</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Check your email for detailed confirmation and preparation instructions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-4 w-4 mt-0.5 text-green-500" />
                    <div>
                      <p className="font-medium">Add to Calendar</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Don&apos;t forget to add this appointment to your calendar.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 mt-0.5 text-red-500" />
                    <div>
                      <p className="font-medium">Plan Your Route</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Allow extra time for parking and finding the location.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Footer Actions */}
          <Card className="bg-gray-50 dark:bg-gray-900/50">
            <CardContent className="flex flex-col sm:flex-row justify-between items-center py-6">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need to make changes to your booking?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  You can reschedule or cancel up to 24 hours before your appointment.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => router.push('/booking')}>
                  Book Another Service
                </Button>
                <Button onClick={() => router.push('/dashboard')} className="bg-green-600 hover:bg-green-700">
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  );
} 