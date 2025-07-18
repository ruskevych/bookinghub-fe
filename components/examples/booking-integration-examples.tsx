'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { BookNowButton, QuickBookButton, PrimaryBookButton, OutlineBookButton } from '@/components/booking/book-now-button';

// Example: Enhanced Provider Card with Book Now button
export function ProviderCard({ provider }: { provider: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={provider.image} />
            <AvatarFallback>
              {provider.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold mb-1">{provider.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {provider.rating}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {provider.description}
            </p>
            
            {/* Services Preview */}
            <div className="flex flex-wrap gap-2 mb-4">
              {provider.services?.slice(0, 3).map((service: any) => (
                <Badge key={service.id} variant="secondary" className="text-xs">
                  {service.name} - ${service.price}
                </Badge>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <QuickBookButton 
                providerId={provider.id} 
                className="flex-1" 
              />
              <BookNowButton
                providerId={provider.id}
                variant="outline"
                className="flex-1"
              >
                View Profile
              </BookNowButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Example: Service Card with specific service booking
export function ServiceCard({ service }: { service: any }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
            <p className="text-muted-foreground mb-3">{service.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {service.duration}m
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                ${service.price}
              </div>
            </div>
          </div>
          
          <Avatar className="h-12 w-12">
            <AvatarImage src={service.provider_image} />
            <AvatarFallback>
              {service.provider_name?.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Book This Service Button */}
        <PrimaryBookButton 
          serviceId={service.id}
          providerId={service.provider_id}
        />
      </CardContent>
    </Card>
  );
}

// Example: Hero Section with Call-to-Action
export function HeroBookingSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Book Any Service,
          <br />
          <span className="text-primary">Anywhere, Anytime</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Connect with local service providers for everything from haircuts to home repairs. 
          Quick booking, instant confirmation, and verified professionals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <BookNowButton
            size="lg"
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          />
          <BookNowButton
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Browse Services
          </BookNowButton>
        </div>
      </div>
    </section>
  );
}

// Example: Integration in existing page components
export function IntegratedBookingExamples() {
  const mockProvider = {
    id: 'provider1',
    name: 'Elite Hair Studio',
    image: '/avatars/01.png',
    location: 'Downtown',
    rating: 4.8,
    description: 'Premium hair styling and cutting services with experienced professionals.',
    services: [
      { id: 'service1', name: 'Haircut', price: 65 },
      { id: 'service2', name: 'Color', price: 120 },
      { id: 'service3', name: 'Styling', price: 45 }
    ]
  };

  const mockService = {
    id: 'service1',
    name: 'Premium Haircut & Style',
    description: 'Professional haircut with consultation, wash, cut, and styling.',
    duration: 90,
    price: 85,
    provider_id: 'provider1',
    provider_name: 'Elite Hair Studio',
    provider_image: '/avatars/01.png'
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Booking Integration Examples</h2>
        <p className="text-muted-foreground mb-6">
          Here are examples of how to integrate the booking flow throughout your application:
        </p>
      </div>

      {/* Hero Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. Hero Section</h3>
        <HeroBookingSection />
      </div>

      {/* Provider Card */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2. Provider Card</h3>
        <div className="max-w-2xl">
          <ProviderCard provider={mockProvider} />
        </div>
      </div>

      {/* Service Card */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3. Service Card</h3>
        <div className="max-w-md">
          <ServiceCard service={mockService} />
        </div>
      </div>

      {/* Button Variants */}
      <div>
        <h3 className="text-lg font-semibold mb-4">4. Button Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Primary Button</CardTitle>
            </CardHeader>
            <CardContent>
              <PrimaryBookButton serviceId="service1" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Book</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickBookButton serviceId="service1" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Outline Button</CardTitle>
            </CardHeader>
            <CardContent>
              <OutlineBookButton serviceId="service1" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Custom Button</CardTitle>
            </CardHeader>
            <CardContent>
              <BookNowButton
                serviceId="service1"
                variant="secondary"
                fullWidth
              >
                Reserve Now
              </BookNowButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 