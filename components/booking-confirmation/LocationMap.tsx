'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Car, 
  Clock,
  ExternalLink,
  Smartphone,
  Info
} from 'lucide-react';
import type { Booking } from '@/lib/api';

interface LocationMapProps {
  booking: Booking;
}

export function LocationMap({ booking }: LocationMapProps) {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const { getExtendedBooking } = await import('@/data/dummy-bookings');
        const extendedBooking = getExtendedBooking(booking.id);
        setLocation(extendedBooking?.location || null);
      } catch (error) {
        console.error('Failed to load location data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocationData();
  }, [booking.id]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Location & Directions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!location) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Location & Directions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Location information not available</p>
        </CardContent>
      </Card>
    );
  }

  const getDirectionsUrl = (service: 'google' | 'apple' | 'waze') => {
    const query = encodeURIComponent(location.fullAddress);
    
    switch (service) {
      case 'google':
        return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
      case 'apple':
        return `http://maps.apple.com/?daddr=${query}`;
      case 'waze':
        return `https://waze.com/ul?q=${query}`;
      default:
        return `https://www.google.com/maps/search/${query}`;
    }
  };

  const shareLocation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Location for ${booking.service_name}`,
          text: `${location.name} - ${location.fullAddress}`,
          url: getDirectionsUrl('google')
        });
      } catch (error) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(`${location.name}\n${location.fullAddress}\n${getDirectionsUrl('google')}`);
      }
    } else {
      // Fallback to copying to clipboard
      await navigator.clipboard.writeText(`${location.name}\n${location.fullAddress}\n${getDirectionsUrl('google')}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Location & Directions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Address Information */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {location.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {location.address}<br />
              {location.city}, {location.state} {location.zipCode}
            </p>
            {location.landmarks && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                📍 {location.landmarks}
              </p>
            )}
          </div>
        </div>

        {/* Map Placeholder - In real app, integrate with Google Maps or similar */}
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg h-48 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Interactive map view</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Click 'Get Directions' to open in your preferred map app
            </p>
          </div>
          
          {/* Map overlay for visual enhancement */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10"></div>
        </div>

        {/* Directions Buttons */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Get Directions</h4>
          
          <div className="grid gap-2 sm:grid-cols-3">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.open(getDirectionsUrl('google'), '_blank')}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Google Maps
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.open(getDirectionsUrl('apple'), '_blank')}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Apple Maps
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.open(getDirectionsUrl('waze'), '_blank')}
            >
              <Car className="h-4 w-4 mr-2" />
              Waze
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-center"
            onClick={shareLocation}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Share Location
          </Button>
        </div>

        {/* Parking Information */}
        {location.parking.available && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Parking Information</span>
            </h4>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    {location.parking.type}
                  </p>
                  <p className="text-blue-700 dark:text-blue-200">
                    {location.parking.instructions}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Information */}
        {location.accessibilityInfo && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Accessibility
            </h4>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-green-700 dark:text-green-200">
                {location.accessibilityInfo}
              </p>
            </div>
          </div>
        )}

        {/* Additional Tips */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Travel Tips</span>
          </h4>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• Plan to arrive 10-15 minutes early for check-in</p>
            <p>• Allow extra time for parking during peak hours</p>
            <p>• Call {/* provider.phone */} if you have trouble finding the location</p>
            <p>• The entrance is located on the Main Street side of the building</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 