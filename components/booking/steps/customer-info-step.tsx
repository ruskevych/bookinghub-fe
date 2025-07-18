'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Checkbox } from '@/registry/new-york-v4/ui/checkbox';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/registry/new-york-v4/ui/form';
import { 
  User, 
  Mail, 
  Phone, 
  Shield,
  UserCheck,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

// Import types
import { BookingData } from '@/types/booking';

interface CustomerInfoStepProps {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  isLoading?: boolean;
}

// Form validation schema
const customerInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  emergencyContact: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
});

type CustomerInfoForm = z.infer<typeof customerInfoSchema>;

export function CustomerInfoStep({ 
  bookingData, 
  updateBookingData, 
  isLoading 
}: CustomerInfoStepProps) {
  const { user } = useAuth();
  
  const form = useForm<CustomerInfoForm>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: bookingData.customerInfo.name || user?.name || '',
      email: bookingData.customerInfo.email || user?.email || '',
      phone: bookingData.customerInfo.phone || user?.phone || '',
      emergencyContact: bookingData.customerInfo.emergencyContact || '',
      accessibilityNeeds: bookingData.customerInfo.accessibilityNeeds || '',
    },
  });

  // Watch form values and update booking data
  const watchedValues = form.watch();
  
  useEffect(() => {
    const subscription = form.watch((values) => {
      updateBookingData({
        customerInfo: {
          name: values.name || '',
          email: values.email || '',
          phone: values.phone || '',
          emergencyContact: values.emergencyContact || '',
          accessibilityNeeds: values.accessibilityNeeds || '',
        }
      });
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateBookingData]);

  const prefillUserInfo = () => {
    if (user) {
      form.setValue('name', user.name || '');
      form.setValue('email', user.email || '');
      form.setValue('phone', user.phone || '');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Service Summary */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg leading-tight">{bookingData.service?.name}</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {bookingData.staffMember?.name || 'Any available staff'}
              </p>
            </div>
            {bookingData.date && bookingData.timeSlot && (
              <div className="text-center sm:text-right">
                <div className="text-sm sm:text-base font-medium">
                  {bookingData.date.toLocaleDateString()}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {new Date(bookingData.timeSlot.start_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Form */}
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="h-5 w-5" />
            Your Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Form {...form}>
            <form className="space-y-4 sm:space-y-6">
              {/* Auto-fill from account */}
              {user && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-primary/5 rounded-lg border border-primary/20 gap-3">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-sm sm:text-base">Logged in as {user.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Use your account information?
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={prefillUserInfo}
                    className="h-10 sm:h-8 text-sm sm:text-xs w-full sm:w-auto"
                  >
                    Use Account Info
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base sm:text-sm font-medium">
                        <User className="h-4 w-4" />
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="h-12 sm:h-10 text-base sm:text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base sm:text-sm font-medium">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Enter your email address" 
                          className="h-12 sm:h-10 text-base sm:text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm sm:text-xs">
                        We'll send your booking confirmation here
                      </FormDescription>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base sm:text-sm font-medium">
                        <Phone className="h-4 w-4" />
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="(555) 123-4567" 
                          className="h-12 sm:h-10 text-base sm:text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm sm:text-xs">
                        For appointment confirmations and updates
                      </FormDescription>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                {/* Emergency Contact */}
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base sm:text-sm font-medium">
                        <PhoneCall className="h-4 w-4" />
                        Emergency Contact
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Emergency contact number (optional)" 
                          className="h-12 sm:h-10 text-base sm:text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm sm:text-xs">
                        Optional - for safety and peace of mind
                      </FormDescription>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Accessibility Needs */}
              <FormField
                control={form.control}
                name="accessibilityNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base sm:text-sm font-medium">Accessibility Requirements</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Any specific accessibility needs or accommodations (optional)" 
                        className="h-12 sm:h-10 text-base sm:text-sm"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-sm sm:text-xs">
                      Help us ensure you have the best possible experience
                    </FormDescription>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Privacy & Data Protection */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
        <CardHeader className="pb-3 px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg text-green-700 dark:text-green-300 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Data Protection
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-3 text-sm sm:text-base text-green-700 dark:text-green-300">
            <p className="leading-relaxed">
              Your personal information is secure and will only be used for:
            </p>
            <ul className="space-y-1 text-green-600 dark:text-green-400 text-sm sm:text-base">
              <li>• Booking confirmations and reminders</li>
              <li>• Service delivery and communication</li>
              <li>• Important updates about your appointments</li>
            </ul>
            <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-3 leading-relaxed">
              We never share your information with third parties and you can update or delete your data at any time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 