'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Progress } from '@/registry/new-york-v4/ui/progress';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Import step components
import {
  ServiceSelectionStep,
  DateTimeSelectionStep,
  StaffSelectionStep,
  AddOnServicesStep,
  SpecialRequestsStep,
  CustomerInfoStep,
  PaymentReviewStep,
} from './steps';

// Import types
import { BookingData, BookingStep, BOOKING_STEPS } from '@/types/booking';
import { useCreateBooking } from '@/hooks/use-create-booking';

interface BookingWizardProps {
  preSelectedServiceId?: string | null;
  preSelectedProviderId?: string | null;
}

export function BookingWizard({ 
  preSelectedServiceId, 
  preSelectedProviderId 
}: BookingWizardProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<BookingStep[]>(BOOKING_STEPS);
  const [isLoading, setIsLoading] = useState(false);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    date: null,
    timeSlot: null,
    staffMember: null,
    selectedAddOns: [],
    specialRequests: '',
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      emergencyContact: '',
      accessibilityNeeds: '',
    },
    paymentMethod: '',
    promoCode: '',
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Update steps based on current progress
  useEffect(() => {
    setSteps(prevSteps => 
      prevSteps.map((step, index) => ({
        ...step,
        completed: index < currentStepIndex,
        current: index === currentStepIndex,
      }))
    );
  }, [currentStepIndex]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex]);

  // Calculate totals when booking data changes
  useEffect(() => {
    const subtotal = (bookingData.service?.price || 0) + 
      bookingData.selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    
    const discount = bookingData.promoCode ? subtotal * 0.1 : 0; // 10% discount for demo
    const total = subtotal - discount;

    setBookingData(prev => ({
      ...prev,
      subtotal,
      discount,
      total,
    }));
  }, [bookingData.service, bookingData.selectedAddOns, bookingData.promoCode]);

  const updateBookingData = useCallback((newData: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...newData }));
  }, []);

  const canProceedToNext = (): boolean => {
    switch (currentStep.id) {
      case 'service':
        return !!bookingData.service;
      case 'datetime':
        return !!bookingData.date && !!bookingData.timeSlot;
      case 'staff':
        return !!bookingData.staffMember;
      case 'addons':
        return true; // Optional step
      case 'requests':
        return true; // Optional step
      case 'info':
        return !!(bookingData.customerInfo.name && 
                 bookingData.customerInfo.email && 
                 bookingData.customerInfo.phone);
      case 'payment':
        return !!bookingData.paymentMethod;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      toast.error('Please complete all required fields before continuing');
      return;
    }

    if (isLastStep) {
      handleSubmitBooking();
    } else {
      setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow clicking on completed steps or the current step
    if (stepIndex <= currentStepIndex) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const { createBooking, loading, error } = useCreateBooking();
  const handleSubmitBooking = async () => {
    setIsLoading(true);
    try {
      const bookingPayload = {
        service_id: bookingData.service!.id,
        time_slot_id: bookingData.timeSlot!.id,
        notes: bookingData.specialRequests,
        // Add other fields as needed by your API
      };

      const response = await createBooking(bookingPayload);
      
      toast.success('Booking confirmed! Check your email for details.');
      router.push(`/booking-confirmation?booking_id=${response.data.id}`);
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      bookingData,
      updateBookingData,
      onNext: handleNext,
      onPrevious: handlePrevious,
      isLoading,
    };

    switch (currentStep.id) {
      case 'service':
        return <ServiceSelectionStep {...stepProps} preSelectedServiceId={preSelectedServiceId} preSelectedProviderId={preSelectedProviderId} />;
      case 'datetime':
        return <DateTimeSelectionStep {...stepProps} />;
      case 'staff':
        return <StaffSelectionStep {...stepProps} />;
      case 'addons':
        return <AddOnServicesStep {...stepProps} />;
      case 'requests':
        return <SpecialRequestsStep {...stepProps} />;
      case 'info':
        return <CustomerInfoStep {...stepProps} />;
      case 'payment':
        return <PaymentReviewStep {...stepProps} onSubmit={handleSubmitBooking} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 h-11 px-3 sm:h-9 sm:px-2"
              >
                <ArrowLeft className="h-4 w-4 sm:h-3 sm:w-3" />
                <span className="text-base sm:text-sm">Back</span>
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold leading-tight">Book Your Appointment</h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-sm sm:text-base text-muted-foreground font-medium">
                {Math.round(progress)}% Complete
              </div>
              <Progress value={progress} className="w-24 sm:w-32 h-2 sm:h-3" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Steps Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Booking Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                      step.current && "bg-primary/10 border border-primary/20",
                      step.completed && "bg-green-50 dark:bg-green-950/20",
                      index <= currentStepIndex ? "hover:bg-muted" : "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => handleStepClick(index)}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                      step.completed 
                        ? "bg-green-500 text-white" 
                        : step.current 
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {step.completed ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-medium text-sm",
                        step.current && "text-primary"
                      )}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Mobile Progress Indicator */}
          <div className="lg:hidden mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-primary">{currentStep.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{currentStep.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-4 sm:space-y-6">
              {/* Step Content */}
              <Card>
                <CardHeader className="pb-4 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl flex items-center gap-2 leading-tight">
                        {currentStep.title}
                        {steps[currentStepIndex].completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                        {currentStep.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-6">
                  {renderCurrentStep()}
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card>
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={isFirstStep}
                      className="flex items-center justify-center gap-2 h-12 sm:h-10 order-2 sm:order-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="text-base sm:text-sm">Previous</span>
                    </Button>
                    
                    <Button
                      onClick={handleNext}
                      disabled={!canProceedToNext() || isLoading}
                      className="flex items-center justify-center gap-2 h-12 sm:h-10 order-1 sm:order-2"
                    >
                      <span className="text-base sm:text-sm">
                        {isLastStep ? 'Complete Booking' : 'Continue'}
                      </span>
                      {!isLastStep && <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 