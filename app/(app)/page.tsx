'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york-v4/ui/avatar';
import { AuthNav } from '@/components/auth/auth-nav';
import { TopNavbar } from '@/components/top-navbar';
import { 
  Search, 
  MapPin, 
  ChevronRight,
  Star,
  Menu,
  X,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Import our refactored components
import { ServiceCategories } from '@/components/booking/service-categories';
import { HowItWorks } from '@/components/booking/how-it-works';
import { BookingForm } from '@/components/booking/booking-form';
import { Testimonials } from '@/components/booking/testimonials';
import { stats, featuredProviders, benefits } from '@/components/booking/constants';

export default function BookingHubHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const bookingRef = useRef<HTMLDivElement>(null);

  // Mobile viewport handling
  useEffect(() => {
    if (isMobile) {
      // Prevent zoom on input focus for better mobile experience
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Cleanup on unmount
      return () => {
        if (viewportMeta) {
          viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
      };
    }
  }, [isMobile]);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <TopNavbar user={user ? { name: user.name } : undefined} isAuthenticated={!!isAuthenticated} />
      {/* Hero Section */}
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={scrollToBooking} className="text-lg px-8">
              Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/search')}>
              <Search className="mr-2 h-5 w-5" />
              Browse Services
                </Button>
              </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <ServiceCategories />

      {/* How It Works */}
      <HowItWorks />

      {/* Booking Form */}
      <div ref={bookingRef}>
        <BookingForm />
          </div>

      {/* Featured Providers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Service Providers</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover top-rated professionals in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProviders.map((provider) => (
              <Card key={provider.name} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-16 w-16 mx-auto mb-4">
                    <AvatarImage src={provider.image} alt={provider.name} />
                    <AvatarFallback>
                      {provider.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {provider.name}
                    </h3>
                  
                  <Badge variant="secondary" className="mb-3">
                    {provider.service}
                  </Badge>
                  
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                  </div>
                  
                  {/* Add View Profile button */}
                  <div className="mt-4 space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push(`/providers/${provider.name.toLowerCase().replace(' ', '-')}`)}
                    >
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => scrollToBooking()}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose BookingHub?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make booking services simple, secure, and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">BookingHub</span>
              </Link>
              <p className="text-muted-foreground mb-4">
                Connecting you with trusted local service providers for all your needs.
                </p>
                <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Facebook className="h-4 w-4" />
                  </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="h-4 w-4" />
                  </Button>
                <Button variant="ghost" size="icon">
                  <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Hair & Beauty</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Healthcare</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Fitness</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Home Services</a></li>
                </ul>
              </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                </ul>
              </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  support@bookinghub.com
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  123 Business St, City, State
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 BookingHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 