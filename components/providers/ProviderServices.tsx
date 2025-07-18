'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { 
  Clock, 
  DollarSign, 
  Star, 
  Grid3X3, 
  List,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Service } from '@/types/provider';
import { VIEW_MODE_OPTIONS } from '@/data/dummy-ui-data';

interface ProviderServicesProps {
  services: Service[];
  onBookService: (serviceId: string, slot: { date: string; time: string }) => Promise<void>;
  viewMode?: 'featured' | 'full';
}

export function ProviderServices({ 
  services, 
  onBookService, 
  viewMode = 'full' 
}: ProviderServicesProps) {
  const isMobile = useIsMobile();
  const [viewType, setViewType] = useState<'grid' | 'list'>(isMobile ? 'list' : 'grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories from services
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];
  
  // Filter services based on view mode and category
  const filteredServices = services
    .filter(service => selectedCategory === 'All' || service.category === selectedCategory)
    .slice(0, viewMode === 'featured' ? 3 : undefined);

  const handleBookNow = async (serviceId: string) => {
    // In a real app, this would open a booking modal or navigate to booking page
    // For now, we'll use the next available slot
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    await onBookService(serviceId, {
      date: tomorrow.toISOString().split('T')[0],
      time: '10:00'
    });
  };

  return (
    <div className="space-y-6">
      {viewMode === 'full' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold">Services</h2>
            <p className="text-sm lg:text-base text-muted-foreground">
              Choose from {services.length} available services
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
            {/* Category Filter - Scrollable on mobile */}
            <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2 sm:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs whitespace-nowrap min-h-[44px] touch-manipulation"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <Separator orientation="vertical" className="hidden sm:block h-6" />
            
            {/* View Toggle */}
            <div className="flex gap-1">
              <Button
                variant={viewType === 'grid' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewType('grid')}
                className="min-h-[44px] min-w-[44px] touch-manipulation"
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewType === 'list' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewType('list')}
                className="min-h-[44px] min-w-[44px] touch-manipulation"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'featured' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg lg:text-xl font-semibold">Popular Services</h3>
          <Button variant="outline" size="sm" className="min-h-[44px] touch-manipulation">
            View All Services
          </Button>
        </div>
      )}

      {/* Services Grid/List */}
      <div className={cn(
        viewType === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-4",
        "overflow-hidden"
      )}>
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            viewType={viewType}
            onBookNow={() => handleBookNow(service.id)}
          />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No services found in this category.
          </p>
        </div>
      )}
    </div>
  );
}

interface ServiceCardProps {
  service: Service;
  viewType: 'grid' | 'list';
  onBookNow: () => void;
}

function ServiceCard({ service, viewType, onBookNow }: ServiceCardProps) {
  if (viewType === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow overflow-hidden">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-base lg:text-lg break-words flex-1 min-w-0">{service.name}</h3>
                    {service.isPopular && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {service.category}
                  </Badge>
                </div>
                <div className="text-right sm:text-left lg:text-right flex-shrink-0">
                  <div className="text-xl lg:text-2xl font-bold">${service.price}</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">
                    {service.duration} mins
                  </div>
                </div>
              </div>
              
              <p className="text-xs lg:text-sm text-muted-foreground break-words">{service.description}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                    {service.duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    {service.isAvailable ? (
                      <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600" />
                    )}
                    <span className={cn(
                      service.isAvailable ? "text-green-600" : "text-orange-600"
                    )}>
                      {service.isAvailable ? 'Available' : 'Limited'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="min-h-[44px] touch-manipulation text-xs"
                    aria-label="Schedule this service"
                  >
                    <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    Schedule
                  </Button>
                  <Button 
                    size="sm"
                    onClick={onBookNow}
                    disabled={!service.isAvailable}
                    className="min-h-[44px] touch-manipulation text-xs"
                    aria-label={`Book ${service.name} now`}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2 gap-2">
          <CardTitle className="text-base lg:text-lg break-words flex-1 min-w-0">{service.name}</CardTitle>
          {service.isPopular && (
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="text-xs w-fit">
          {service.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="pt-0 flex flex-col h-full">
        <p className="text-xs lg:text-sm text-muted-foreground mb-4 flex-1 break-words">
          {service.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs lg:text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
              {service.duration} min
            </div>
            <div className="flex items-center gap-1">
              {service.isAvailable ? (
                <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600" />
              )}
              <span className={cn(
                "text-xs lg:text-sm",
                service.isAvailable ? "text-green-600" : "text-orange-600"
              )}>
                {service.isAvailable ? 'Available' : 'Limited'}
              </span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between gap-2">
            <div className="text-lg lg:text-2xl font-bold">${service.price}</div>
            <Button 
              size="sm"
              onClick={onBookNow}
              disabled={!service.isAvailable}
              className="flex-shrink-0 min-h-[44px] touch-manipulation text-xs"
              aria-label={`Book ${service.name} now`}
            >
              Book Now
            </Button>
          </div>
        </div>
        
        {service.requirements && service.requirements.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Requirements: {service.requirements.join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 