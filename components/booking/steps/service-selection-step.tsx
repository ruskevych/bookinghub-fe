'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/new-york-v4/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { 
  Search, 
  Clock, 
  DollarSign, 
  Star,
  MapPin,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Import types and data
import { BookingData, ExtendedService } from '@/types/booking';
import { 
  getAllServices, 
  getServiceCategories, 
  filterServicesByCategory, 
  searchServices,
  getServicesForProvider,
  getProviderInfo
} from '@/data/booking-data';

interface ServiceSelectionStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  preSelectedServiceId?: string | null;
  preSelectedProviderId?: string | null;
  isLoading?: boolean;
}

// Note: Services now come from dummy-providers.ts data

export function ServiceSelectionStep({ 
  bookingData, 
  updateBookingData, 
  preSelectedServiceId,
  preSelectedProviderId,
  isLoading 
}: ServiceSelectionStepProps) {
  const [services, setServices] = useState<ExtendedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [isProviderSpecific, setIsProviderSpecific] = useState(!!preSelectedProviderId);
  const [providerInfo, setProviderInfo] = useState<any>(null);

  useEffect(() => {
    loadServices();
  }, [isProviderSpecific, preSelectedProviderId]);

  useEffect(() => {
    // Load provider info if preSelectedProviderId is provided
    if (preSelectedProviderId) {
      const provider = getProviderInfo(preSelectedProviderId);
      setProviderInfo(provider);
    }
  }, [preSelectedProviderId]);

  useEffect(() => {
    // Pre-select service if provided
    if (preSelectedServiceId && services.length > 0) {
      const preSelectedService = services.find(s => s.id === preSelectedServiceId);
      if (preSelectedService) {
        updateBookingData({ service: preSelectedService });
      }
    }
  }, [preSelectedServiceId, services, updateBookingData]);

  const loadServices = async () => {
    setLoading(true);
    try {
      // Load services from dummy data (replace with real API call in the future)
      // const response = await serviceService.getServices();
      // setServices(response.data.items);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let servicesToLoad: ExtendedService[];
      if (isProviderSpecific && preSelectedProviderId) {
        servicesToLoad = getServicesForProvider(preSelectedProviderId);
      } else {
        servicesToLoad = getAllServices();
      }
      
      setServices(servicesToLoad);
    } catch (error) {
      console.error('Failed to load services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Filter services using utility functions
  const categoryFiltered = filterServicesByCategory(services, selectedCategory);
  const filteredServices = searchServices(categoryFiltered, searchQuery);

  const handleServiceSelect = (service: ExtendedService) => {
    updateBookingData({ service });
    toast.success(`Selected: ${service.name}`);
  };

  const handleViewAllServices = () => {
    setIsProviderSpecific(false);
    setSelectedCategory('All Services');
    setSearchQuery('');
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Provider Header */}
      {isProviderSpecific && providerInfo && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0">
                  <AvatarImage src={providerInfo.profileImage} />
                  <AvatarFallback>
                    {providerInfo.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-primary leading-tight">{providerInfo.businessName}</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-2">by {providerInfo.name}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {providerInfo.rating} ({providerInfo.reviewCount} reviews)
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {providerInfo.city}, {providerInfo.state}
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">{providerInfo.description}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleViewAllServices}
                className="flex-shrink-0 h-11 sm:h-9 w-full sm:w-auto"
              >
                <span className="text-base sm:text-sm">View All Services</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-base sm:text-sm font-medium">Search Services</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search for services, providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 sm:h-10 text-base sm:text-sm"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-base sm:text-sm font-medium">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 sm:h-10 text-base sm:text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {getServiceCategories().map(category => (
                  <SelectItem key={category} value={category} className="text-base sm:text-sm">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Selected Service Preview */}
      {bookingData.service && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg text-primary flex items-center gap-2">
                Selected Service
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateBookingData({ service: null })}
                className="text-muted-foreground hover:text-foreground h-10 sm:h-8"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                <span className="text-sm sm:text-xs">Change</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={bookingData.service.provider_image} />
                <AvatarFallback>
                  {bookingData.service.provider_name?.split(' ').map(n => n[0]).join('') || 'S'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg leading-tight">{bookingData.service.name}</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-2 leading-relaxed">
                  {bookingData.service.provider_name}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDuration(bookingData.service.duration)}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${bookingData.service.price}
                  </div>
                  {bookingData.service.provider_rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {bookingData.service.provider_rating}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold leading-tight">
            {isProviderSpecific && providerInfo 
              ? `${providerInfo.businessName} Services (${filteredServices.length})`
              : `Available Services (${filteredServices.length})`
            }
          </h3>
        </div>
        
        <div className="grid gap-4">
          {filteredServices.map((service) => (
            <Card 
              key={service.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                bookingData.service?.id === service.id 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:border-primary/30"
              )}
              onClick={() => handleServiceSelect(service)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Provider Avatar */}
                  <Avatar className="h-16 w-16 flex-shrink-0 mx-auto sm:mx-0">
                    <AvatarImage src={service.provider_image} />
                    <AvatarFallback>
                      {service.provider_name?.split(' ').map(n => n[0]).join('') || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Service Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-1 leading-tight">{service.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground mb-2">
                          <span>{service.provider_name}</span>
                          {service.provider_rating && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <div className="flex items-center justify-center sm:justify-start gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {service.provider_rating}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-center sm:text-right flex-shrink-0 mt-2 sm:mt-0">
                        <div className="text-2xl sm:text-3xl font-bold text-primary">${service.price}</div>
                        <div className="text-sm sm:text-base text-muted-foreground">
                          {formatDuration(service.duration)}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Service Features */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm mb-3">
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(service.duration)}
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1">
                        <MapPin className="h-4 w-4" />
                        In-person
                      </div>
                    </div>
                    
                    {/* Add-ons Preview */}
                    {service.add_ons && service.add_ons.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm text-muted-foreground mb-2 text-center sm:text-left">
                          Available add-ons:
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          {service.add_ons.slice(0, 2).map(addon => (
                            <Badge key={addon.id} variant="secondary" className="text-xs sm:text-sm">
                              {addon.name} (+${addon.price})
                            </Badge>
                          ))}
                          {service.add_ons.length > 2 && (
                            <Badge variant="outline" className="text-xs sm:text-sm">
                              +{service.add_ons.length - 2} more
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

        {filteredServices.length === 0 && (
          <div className="text-center py-8">
            <div className="text-base sm:text-lg text-muted-foreground mb-4">
              No services found matching your criteria.
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Services');
              }}
              className="h-11 sm:h-10 text-base sm:text-sm"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 