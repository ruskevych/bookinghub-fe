'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Avatar, AvatarFallback } from '@/registry/new-york-v4/ui/avatar';
import { 
  CalendarIcon, 
  Clock, 
  DollarSign, 
  User, 
  LogOut, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { bookingService } from '@/lib/api';
import type { Booking } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingBooking, setCancelingBooking] = useState<string | null>(null);
  
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Load bookings on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookings();
      setBookings(response.data.items);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancelingBooking(bookingId);
      await bookingService.cancelBooking(bookingId);
      
      // Update the booking status locally
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'Cancelled' as const }
            : booking
        )
      );
      
      toast.success('Booking cancelled successfully');
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      const errorMessage = error.response?.data?.error?.message || 'Failed to cancel booking';
      toast.error(errorMessage);
    } finally {
      setCancelingBooking(null);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
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

  const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), 'PPP p');
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const canCancelBooking = (booking: Booking) => {
    return booking.status === 'Pending' || booking.status === 'Confirmed';
  };

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.start_time) > new Date() && booking.status !== 'Cancelled'
  );

  const pastBookings = bookings.filter(booking => 
    new Date(booking.start_time) <= new Date() || booking.status === 'Cancelled'
  );

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Book New Appointment</h3>
                <p className="text-sm text-gray-600">Schedule a new service</p>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => router.push('/')}
            >
              Book Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Upcoming Bookings</h3>
                <p className="text-sm text-gray-600">{upcomingBookings.length} scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
              <p className="text-gray-600 mb-4">Book your first appointment to get started</p>
              <Button onClick={() => router.push('/')}>
                Book Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{booking.service_name}</CardTitle>
                    <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span>{formatDateTime(booking.start_time)}</span>
                  </div>
                  
                  {booking.service && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{formatDuration(booking.service.duration)}</span>
                    </div>
                  )}
                  
                  {booking.service && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span>${booking.service.price}</span>
                    </div>
                  )}
                  
                  {booking.notes && (
                    <div className="text-sm">
                      <p className="font-medium">Notes:</p>
                      <p className="text-gray-600">{booking.notes}</p>
                    </div>
                  )}
                  
                  {canCancelBooking(booking) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelingBooking === booking.id}
                    >
                      {cancelingBooking === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Past Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{booking.service_name}</CardTitle>
                    <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span>{formatDateTime(booking.start_time)}</span>
                  </div>
                  
                  {booking.service && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{formatDuration(booking.service.duration)}</span>
                    </div>
                  )}
                  
                  {booking.service && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span>${booking.service.price}</span>
                    </div>
                  )}
                  
                  {booking.notes && (
                    <div className="text-sm">
                      <p className="font-medium">Notes:</p>
                      <p className="text-gray-600">{booking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 