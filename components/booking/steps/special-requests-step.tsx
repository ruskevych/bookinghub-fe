'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { Label } from '@/registry/new-york-v4/ui/label';
import { 
  MessageSquare, 
  Lightbulb, 
  Heart,
  Accessibility,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import types
import { BookingData } from '@/types/booking';

interface SpecialRequestsStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  isLoading?: boolean;
}

const commonRequests = [
  { id: 'allergies', text: 'I have allergies or sensitivities', icon: Heart },
  { id: 'first-time', text: 'This is my first time', icon: Lightbulb },
  { id: 'consultation', text: 'I\'d like a consultation first', icon: MessageSquare },
  { id: 'quiet', text: 'I prefer a quiet environment', icon: Accessibility },
  { id: 'photos', text: 'I don\'t want photos taken', icon: AlertCircle },
  { id: 'running-late', text: 'I might be running late', icon: Clock },
];

export function SpecialRequestsStep({ 
  bookingData, 
  updateBookingData, 
  isLoading 
}: SpecialRequestsStepProps) {
  const handleRequestChange = (value: string) => {
    updateBookingData({ specialRequests: value });
  };

  const addCommonRequest = (requestText: string) => {
    const currentRequests = bookingData.specialRequests || '';
    const newRequest = currentRequests 
      ? `${currentRequests}\n• ${requestText}`
      : `• ${requestText}`;
    
    updateBookingData({ specialRequests: newRequest });
  };

  const characterLimit = 500;
  const currentLength = (bookingData.specialRequests || '').length;
  const isNearLimit = currentLength > characterLimit * 0.8;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Service Summary */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg leading-tight">{bookingData.service?.name}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {bookingData.staffMember?.name || 'Any available staff'}
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

      {/* Special Requests Form */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MessageSquare className="h-5 w-5" />
            Special Requests & Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Quick Select Common Requests */}
          <div className="space-y-4">
            <div>
              <Label className="text-base sm:text-sm font-medium">Common Requests</Label>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Click to quickly add common requests to your notes
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {commonRequests.map((request) => {
                const Icon = request.icon;
                return (
                  <Button
                    key={request.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addCommonRequest(request.text)}
                    className="justify-start h-auto p-3 text-left h-12 sm:h-auto"
                  >
                    <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-xs">{request.text}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Text Area for Custom Requests */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="special-requests" className="text-base sm:text-sm font-medium">
                Additional Notes
              </Label>
              <Badge 
                variant={isNearLimit ? "destructive" : "secondary"}
                className="text-xs sm:text-xs"
              >
                {currentLength}/{characterLimit}
              </Badge>
            </div>
            
            <Textarea
              id="special-requests"
              placeholder="Tell us about any special requirements, preferences, or concerns you&apos;d like us to know about..."
              value={bookingData.specialRequests || ''}
              onChange={(e) => handleRequestChange(e.target.value)}
              className="min-h-[120px] resize-none text-base sm:text-sm"
              maxLength={characterLimit}
            />
            
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              This information helps us provide the best possible service for you.
              All requests will be reviewed by your service provider.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility & Safety */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Accessibility & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 text-sm sm:text-base">
            <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
              We&apos;re committed to providing accessible and safe services for everyone.
            </p>
            <ul className="space-y-2 text-blue-600 dark:text-blue-400 text-sm sm:text-base">
              <li>• Wheelchair accessible facilities</li>
              <li>• Staff trained in accessibility assistance</li>
              <li>• Allergy-aware service protocols</li>
              <li>• Flexible scheduling for special needs</li>
            </ul>
            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mt-3 leading-relaxed">
              Please let us know if you need any specific accommodations and we&apos;ll do our best to help.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Skip Option */}
      <Card className="border-dashed">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="text-center py-4">
            <p className="text-sm sm:text-base text-muted-foreground mb-2 leading-relaxed">
              No special requests? No problem!
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You can skip this step and continue with your booking. You can always contact us later if you think of anything.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 