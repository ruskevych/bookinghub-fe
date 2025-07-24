'use client';

import React from 'react';
import { Button } from "@/registry/new-york-v4/ui/button";
import { Card } from "@/registry/new-york-v4/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york-v4/ui/avatar";
import { 
  Calendar, 
  MessageCircle, 
  Star,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Provider } from '@/types/provider';
// TODO: Define getInitials inline or remove if not needed

interface StickyBookingWidgetProps {
  provider: Provider;
  onBook: () => void;
  onMessage: () => void;
  className?: string;
}

export function StickyBookingWidget({ 
  provider, 
  onBook, 
  onMessage, 
  className 
}: StickyBookingWidgetProps) {
  const initials = provider.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg p-0.5 lg:p-4 pb-safe overflow-hidden",
      className
    )}>
              <Card className="w-full max-w-md mx-auto overflow-hidden">
          <div className="p-1 lg:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-8 w-8 lg:h-12 lg:w-12 flex-shrink-0">
              <AvatarImage src={provider.profileImage} alt={provider.name} />
              <AvatarFallback className="text-xs lg:text-sm">{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xs lg:text-sm truncate">{provider.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{provider.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({provider.totalReviews})
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Starting at ${provider.startingPrice}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={onBook} 
              className="w-full min-h-[40px] touch-manipulation px-0"
              aria-label="Book an appointment with this provider"
            >
              <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline ml-2">Book Now</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={onMessage} 
              className="w-full min-h-[40px] touch-manipulation px-0"
              aria-label="Send a message to this provider"
            >
              <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline ml-2">Message</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 