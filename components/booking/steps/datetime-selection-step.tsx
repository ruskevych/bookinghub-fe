'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Calendar } from '@/registry/new-york-v4/ui/calendar';
import { Label } from '@/registry/new-york-v4/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/new-york-v4/ui/select';
import { 
  CalendarIcon, 
  Clock, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { format, addDays, isSameDay, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import types and data
import { BookingData } from '@/types/booking';
import { TimeSlot } from '@/lib/api';

interface DateTimeSelectionStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  isLoading?: boolean;
}

// TODO: Migrate time slot data to GraphQL if not already done

// Temporary mock for available time slots
function generateTimeSlots(serviceId: string, date: Date) {
  // Simple mock: generate 8 slots, every hour from 9am to 5pm
  const slots = [];
  const business_id = 'mock-business';
  const created_at = new Date().toISOString();
  const updated_at = new Date().toISOString();
  for (let i = 9; i < 17; i++) {
    const start = new Date(date);
    start.setHours(i, 0, 0, 0);
    const end = new Date(date);
    end.setHours(i + 1, 0, 0, 0);
    slots.push({
      id: `${serviceId}-${i}`,
      service_id: serviceId,
      business_id,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      is_available: true,
      created_at,
      updated_at,
    });
  }
  return slots;
}

export function DateTimeSelectionStep({ 
  bookingData, 
  updateBookingData, 
  isLoading 
}: DateTimeSelectionStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(bookingData.date || undefined);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [timePreference, setTimePreference] = useState<string>('any');

  const loadTimeSlots = async (date: Date) => {
    if (!bookingData.service) {
      toast.error('Please select a service first');
      return;
    }

    setLoadingSlots(true);
    try {
      // Load time slots from dummy data (replace with real API call in the future)
      // const response = await timeSlotService.getAvailableSlots(bookingData.service.id, date);
      // setAvailableSlots(response.data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const timeSlots = generateTimeSlots(bookingData.service.id, date);
      setAvailableSlots(timeSlots);
    } catch (error) {
      console.error('Failed to load time slots:', error);
      toast.error('Failed to load available times');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots(selectedDate);
      updateBookingData({ date: selectedDate });
    }
  }, [selectedDate, updateBookingData, loadTimeSlots]);

  const formatTimeSlot = (slot: TimeSlot) => {
    const start = new Date(slot.start_time);
    const end = new Date(slot.end_time);
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMMM d');
  };

  const getFilteredSlots = () => {
    let filtered = availableSlots.filter(slot => slot.is_available);
    
    if (timePreference !== 'any') {
      const now = new Date();
      filtered = filtered.filter(slot => {
        const startTime = new Date(slot.start_time);
        const hour = startTime.getHours();
        
        switch (timePreference) {
          case 'morning':
            return hour >= 6 && hour < 12;
          case 'afternoon':
            return hour >= 12 && hour < 17;
          case 'evening':
            return hour >= 17 && hour < 22;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    updateBookingData({ timeSlot: slot });
    toast.success(`Selected: ${formatTimeSlot(slot)}`);
  };

  const disabledDays = {
    before: new Date(), // Disable past dates
  };

  const filteredSlots = getFilteredSlots();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Service Summary */}
      {bookingData.service && (
        <Card className="bg-muted/30">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg leading-tight">{bookingData.service.name}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Duration: {Math.floor(bookingData.service.duration / 60)}h {bookingData.service.duration % 60}m
                </p>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-lg sm:text-xl font-bold">${bookingData.service.price}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Date Selection */}
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              className="rounded-md border-0"
            />
            
            {selectedDate && (
              <div className="mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg">
                <div className="text-sm sm:text-base font-medium text-primary">
                  Selected: {formatDateDisplay(selectedDate)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time Selection */}
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-5 w-5" />
              Select Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            {!selectedDate ? (
              <div className="text-center text-muted-foreground py-8">
                <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-base sm:text-lg">Please select a date first</p>
              </div>
            ) : (
              <>
                {/* Time Preference Filter */}
                <div className="space-y-2">
                  <Label htmlFor="time-preference" className="text-base sm:text-sm font-medium">Time Preference</Label>
                  <Select value={timePreference} onValueChange={setTimePreference}>
                    <SelectTrigger className="h-12 sm:h-10 text-base sm:text-sm">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any" className="text-base sm:text-sm">Any time</SelectItem>
                      <SelectItem value="morning" className="text-base sm:text-sm">Morning (6 AM - 12 PM)</SelectItem>
                      <SelectItem value="afternoon" className="text-base sm:text-sm">Afternoon (12 PM - 5 PM)</SelectItem>
                      <SelectItem value="evening" className="text-base sm:text-sm">Evening (5 PM - 10 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Loading State */}
                {loadingSlots && (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">Loading available times...</p>
                  </div>
                )}

                {/* Time Slots */}
                {!loadingSlots && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base sm:text-sm font-medium">Available Times</Label>
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        {filteredSlots.length} available
                      </Badge>
                    </div>

                    {filteredSlots.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-sm sm:text-base">No available times for this date</p>
                        <p className="text-xs sm:text-sm mt-1">Try selecting a different date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {filteredSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={bookingData.timeSlot?.id === slot.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTimeSlotSelect(slot)}
                            className={cn(
                              "justify-start text-base sm:text-sm h-12 sm:h-9",
                              bookingData.timeSlot?.id === slot.id && "ring-2 ring-primary/20"
                            )}
                          >
                            {bookingData.timeSlot?.id === slot.id && (
                              <CheckCircle2 className="h-4 w-4 sm:h-3 sm:w-3 mr-2 sm:mr-1" />
                            )}
                            {format(new Date(slot.start_time), 'h:mm a')}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selected Summary */}
      {bookingData.date && bookingData.timeSlot && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-primary flex items-center gap-2 text-base sm:text-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  Appointment Scheduled
                </h3>
                <div className="mt-2 space-y-2 sm:space-y-1">
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <CalendarIcon className="h-4 w-4" />
                    {formatDateDisplay(bookingData.date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Clock className="h-4 w-4" />
                    {formatTimeSlot(bookingData.timeSlot)}
                  </div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 