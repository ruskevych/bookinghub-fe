'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Calendar } from "@/registry/new-york-v4/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/registry/new-york-v4/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import type { AvailabilitySlot, Service, BusinessHours } from '@/types/provider';

const CALENDAR_VIEW_OPTIONS = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];
const SLOT_STATUS_CONFIG = {
  available: { label: 'Available', color: 'green' },
  booked: { label: 'Booked', color: 'red' },
  pending: { label: 'Pending', color: 'yellow' },
};
function formatTimeSlot(slot: AvailabilitySlot) {
  return `${slot.startTime} - ${slot.endTime}`;
}

interface ProviderCalendarProps {
  availability: AvailabilitySlot[];
  services: Service[];
  businessHours: BusinessHours;
  onBookSlot: (serviceId: string, slot: { date: string; time: string }) => Promise<void>;
}

export function ProviderCalendar({
  availability,
  services,
  businessHours,
  onBookSlot
}: ProviderCalendarProps) {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>(isMobile ? 'month' : 'week');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Get current week or month slots
  const visibleSlots = useMemo(() => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return availability.filter(slot => {
        const slotDate = new Date(slot.date);
        return slotDate >= weekStart && slotDate <= weekEnd;
      });
    } else {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return availability.filter(slot => {
        const slotDate = new Date(slot.date);
        return slotDate >= monthStart && slotDate <= monthEnd;
      });
    }
  }, [availability, currentDate, viewMode]);

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const grouped: { [key: string]: AvailabilitySlot[] } = {};
    visibleSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    
    // Sort slots by time for each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    
    return grouped;
  }, [visibleSlots]);

  const handlePrevious = () => {
    if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const handleSlotClick = (slot: AvailabilitySlot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
      setShowBookingModal(true);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !selectedService) return;
    
    try {
      await onBookSlot(selectedService, {
        date: selectedSlot.date,
        time: selectedSlot.startTime
      });
      setShowBookingModal(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const isDateAvailable = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const daySlots = slotsByDate[dateString];
    return daySlots && daySlots.some(slot => slot.status === 'available');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold">Availability</h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            Select a date and time to book an appointment
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(value: 'week' | 'month') => setViewMode(value)}>
            <SelectTrigger className="w-32 min-h-[44px] touch-manipulation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevious}
              className="min-h-[44px] min-w-[44px] touch-manipulation"
              aria-label="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h3 className="text-base lg:text-lg font-semibold text-center">
              {viewMode === 'week' 
                ? `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM yyyy')
              }
            </h3>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              className="min-h-[44px] min-w-[44px] touch-manipulation"
              aria-label="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {viewMode === 'week' ? (
            <WeekView
              currentDate={currentDate}
              slotsByDate={slotsByDate}
              businessHours={businessHours}
              onSlotClick={handleSlotClick}
            />
          ) : (
            <div className="space-y-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentDate}
                onMonthChange={setCurrentDate}
                modifiers={{
                  available: (date) => isDateAvailable(date),
                  booked: (date) => {
                    const dateString = format(date, 'yyyy-MM-dd');
                    const daySlots = slotsByDate[dateString];
                    return daySlots && daySlots.every(slot => slot.status === 'busy');
                  }
                }}
                modifiersStyles={{
                  available: {
                    backgroundColor: 'rgb(22 163 74)', // green-600
                    color: 'white',
                    fontWeight: '500'
                  },
                  booked: {
                    backgroundColor: 'rgb(249 115 22)', // orange-500
                    color: 'white',
                    fontWeight: '500'
                  }
                }}
                className="rounded-md border"
              />
              
              {selectedDate && (
                <TimeSlots
                  date={selectedDate}
                  slots={slotsByDate[format(selectedDate, 'yyyy-MM-dd')] || []}
                  onSlotClick={handleSlotClick}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <BookingForm
            slot={selectedSlot}
            services={services}
            selectedService={selectedService}
            onServiceChange={setSelectedService}
            onBook={handleBooking}
            onCancel={() => setShowBookingModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface WeekViewProps {
  currentDate: Date;
  slotsByDate: { [key: string]: AvailabilitySlot[] };
  businessHours: BusinessHours;
  onSlotClick: (slot: AvailabilitySlot) => void;
}

function WeekView({ currentDate, slotsByDate, businessHours, onSlotClick }: WeekViewProps) {
  const isMobile = useIsMobile();
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate)
  });

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9; // 9 AM to 6 PM (excluding lunch hour)
    if (hour === 12) return null; // Skip lunch hour
    return `${hour.toString().padStart(2, '0')}:00`;
  }).filter(Boolean) as string[];

  const formatDisplayTime = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}${ampm}`;
  };

  // Mobile view: Show each day as a separate card
  if (isMobile) {
    return (
      <div className="space-y-4">
        {weekDays.map(day => {
          const dayName = format(day, 'EEE');
          const dateStr = format(day, 'd');
          const monthStr = format(day, 'MMM');
          const isToday = isSameDay(day, new Date());
          const dateString = format(day, 'yyyy-MM-dd');
          const daySlots = slotsByDate[dateString] || [];
          
          return (
            <Card key={day.toISOString()}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "text-lg font-semibold",
                    isToday ? "text-primary" : "text-foreground"
                  )}>
                    {dayName}
                  </div>
                  <div className={cn(
                    "text-sm",
                    isToday ? "text-primary font-medium" : "text-muted-foreground"
                  )}>
                    {monthStr} {dateStr}
                  </div>
                  {isToday && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {daySlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {daySlots.map(slot => (
                      <Button
                        key={slot.id}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-12 text-sm font-medium border-2 transition-all duration-200",
                          slot.status === 'available' && [
                            "bg-green-50 border-green-200 text-green-700",
                            "hover:bg-green-100 hover:border-green-300 hover:shadow-sm"
                          ],
                          slot.status === 'busy' && [
                            "bg-orange-50 border-orange-200 text-orange-700 cursor-not-allowed",
                            "hover:bg-orange-50"
                          ],
                          slot.status === 'blocked' && [
                            "bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed",
                            "hover:bg-slate-50"
                          ]
                        )}
                        onClick={() => slot.status === 'available' && onSlotClick(slot)}
                        disabled={slot.status !== 'available'}
                        aria-label={`${formatDisplayTime(slot.startTime)} - ${slot.status}`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            slot.status === 'available' && "bg-green-600",
                            slot.status === 'busy' && "bg-orange-500",
                            slot.status === 'blocked' && "bg-slate-400"
                          )}></div>
                          <span className="text-xs capitalize">
                            {formatDisplayTime(slot.startTime)}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No slots available
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Desktop view: Show traditional grid layout
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="grid grid-cols-8 gap-3 min-w-[800px]">
        {/* Header */}
        <div className="py-4"></div>
        {weekDays.map(day => {
          const dayName = format(day, 'EEE');
          const dateStr = format(day, 'd');
          const monthStr = format(day, 'MMM');
          const isToday = isSameDay(day, new Date());
          
          return (
            <div key={day.toISOString()} className="text-center py-4">
              <div className={cn(
                "text-lg font-semibold mb-1",
                isToday ? "text-primary" : "text-foreground"
              )}>
                {dayName}
              </div>
              <div className={cn(
                "text-sm",
                isToday ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {monthStr} {dateStr}
              </div>
              {isToday && (
                <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-2"></div>
              )}
            </div>
          );
        })}

        {/* Time slots */}
        {timeSlots.map(time => (
          <React.Fragment key={time}>
            <div className="py-3 pr-4 text-right">
              <div className="text-sm font-medium text-muted-foreground">
                {formatDisplayTime(time)}
              </div>
            </div>
            {weekDays.map(day => {
              const dateString = format(day, 'yyyy-MM-dd');
              const daySlots = slotsByDate[dateString] || [];
              const timeSlot = daySlots.find(slot => slot.startTime === time);
              
              return (
                <div key={`${day.toISOString()}-${time}`} className="py-1">
                  {timeSlot ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full h-12 text-sm font-medium border-2 transition-all duration-200",
                        timeSlot.status === 'available' && [
                          "bg-green-50 border-green-200 text-green-700",
                          "hover:bg-green-100 hover:border-green-300 hover:shadow-sm"
                        ],
                        timeSlot.status === 'busy' && [
                          "bg-orange-50 border-orange-200 text-orange-700 cursor-not-allowed",
                          "hover:bg-orange-50"
                        ],
                        timeSlot.status === 'blocked' && [
                          "bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed",
                          "hover:bg-slate-50"
                        ]
                      )}
                      onClick={() => timeSlot.status === 'available' && onSlotClick(timeSlot)}
                      disabled={timeSlot.status !== 'available'}
                      aria-label={`${formatDisplayTime(time)} - ${timeSlot.status}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          timeSlot.status === 'available' && "bg-green-600",
                          timeSlot.status === 'busy' && "bg-orange-500",
                          timeSlot.status === 'blocked' && "bg-slate-400"
                        )}></div>
                        <span className="capitalize">
                          {timeSlot.status === 'available' ? 'Open' : 
                           timeSlot.status === 'busy' ? 'Busy' : 'Blocked'}
                        </span>
                      </div>
                    </Button>
                  ) : (
                    <div className="w-full h-12 border-2 border-dashed border-gray-200 rounded bg-gray-50/50"></div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

interface TimeSlotsProps {
  date: Date;
  slots: AvailabilitySlot[];
  onSlotClick: (slot: AvailabilitySlot) => void;
}

function TimeSlots({ date, slots, onSlotClick }: TimeSlotsProps) {
  const formatDisplayTime = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  if (slots.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 lg:p-8 text-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
          </div>
          <h4 className="font-medium text-base lg:text-lg mb-2">No appointments available</h4>
          <p className="text-sm lg:text-base text-muted-foreground">
            No time slots available for {format(date, 'EEEE, MMM d, yyyy')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const availableSlots = slots.filter(slot => slot.status === 'available');
  const busySlots = slots.filter(slot => slot.status === 'busy');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
          <CalendarIcon className="w-4 h-4 lg:w-5 lg:h-5" />
          {format(date, 'EEEE, MMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {availableSlots.length > 0 && (
          <div>
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2 text-sm lg:text-base">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              Available Times ({availableSlots.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSlots.map(slot => (
                <Button
                  key={slot.id}
                  variant="outline"
                  size="default"
                  className="h-12 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 hover:shadow-sm transition-all duration-200 font-medium min-h-[44px] touch-manipulation"
                  onClick={() => onSlotClick(slot)}
                  aria-label={`Book appointment at ${formatDisplayTime(slot.startTime)}`}
                >
                  {formatDisplayTime(slot.startTime)}
                </Button>
              ))}
            </div>
          </div>
        )}

        {busySlots.length > 0 && (
          <div>
            <h4 className="font-medium text-orange-700 mb-3 flex items-center gap-2 text-sm lg:text-base">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              Unavailable Times ({busySlots.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {busySlots.map(slot => (
                <Button
                  key={slot.id}
                  variant="outline"
                  size="default"
                  className="h-12 bg-orange-50 border-orange-200 text-orange-700 cursor-not-allowed opacity-60 font-medium min-h-[44px]"
                  disabled
                  aria-label={`Unavailable at ${formatDisplayTime(slot.startTime)}`}
                >
                  {formatDisplayTime(slot.startTime)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface BookingFormProps {
  slot: AvailabilitySlot | null;
  services: Service[];
  selectedService: string;
  onServiceChange: (serviceId: string) => void;
  onBook: () => Promise<void>;
  onCancel: () => void;
}

function BookingForm({
  slot,
  services,
  selectedService,
  onServiceChange,
  onBook,
  onCancel
}: BookingFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      await onBook();
  };

  if (!slot) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Selected Time</label>
        <div className="p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span className="font-medium">
              {format(new Date(slot.date), 'EEEE, MMM d, yyyy')} at {slot.startTime}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Select Service</label>
        <Select value={selectedService} onValueChange={onServiceChange}>
          <SelectTrigger className="min-h-[44px] touch-manipulation">
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map(service => (
              <SelectItem key={service.id} value={service.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{service.name}</span>
                  <span className="text-muted-foreground">${service.price}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 min-h-[44px] touch-manipulation"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!selectedService}
          className="flex-1 min-h-[44px] touch-manipulation"
        >
          Book Appointment
        </Button>
      </div>
    </form>
  );
} 