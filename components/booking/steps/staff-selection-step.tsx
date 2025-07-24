'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { 
  Star, 
  Users, 
  CheckCircle2,
  Award,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import types and data
import { BookingData, StaffMember } from '@/types/booking';

interface StaffSelectionStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  isLoading?: boolean;
}

// TODO: Migrate staff data to GraphQL if not already done

// Temporary mock for staff data
function getAllStaffMembers(): StaffMember[] {
  return [
    {
      id: 'staff-1',
      name: 'Alice Johnson',
      specialties: ['Massage', 'Facial'],
      rating: 4.8,
      reviews_count: 120,
      image: '',
      available_times: ['9:00 AM', '11:00 AM', '2:00 PM'],
    },
    {
      id: 'staff-2',
      name: 'Bob Smith',
      specialties: ['Haircut', 'Shave'],
      rating: 4.6,
      reviews_count: 98,
      image: '',
      available_times: ['10:00 AM', '1:00 PM', '4:00 PM'],
    },
  ];
}

function getStaffMembersForProvider(businessId: string): StaffMember[] {
  // For now, just return all staff regardless of businessId
  return getAllStaffMembers();
}

export function StaffSelectionStep({ 
  bookingData, 
  updateBookingData, 
  isLoading 
}: StaffSelectionStepProps) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, [bookingData.service?.business_id]);

  const loadStaff = async () => {
    setLoading(true);
    try {
      // Load staff from dummy data (replace with real API call in the future)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get staff based on selected service provider
      let availableStaff: StaffMember[];
      if (bookingData.service?.business_id) {
        availableStaff = getStaffMembersForProvider(bookingData.service.business_id);
      } else {
        // Fallback to all staff if no service selected
        availableStaff = getAllStaffMembers();
      }
      
      setStaff(availableStaff);
    } catch (error) {
      console.error('Failed to load staff:', error);
      toast.error('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSelect = (staffMember: StaffMember) => {
    updateBookingData({ staffMember });
    toast.success(`Selected: ${staffMember.name}`);
  };

  const handleNoPreference = () => {
    updateBookingData({ 
      staffMember: {
        id: 'no-preference',
        name: 'No Preference',
        specialties: [],
        rating: 0,
        reviews_count: 0
      }
    });
    toast.success('No preference selected');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading staff members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Service & Time Summary */}
      {bookingData.service && (
        <Card className="bg-muted/30">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg leading-tight">{bookingData.service.name}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Duration: {Math.floor(bookingData.service.duration / 60)}h {bookingData.service.duration % 60}m
                </p>
              </div>
              {bookingData.date && bookingData.timeSlot && (
                <div className="text-center sm:text-right">
                  <div className="text-sm sm:text-base font-medium">
                    {bookingData.date.toLocaleDateString()}
                  </div>
                  <div className="text-sm sm:text-base text-muted-foreground">
                    {new Date(bookingData.timeSlot.start_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Staff Preview */}
      {bookingData.staffMember && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg text-primary flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Selected Staff Member
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {bookingData.staffMember.id === 'no-preference' ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg">No Preference</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Any available staff member will be assigned
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={bookingData.staffMember.image} />
                  <AvatarFallback>
                    {bookingData.staffMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg leading-tight">{bookingData.staffMember.name}</h3>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {bookingData.staffMember.rating} ({bookingData.staffMember.reviews_count} reviews)
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Preference Option */}
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md",
          bookingData.staffMember?.id === 'no-preference'
            ? "ring-2 ring-primary bg-primary/5" 
            : "hover:border-primary/30"
        )}
        onClick={handleNoPreference}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-2 leading-tight">No Preference</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 leading-relaxed">
                Let us assign the best available staff member for your appointment. 
                All our team members are highly qualified and experienced.
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="text-xs sm:text-sm">Flexible Scheduling</Badge>
                <Badge variant="secondary" className="text-xs sm:text-sm">Best Availability</Badge>
              </div>
            </div>
            {bookingData.staffMember?.id === 'no-preference' && (
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Staff Members */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Award className="h-5 w-5" />
          Choose Your Preferred Staff Member
        </h3>
        
        <div className="grid gap-4">
          {staff.map((staffMember) => (
            <Card 
              key={staffMember.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                bookingData.staffMember?.id === staffMember.id 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:border-primary/30"
              )}
              onClick={() => handleStaffSelect(staffMember)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Staff Avatar */}
                  <Avatar className="h-20 w-20 flex-shrink-0 mx-auto sm:mx-0">
                    <AvatarImage src={staffMember.image} />
                    <AvatarFallback className="text-lg">
                      {staffMember.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Staff Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold mb-1 leading-tight">{staffMember.name}</h3>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-sm sm:text-base">{staffMember.rating}</span>
                          <span className="text-muted-foreground text-sm sm:text-base">
                            ({staffMember.reviews_count} reviews)
                          </span>
                        </div>
                      </div>
                      {bookingData.staffMember?.id === staffMember.id && (
                        <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* Specialties */}
                    <div className="mb-4">
                      <div className="text-sm sm:text-base text-muted-foreground mb-2">Specialties:</div>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        {staffMember.specialties.map(specialty => (
                          <Badge key={specialty} variant="outline" className="text-xs sm:text-sm">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Available Times */}
                    {staffMember.available_times && staffMember.available_times.length > 0 && (
                      <div>
                        <div className="text-sm sm:text-base text-muted-foreground mb-2 flex items-center justify-center sm:justify-start gap-1">
                          <Calendar className="h-4 w-4" />
                          Available today:
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          {staffMember.available_times.slice(0, 4).map(time => (
                            <Badge key={time} variant="secondary" className="text-xs sm:text-sm">
                              {time}
                            </Badge>
                          ))}
                          {staffMember.available_times.length > 4 && (
                            <Badge variant="outline" className="text-xs sm:text-sm">
                              +{staffMember.available_times.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 