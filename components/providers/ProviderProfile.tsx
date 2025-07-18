'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/registry/new-york-v4/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york-v4/ui/avatar";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  Heart,
  Shield,
  MessageCircle,
  Share2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProvider } from '@/hooks/use-provider';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Provider, Service, Review } from '@/types/provider';

// Import sub-components
import { ProviderHeader } from './ProviderHeader';
import { ProviderServices } from './ProviderServices';
import { ProviderAbout } from './ProviderAbout';
import { ProviderReviews } from './ProviderReviews';
import { ProviderCalendar } from './ProviderCalendar';
import { ProviderGallery } from './ProviderGallery';
import { StickyBookingWidget } from './StickyBookingWidget';

interface ProviderProfileProps {
  providerId: string;
}

export function ProviderProfile({ providerId }: ProviderProfileProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    provider,
    reviews,
    availability,
    isLoading,
    error,
    refreshProvider,
    bookService,
    toggleFavorite,
    submitReview
  } = useProvider({ providerId });

  if (isLoading) {
    return <ProviderProfileSkeleton />;
  }

  if (error || !provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The provider you are looking for does not exist or has been removed.'}
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleBookService = async (serviceId: string, slot: { date: string; time: string }) => {
    try {
      await bookService(serviceId, slot);
      // Handle successful booking (show success message, redirect, etc.)
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const handleReviewSubmit = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      await submitReview(reviewData);
      // Handle successful review submission
    } catch (error) {
      console.error('Review submission failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Breadcrumb Navigation */}
      <div className="bg-muted/20 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="h-10 px-3 min-h-[44px] touch-manipulation"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <span>›</span>
            <span className="text-foreground truncate">{provider.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-40 lg:pb-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Provider Header */}
            <ProviderHeader
              provider={provider}
              onToggleFavorite={toggleFavorite}
              onMessage={() => {/* Handle message */}}
              onShare={() => {/* Handle share */}}
            />

            {/* Navigation Tabs */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Mobile-optimized tab navigation */}
                  <div className="overflow-x-auto scrollbar-hide px-4">
                    <TabsList className={cn(
                      "flex w-full h-auto p-1 gap-1",
                      isMobile 
                        ? ""  
                        : "grid grid-cols-5 lg:grid-cols-6"
                    )}>
                      <TabsTrigger 
                        value="overview" 
                        className={cn(
                          "text-xs lg:text-sm py-3 px-2 min-h-[44px] touch-manipulation flex-shrink-0",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        aria-label="View provider overview"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger 
                        value="services" 
                        className={cn(
                          "text-xs lg:text-sm py-3 px-2 min-h-[44px] touch-manipulation flex-shrink-0",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        aria-label="View provider services"
                      >
                        Services
                      </TabsTrigger>
                      <TabsTrigger 
                        value="reviews" 
                        className={cn(
                          "text-xs lg:text-sm py-3 px-2 min-h-[44px] touch-manipulation flex-shrink-0",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        aria-label="View provider reviews"
                      >
                        Reviews
                      </TabsTrigger>
                      <TabsTrigger 
                        value="availability" 
                        className={cn(
                          "text-xs lg:text-sm py-3 px-2 min-h-[44px] touch-manipulation flex-shrink-0",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        aria-label="View provider calendar"
                      >
                        Calendar
                      </TabsTrigger>
                      <TabsTrigger 
                        value="gallery" 
                        className={cn(
                          "text-xs lg:text-sm py-3 px-2 min-h-[44px] touch-manipulation flex-shrink-0",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        )}
                        aria-label="View provider gallery"
                      >
                        Gallery
                      </TabsTrigger>
                      <TabsTrigger 
                        value="about" 
                        className={cn(
                          "text-xs lg:text-sm py-3 px-2 min-h-[44px] touch-manipulation flex-shrink-0",
                          "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          "hidden lg:block"
                        )}
                        aria-label="View provider about information"
                      >
                        About
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-4 lg:p-6 overflow-hidden">
                    <TabsContent value="overview" className="space-y-6 mt-0 mb-8">
                      <div className="grid gap-6">
                        <ProviderServices
                          services={provider.services}
                          onBookService={handleBookService}
                          viewMode="full"
                        />
                        <ProviderAbout provider={provider} compact />
                        <ProviderReviews
                          reviews={reviews}
                          averageRating={provider.rating}
                          totalReviews={provider.totalReviews}
                          onSubmitReview={handleReviewSubmit}
                          compact
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="services" className="mt-0 mb-8">
                      <ProviderServices
                        services={provider.services}
                        onBookService={handleBookService}
                        viewMode="full"
                      />
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-0 mb-8">
                      <ProviderReviews
                        reviews={reviews}
                        averageRating={provider.rating}
                        totalReviews={provider.totalReviews}
                        onSubmitReview={handleReviewSubmit}
                        compact={false}
                      />
                    </TabsContent>

                    <TabsContent value="availability" className="mt-0 mb-8">
                      <ProviderCalendar
                        availability={availability}
                        services={provider.services}
                        onBookSlot={handleBookService}
                        businessHours={provider.businessHours}
                      />
                    </TabsContent>

                    <TabsContent value="gallery" className="mt-0 mb-8">
                      <ProviderGallery gallery={provider.gallery} />
                    </TabsContent>

                    <TabsContent value="about" className="mt-0 mb-8">
                      <ProviderAbout provider={provider} compact={false} />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 space-y-4 pr-4">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full min-h-[44px]" 
                    onClick={() => setActiveTab('availability')}
                    aria-label="Book an appointment with this provider"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full min-h-[44px]"
                    aria-label="Send a message to this provider"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFavorite}
                      className={cn(
                        "min-h-[44px]",
                        provider.isFavorite && "text-red-600 border-red-200"
                      )}
                      aria-label={provider.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={cn(
                        "w-4 h-4",
                        provider.isFavorite && "fill-current"
                      )} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="min-h-[44px]"
                      aria-label="Share this provider"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{provider.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{provider.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {provider.location.city}, {provider.location.state}
                    </span>
                  </div>
                  {provider.responseTime && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{provider.responseTime}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(provider.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize">{day}</span>
                        <span className={cn(
                          !hours.isOpen && "text-muted-foreground"
                        )}>
                          {hours.isOpen ? `${hours.openTime} - ${hours.closeTime}` : 'Closed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Links */}
              {provider.socialMedia && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Follow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {provider.socialMedia.website && (
                        <Button variant="outline" size="sm" className="w-full justify-start min-h-[44px]">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Website
                        </Button>
                      )}
                      {provider.socialMedia.instagram && (
                        <Button variant="outline" size="sm" className="w-full justify-start min-h-[44px]">
                          Instagram
                        </Button>
                      )}
                      {provider.socialMedia.facebook && (
                        <Button variant="outline" size="sm" className="w-full justify-start min-h-[44px]">
                          Facebook
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Widget */}
      <div className="lg:hidden">
        <StickyBookingWidget
          provider={provider}
          onBook={() => setActiveTab('availability')}
          onMessage={() => {/* Handle message */}}
        />
      </div>
    </div>
  );
}

// Loading skeleton component
function ProviderProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/20 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Header skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-3">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Content skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-10 w-full bg-muted rounded animate-pulse" />
                  <div className="h-32 w-full bg-muted rounded animate-pulse" />
                  <div className="h-32 w-full bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar skeleton */}
          <div className="hidden lg:block lg:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-10 w-full bg-muted rounded animate-pulse" />
                  <div className="h-10 w-full bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 