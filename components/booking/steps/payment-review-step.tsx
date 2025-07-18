'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Checkbox } from '@/registry/new-york-v4/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/new-york-v4/ui/select';
import { Separator } from '@/registry/new-york-v4/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone,
  MapPin,
  DollarSign,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Percent
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Import types
import { BookingData } from '@/types/booking';

interface PaymentReviewStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const paymentMethods = [
  { id: 'pay-at-location', label: 'Pay at Location', icon: MapPin },
];

export function PaymentReviewStep({ 
  bookingData, 
  updateBookingData, 
  onSubmit,
  isLoading 
}: PaymentReviewStepProps) {
  const [promoCode, setPromoCode] = useState(bookingData.promoCode || '');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);

  // Auto-select payment method since there's only one option
  useEffect(() => {
    if (!bookingData.paymentMethod) {
      updateBookingData({ paymentMethod: 'pay-at-location' });
    }
  }, [bookingData.paymentMethod, updateBookingData]);

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      updateBookingData({ promoCode: promoCode.trim() });
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    updateBookingData({ promoCode: '' });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getTotalDuration = () => {
    const baseDuration = bookingData.service?.duration || 0;
    const addOnDuration = bookingData.selectedAddOns.reduce((total, addOn) => total + addOn.duration, 0);
    return baseDuration + addOnDuration;
  };

  const canSubmit = bookingData.paymentMethod && agreeToTerms && agreeToPolicy;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Booking Summary */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Booking Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Service Details */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {bookingData.service?.provider_image && (
              <Avatar className="h-16 w-16 flex-shrink-0 mx-auto sm:mx-0">
                <AvatarImage src={bookingData.service.provider_image} />
                <AvatarFallback>
                  {bookingData.service.provider_name?.split(' ').map(n => n[0]).join('') || 'S'}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold leading-tight">{bookingData.service?.name}</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-2 leading-relaxed">
                {bookingData.service?.provider_name}
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {bookingData.service?.description}
              </p>
            </div>
            <div className="text-center sm:text-right flex-shrink-0">
              <div className="text-lg sm:text-xl font-bold">${bookingData.service?.price}</div>
              <div className="text-sm sm:text-base text-muted-foreground">
                {formatDuration(bookingData.service?.duration || 0)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">
                  {bookingData.date ? format(bookingData.date, 'EEEE, MMMM d, yyyy') : 'Date not selected'}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">Date</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">
                  {bookingData.timeSlot 
                    ? format(new Date(bookingData.timeSlot.start_time), 'h:mm a')
                    : 'Time not selected'
                  }
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {formatDuration(getTotalDuration())} duration
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Staff Member */}
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-base">
                {bookingData.staffMember?.name || 'Any available staff member'}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Service provider</div>
            </div>
          </div>

          {/* Add-ons */}
          {bookingData.selectedAddOns.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="font-medium mb-3 text-base sm:text-lg">Add-on Services</div>
                <div className="space-y-3">
                  {bookingData.selectedAddOns.map((addOn) => (
                    <div key={addOn.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base">{addOn.name}</div>
                        <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">{addOn.description}</div>
                      </div>
                      <div className="text-center sm:text-right flex-shrink-0">
                        <div className="font-medium text-sm sm:text-base">${addOn.price}</div>
                        {addOn.duration > 0 && (
                          <div className="text-sm sm:text-base text-muted-foreground">+{addOn.duration}m</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Customer Information */}
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">{bookingData.customerInfo.email}</div>
                <div className="text-sm sm:text-base text-muted-foreground">Email</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm sm:text-base">{bookingData.customerInfo.phone}</div>
                <div className="text-sm sm:text-base text-muted-foreground">Phone</div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {bookingData.specialRequests && (
            <>
              <Separator />
              <div>
                <div className="font-medium mb-2 text-base sm:text-lg">Special Requests</div>
                <div className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {bookingData.specialRequests}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pricing Breakdown */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <DollarSign className="h-5 w-5" />
            Pricing Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          {/* Service Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base">{bookingData.service?.name}</span>
            <span className="text-sm sm:text-base font-medium">${bookingData.service?.price}</span>
          </div>

          {/* Add-ons */}
          {bookingData.selectedAddOns.map((addOn) => (
            <div key={addOn.id} className="flex items-center justify-between text-sm sm:text-base">
              <span>{addOn.name}</span>
              <span>${addOn.price}</span>
            </div>
          ))}

          <Separator />

          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-medium">Subtotal</span>
            <span className="text-sm sm:text-base font-medium">${bookingData.subtotal}</span>
          </div>

          {/* Discount */}
          {bookingData.discount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <Percent className="h-4 w-4" />
                Discount {bookingData.promoCode && `(${bookingData.promoCode})`}
              </span>
              <span className="text-sm sm:text-base">-${bookingData.discount}</span>
            </div>
          )}

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between text-lg sm:text-xl font-bold">
            <span>Total</span>
            <span>${bookingData.total}</span>
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Tag className="h-5 w-5" />
            Promo Code
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {!bookingData.promoCode ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 h-12 sm:h-10 text-base sm:text-sm"
              />
              <Button 
                variant="outline" 
                onClick={applyPromoCode}
                disabled={!promoCode.trim()}
                className="h-12 sm:h-10 text-base sm:text-sm"
              >
                Apply
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">Promo code applied: {bookingData.promoCode}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={removePromoCode} className="h-10 sm:h-8 text-sm">
                Remove
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4">
            <Select 
              value={bookingData.paymentMethod} 
              onValueChange={(value) => updateBookingData({ paymentMethod: value })}
            >
              <SelectTrigger className="h-12 sm:h-10 text-base sm:text-sm">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id} className="text-base sm:text-sm">
                    <div className="flex items-center gap-2">
                      <method.icon className="h-4 w-4" />
                      {method.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {bookingData.paymentMethod === 'pay-at-location' && (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">Pay at Location</span>
                </div>
                <p className="text-sm sm:text-base text-green-600 dark:text-green-400 mt-1 leading-relaxed">
                  Payment will be made directly at the service location. You can pay with cash, card, or any method accepted by the provider.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                className="mt-1"
              />
              <div className="text-sm sm:text-base">
                <Label className="font-medium">
                  I agree to the Terms of Service and Booking Policy
                </Label>
                <p className="text-muted-foreground mt-1 leading-relaxed">
                  This includes cancellation policies, no-show fees, and service guidelines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox 
                checked={agreeToPolicy}
                onCheckedChange={(checked) => setAgreeToPolicy(checked === true)}
                className="mt-1"
              />
              <div className="text-sm sm:text-base">
                <Label className="font-medium">
                  I agree to the Privacy Policy
                </Label>
                <p className="text-muted-foreground mt-1 leading-relaxed">
                  Your personal information will be used only for booking purposes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Cancellation Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-2 text-sm sm:text-base text-amber-700 dark:text-amber-300">
            <p>• Free cancellation up to 24 hours before appointment</p>
            <p>• 50% charge for cancellations within 24 hours</p>
            <p>• Full charge for no-shows or same-day cancellations</p>
            <p>• Rescheduling is free with 12+ hours notice</p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <Button
            onClick={onSubmit}
            disabled={!canSubmit || isLoading}
            className="w-full h-14 sm:h-12 text-base sm:text-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Confirm Booking & Pay ${bookingData.total}
                <CheckCircle2 className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          
          {!canSubmit && (
            <p className="text-center text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
              Please select a payment method and agree to the terms to continue
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 