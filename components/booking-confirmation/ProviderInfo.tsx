'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Star, 
  MapPin, 
  Clock,
  Shield,
  ExternalLink
} from 'lucide-react';
import type { Booking } from '@/lib/api';
import type { Provider } from '@/types/provider';

interface ProviderInfoProps {
  booking: Booking;
  onMessage?: () => void;
  onCall?: () => void;
}

export function ProviderInfo({ booking, onMessage, onCall }: ProviderInfoProps) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviderData = async () => {
      try {
        const { getExtendedBooking } = await import('@/data/dummy-bookings');
        const extendedBooking = getExtendedBooking(booking.id);
        setProvider(extendedBooking?.provider || null);
      } catch (error) {
        console.error('Failed to load provider data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProviderData();
  }, [booking.id]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Provider Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!provider) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Provider Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Provider information not available</p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Your Service Provider</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Provider Header */}
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={provider.image} alt={provider.name} />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(provider.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {provider.name}
              </h3>
              {provider.verificationStatus?.isVerified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {provider.businessName || provider.category}
            </p>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {provider.rating}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({provider.reviewCount} reviews)
                </span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Responds {provider.responseTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => window.open(`tel:${provider.phone}`)}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Provider
          </Button>
          
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={onMessage || (() => {})}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Contact Information</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Phone:</span>
              <a 
                href={`tel:${provider.phone}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {provider.phone}
              </a>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <a 
                href={`mailto:${provider.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {provider.email}
              </a>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Location:</span>
              <span className="text-gray-900 dark:text-gray-100">{provider.address}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Hours:</span>
              <span className="text-gray-900 dark:text-gray-100">
                {provider.businessHours?.monday?.isOpen ? 'Mon-Fri 9AM-6PM' : 'Contact for hours'}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Additional Information</h4>
          
          <div className="grid gap-3 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Languages spoken:</span>
              <div className="mt-1 space-x-2">
                {provider.languages?.map((language) => (
                  <Badge key={language} variant="outline" className="text-xs">
                    {language}
                  </Badge>
                )) || <span className="text-gray-500">Not specified</span>}
              </div>
            </div>
            
            <div>
              <span className="text-gray-600 dark:text-gray-400">Professional experience:</span>
              <p className="text-gray-900 dark:text-gray-100 mt-1">
                Licensed massage therapist with 8+ years of experience specializing in therapeutic and relaxation massage.
              </p>
            </div>
          </div>
        </div>

        {/* View Profile Link */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" className="w-full justify-between" asChild>
            <a href={`/providers/${booking.business_id}`} target="_blank" rel="noopener noreferrer">
              <span>View Full Profile</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 