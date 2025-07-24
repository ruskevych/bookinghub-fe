import { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Calendar } from '@/registry/new-york-v4/ui/calendar';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/new-york-v4/ui/drawer';
import { 
  CalendarIcon, 
  User, 
  Search, 
  MapPin,
  ArrowRight,
  Building2
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BookingFormProps {
  onScrollToBooking?: () => void;
}

// Quick search form validation schema
const quickSearchSchema = z.object({
  treatmentType: z.enum(['treatments', 'studio'], {
    required_error: 'Please select treatments or studio'
  }),
  searchQuery: z.string().min(1, 'Please enter what you\'re looking for'),
  location: z.string().min(1, 'Please enter your location'),
  date: z.date({
    required_error: 'Please select a date'
  })
});

type QuickSearchData = z.infer<typeof quickSearchSchema>;

export function BookingForm({ onScrollToBooking }: BookingFormProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const bookingRef = useRef<HTMLDivElement>(null);

  // Quick search form
  const searchForm = useForm<QuickSearchData>({
    resolver: zodResolver(quickSearchSchema),
    defaultValues: {
      treatmentType: 'treatments',
      searchQuery: '',
      location: ''
    }
  });

  const treatmentType = searchForm.watch('treatmentType');

  const handleMobileInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isMobile) {
      const target = e.target;
      target.setAttribute('readonly', 'readonly');
      setTimeout(() => {
        target.removeAttribute('readonly');
        target.focus();
      }, 100);
    }
  };

  // Handle search form submission - redirect to search page with params
  const onSearchSubmit = async (data: QuickSearchData) => {
    const searchParams = new URLSearchParams({
      query: data.searchQuery,
      location: data.location,
      date: data.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      type: data.treatmentType
    });
    
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <section ref={bookingRef} className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Find Your Perfect Service</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Search for treatments and studios in your area
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-xl">
          <CardHeader className="text-center pb-6 space-y-4">
            <CardTitle className="text-2xl">Quick Search</CardTitle>
            
            {/* Navigation Button */}
            <div className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Go to Advanced Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="space-y-6">
              {/* Header with Treatment/Studio Tabs */}
              <div className="space-y-4">
                <Label className="text-base font-medium">What are you looking for?</Label>
                <Controller
                  name="treatmentType"
                  control={searchForm.control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg w-full">
                      <Button
                        type="button"
                        variant={field.value === 'treatments' ? 'default' : 'ghost'}
                        className="flex-1"
                        onClick={() => field.onChange('treatments')}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Treatments
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === 'studio' ? 'default' : 'ghost'}
                        className="flex-1"
                        onClick={() => field.onChange('studio')}
                      >
                        <Building2 className="mr-2 h-4 w-4" />
                        Studio Name
                      </Button>
                    </div>
                  )}
                />
              </div>

              {/* Search Field */}
              <div className="space-y-2">
                <Label htmlFor="searchQuery" className="text-base font-medium">
                  {treatmentType === 'treatments' ? 'Search for treatments' : 'Search for studio'}
                </Label>
                <Controller
                  name="searchQuery"
                  control={searchForm.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="searchQuery"
                          placeholder={treatmentType === 'treatments' ? 'e.g., Haircut, Massage, Manicure' : 'e.g., Beauty Salon, Spa'}
                          className="pl-10 w-full"
                          onFocus={handleMobileInputFocus}
                        />
                      </div>
                      {fieldState.error && (
                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-medium">Location</Label>
                <Controller
                  name="location"
                  control={searchForm.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="location"
                          placeholder="Enter your location"
                          className="pl-10 w-full"
                          onFocus={handleMobileInputFocus}
                        />
                      </div>
                      {fieldState.error && (
                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Preferred Date</Label>
                <Controller
                  name="date"
                  control={searchForm.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-1">
                      {isMobile ? (
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? field.value.toLocaleDateString() : "Pick a date"}
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Select Date</DrawerTitle>
                              <DrawerDescription>Choose your preferred date</DrawerDescription>
                            </DrawerHeader>
                            <div className="px-4 pb-6">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                className="rounded-md border mx-auto"
                              />
                            </div>
                          </DrawerContent>
                        </Drawer>
                      ) : (
                        <div className="w-full">
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? field.value.toLocaleDateString() : "Pick a date"}
                          </Button>
                          <div className="mt-2">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                              className="rounded-md border w-full"
                            />
                          </div>
                        </div>
                      )}
                      {fieldState.error && (
                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Find Services
                </Button>
                
                <Button
                  type="button"
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  onClick={() => router.push('/booking')}
                >
                  Book Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Helper Text */}
              <p className="text-sm text-muted-foreground text-center">
                We&apos;ll help you find the perfect {treatmentType === 'treatments' ? 'treatment' : 'studio'} for your needs
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 