'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Checkbox } from '@/registry/new-york-v4/ui/checkbox';
import { 
  Plus, 
  Minus, 
  Clock, 
  DollarSign,
  ShoppingCart,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import types
import { BookingData, AddOnService } from '@/types/booking';

interface AddOnServicesStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  isLoading?: boolean;
}

export function AddOnServicesStep({ 
  bookingData, 
  updateBookingData, 
  isLoading 
}: AddOnServicesStepProps) {
  const availableAddOns = bookingData.service?.add_ons || [];
  const selectedAddOns = bookingData.selectedAddOns || [];

  const toggleAddOn = (addOn: AddOnService) => {
    const isSelected = selectedAddOns.some(selected => selected.id === addOn.id);
    
    if (isSelected) {
      const newAddOns = selectedAddOns.filter(selected => selected.id !== addOn.id);
      updateBookingData({ selectedAddOns: newAddOns });
    } else {
      const newAddOns = [...selectedAddOns, addOn];
      updateBookingData({ selectedAddOns: newAddOns });
    }
  };

  const getTotalAddOnPrice = () => {
    return selectedAddOns.reduce((total, addOn) => total + addOn.price, 0);
  };

  const getTotalDuration = () => {
    const baseDuration = bookingData.service?.duration || 0;
    const addOnDuration = selectedAddOns.reduce((total, addOn) => total + addOn.duration, 0);
    return baseDuration + addOnDuration;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Current Selection Summary */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-base sm:text-lg leading-tight">{bookingData.service?.name}</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Base service</p>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold">{formatDuration(getTotalDuration())}</div>
              <p className="text-sm sm:text-base text-muted-foreground">Total duration</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-lg sm:text-xl font-bold">${(bookingData.service?.price || 0) + getTotalAddOnPrice()}</div>
              <p className="text-sm sm:text-base text-muted-foreground">Total price</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Add-ons Summary */}
      {selectedAddOns.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg text-primary flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Selected Add-ons ({selectedAddOns.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-3">
              {selectedAddOns.map((addOn) => (
                <div key={addOn.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base">{addOn.name}</div>
                    <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">{addOn.description}</div>
                  </div>
                  <div className="text-center sm:text-right flex-shrink-0">
                    <div className="font-bold text-sm sm:text-base">${addOn.price}</div>
                    {addOn.duration > 0 && (
                      <div className="text-sm sm:text-base text-muted-foreground">+{addOn.duration}m</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Add-ons */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Enhance Your Experience
          </h3>
          {availableAddOns.length > 0 && (
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {availableAddOns.length} available
            </Badge>
          )}
        </div>

        {availableAddOns.length === 0 ? (
          <Card>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-base sm:text-lg">No add-on services available for this selection.</p>
                <p className="text-sm sm:text-base mt-1">You can continue to the next step.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {availableAddOns.map((addOn) => {
              const isSelected = selectedAddOns.some(selected => selected.id === addOn.id);
              
              return (
                <Card 
                  key={addOn.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    isSelected 
                      ? "ring-2 ring-primary bg-primary/5" 
                      : "hover:border-primary/30"
                  )}
                  onClick={() => toggleAddOn(addOn)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleAddOn(addOn)}
                        className="mt-1 self-start"
                      />
                      
                      {/* Add-on Details */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold mb-1 leading-tight">{addOn.name}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground mb-3 leading-relaxed">
                              {addOn.description}
                            </p>
                          </div>
                          <div className="text-center sm:text-right flex-shrink-0">
                            <div className="text-lg sm:text-xl font-bold text-primary">${addOn.price}</div>
                            {addOn.duration > 0 && (
                              <div className="text-sm sm:text-base text-muted-foreground">
                                +{addOn.duration} min
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Features */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base mb-3">
                          <div className="flex items-center justify-center sm:justify-start gap-1">
                            <DollarSign className="h-4 w-4" />
                            Additional ${addOn.price}
                          </div>
                          {addOn.duration > 0 && (
                            <div className="flex items-center justify-center sm:justify-start gap-1">
                              <Clock className="h-4 w-4" />
                              +{addOn.duration} minutes
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Toggle Button */}
                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAddOn(addOn);
                        }}
                        className="h-10 sm:h-8 text-sm sm:text-xs w-full sm:w-auto"
                      >
                        {isSelected ? (
                          <>
                            <Minus className="h-4 w-4 mr-1" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Skip Option */}
      <Card className="border-dashed">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="text-center py-4">
            <p className="text-sm sm:text-base text-muted-foreground mb-2 leading-relaxed">
              Don&apos;t need any add-ons? That&apos;s perfectly fine!
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You can continue with just your main service or add these later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 