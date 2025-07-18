'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { 
  RefreshCw, 
  X, 
  Share, 
  Clock, 
  AlertCircle,
  Calendar,
  MessageCircle,
  Star
} from 'lucide-react';
import { format, isBefore, subHours } from 'date-fns';
import type { Booking } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/new-york-v4/ui/alert-dialog';

interface BookingActionsProps {
  booking: Booking;
  onReschedule?: () => void;
  onCancel?: () => void;
  onShare?: () => void;
  isSharing?: boolean;
}

export function BookingActions({ 
  booking, 
  onReschedule, 
  onCancel, 
  onShare, 
  isSharing = false 
}: BookingActionsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  // Check if booking can be modified (24 hours before appointment)
  const appointmentTime = new Date(booking.start_time);
  const modificationDeadline = subHours(appointmentTime, 24);
  const canModify = !isBefore(new Date(), modificationDeadline) && booking.status !== 'Cancelled';
  const canCancel = booking.status === 'Confirmed' || booking.status === 'Pending';
  const canReschedule = booking.status === 'Confirmed' || booking.status === 'Pending';

  const formatDeadline = () => {
    return format(modificationDeadline, 'EEEE, MMMM dd, yyyy \'at\' h:mm a');
  };

  const getCancellationFee = () => {
    const hoursBeforeAppointment = (appointmentTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    
    if (hoursBeforeAppointment >= 24) return 0;
    if (hoursBeforeAppointment >= 12) return 0.25; // 25% fee
    if (hoursBeforeAppointment >= 2) return 0.5;   // 50% fee
    return 1; // 100% fee (no refund)
  };

  const cancellationFee = getCancellationFee();
  const refundAmount = booking.service?.price ? booking.service.price * (1 - cancellationFee) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Manage Booking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Modification Status */}
        <div className="space-y-3">
          {canModify ? (
            <div className="flex items-start space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-900 dark:text-green-100">
                  Modification Available
                </p>
                <p className="text-green-700 dark:text-green-200">
                  You can reschedule or cancel until {formatDeadline()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-900 dark:text-orange-100">
                  Modification Deadline Passed
                </p>
                <p className="text-orange-700 dark:text-orange-200">
                  Contact the provider directly for changes within 24 hours
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={onReschedule}
              disabled={!canReschedule || !canModify}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reschedule
            </Button>
            
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  disabled={!canCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Booking
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-3">
                      <p>Are you sure you want to cancel your appointment?</p>
                      
                      {booking.service?.price && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Refund Information</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Original booking fee:</span>
                              <span>${booking.service.price.toFixed(2)}</span>
                            </div>
                            {cancellationFee > 0 && (
                              <div className="flex justify-between text-red-600 dark:text-red-400">
                                <span>Cancellation fee ({(cancellationFee * 100).toFixed(0)}%):</span>
                                <span>-${(booking.service.price * cancellationFee).toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Refund amount:</span>
                              <span className={refundAmount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                ${refundAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        Refunds typically process within 3-5 business days.
                      </p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onCancel}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Cancel Appointment
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onShare}
            disabled={isSharing}
          >
            <Share className="h-4 w-4 mr-2" />
            {isSharing ? 'Sharing...' : 'Share Appointment Details'}
          </Button>
        </div>

        {/* Policies */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Booking Policies</h4>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Free cancellation up to 24 hours before appointment</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Reschedule up to 24 hours in advance at no extra cost</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Late cancellations (within 24 hours) may incur fees</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>No-shows are charged the full service fee</p>
            </div>
          </div>
        </div>

        {/* Contact Provider */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            Need Help?
          </h4>
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2">
              <MessageCircle className="h-4 w-4 mr-2" />
              <div className="text-left">
                <p className="font-medium">Message Provider</p>
                <p className="text-xs text-gray-500">Get quick answers to your questions</p>
              </div>
            </Button>
            
            <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-2">
              <Star className="h-4 w-4 mr-2" />
              <div className="text-left">
                <p className="font-medium">Rate & Review</p>
                <p className="text-xs text-gray-500">Share your experience (after appointment)</p>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 