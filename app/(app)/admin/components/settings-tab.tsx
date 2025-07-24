'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { Switch } from '@/registry/new-york-v4/ui/switch';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs';
import { toast } from 'sonner';
import { TabContentLayout } from '@/components/layouts/TabContentLayout';
import Image from 'next/image';

interface BusinessSettings {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  workingHours: {
    monday: { isOpen: boolean; openTime: string; closeTime: string };
    tuesday: { isOpen: boolean; openTime: string; closeTime: string };
    wednesday: { isOpen: boolean; openTime: string; closeTime: string };
    thursday: { isOpen: boolean; openTime: string; closeTime: string };
    friday: { isOpen: boolean; openTime: string; closeTime: string };
    saturday: { isOpen: boolean; openTime: string; closeTime: string };
    sunday: { isOpen: boolean; openTime: string; closeTime: string };
  };
}

interface NotificationSettings {
  newBooking: { email: boolean; sms: boolean };
  bookingCancellation: { email: boolean; sms: boolean };
  bookingReminder: { email: boolean; sms: boolean };
  reminderTime: string;
}

interface SettingsTabProps {
  businessId: string;
}

const timeSlots = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export const SettingsTab: React.FC<SettingsTabProps> = ({ businessId }) => {
  // In a real app, these would be fetched from an API
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    name: 'My Business',
    description: 'Professional services for all your needs',
    address: '123 Main St, City, State 12345',
    phone: '(555) 123-4567',
    email: 'contact@mybusiness.com',
    website: 'www.mybusiness.com',
    logoUrl: 'https://via.placeholder.com/150',
    workingHours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '15:00' },
      sunday: { isOpen: false, openTime: '10:00', closeTime: '15:00' },
    },
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newBooking: { email: true, sms: false },
    bookingCancellation: { email: true, sms: false },
    bookingReminder: { email: true, sms: false },
    reminderTime: '1h',
  });

  const handleBusinessSettingChange = (field: keyof BusinessSettings, value: string) => {
    setBusinessSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleWorkingHoursChange = (
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    field: 'isOpen' | 'openTime' | 'closeTime',
    value: boolean | string
  ) => {
    setBusinessSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleNotificationSettingChange = (field: 'newBooking' | 'bookingCancellation' | 'bookingReminder', subField: 'email' | 'sms', value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as { email: boolean; sms: boolean }),
        [subField]: value
      }
    }));
  };

  const saveBusinessSettings = () => {
    // In a real app, this would make an API call
    console.log('Saving business settings:', businessSettings);
    toast.success('Business settings saved successfully');
  };

  const saveNotificationSettings = () => {
    // In a real app, this would make an API call
    console.log('Saving notification settings:', notificationSettings);
    toast.success('Notification settings saved successfully');
  };

  return (
    <TabContentLayout title="Settings">
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="business">Business Information</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="w-full">
          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Update your business details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 w-full">
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="business-name">Business Name</Label>
                <Input 
                  id="business-name" 
                  value={businessSettings.name}
                  onChange={(e) => handleBusinessSettingChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 w-full">
                <Label htmlFor="business-email">Email Address</Label>
                <Input 
                  id="business-email" 
                  type="email"
                  value={businessSettings.email}
                  onChange={(e) => handleBusinessSettingChange('email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 w-full">
                <Label htmlFor="business-phone">Phone Number</Label>
                <Input 
                  id="business-phone" 
                  type="tel"
                  value={businessSettings.phone}
                  onChange={(e) => handleBusinessSettingChange('phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 w-full">
                <Label htmlFor="business-website">Website</Label>
                <Input 
                  id="business-website" 
                  type="url"
                  value={businessSettings.website}
                  onChange={(e) => handleBusinessSettingChange('website', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2 w-full">
              <Label htmlFor="business-address">Address</Label>
              <Input 
                id="business-address" 
                value={businessSettings.address}
                onChange={(e) => handleBusinessSettingChange('address', e.target.value)}
              />
            </div>
            
            <div className="space-y-2 w-full">
              <Label htmlFor="business-description">Description</Label>
              <Textarea 
                id="business-description" 
                value={businessSettings.description}
                onChange={(e) => handleBusinessSettingChange('description', e.target.value)}
              />
            </div>
            
            <div className="space-y-2 w-full">
              <Label htmlFor="business-logo">Logo URL</Label>
              <Input 
                id="business-logo" 
                type="url"
                value={businessSettings.logoUrl}
                onChange={(e) => handleBusinessSettingChange('logoUrl', e.target.value)}
              />
              {businessSettings.logoUrl && (
                <Image src={businessSettings.logoUrl} alt="Business Logo" width={96} height={96} className="w-24 h-24 object-cover rounded-full border" />
              )}
            </div>
            
                <div className="flex justify-end w-full">
                  <Button onClick={saveBusinessSettings}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hours" className="w-full">
          <div className="w-full mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
                <CardDescription>
                  Set your business hours for each day of the week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 w-full">
            <div className="space-y-4">
              {Object.entries(businessSettings.workingHours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-[120px_1fr] gap-4 items-center w-full">
                  <div className="font-medium capitalize">{day}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Switch 
                        id={`${day}-open`}
                        checked={hours.isOpen} 
                        onCheckedChange={(checked) => handleWorkingHoursChange(day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', 'isOpen', checked === true)}
                      />
                      <Label htmlFor={`${day}-open`}>Open</Label>
                    </div>
                    
                    <Select 
                      value={hours.openTime}
                      disabled={!hours.isOpen}
                      onValueChange={(value) => handleWorkingHoursChange(day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', 'openTime', value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Open" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">to</span>
                    <Select 
                      value={hours.closeTime}
                      disabled={!hours.isOpen}
                      onValueChange={(value) => handleWorkingHoursChange(day as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', 'closeTime', value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Close" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              
                <div className="flex justify-end mt-4 w-full">
                  <Button onClick={saveBusinessSettings}>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="w-full">
        <div className="w-full mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 w-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-16">
                <div className="flex-1">
                  <h4 className="font-medium">New Booking</h4>
                  <p className="text-sm text-muted-foreground">Notify when a new booking is made</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <Switch 
                    id="new-booking-email"
                    checked={notificationSettings.newBooking.email} 
                    onCheckedChange={(checked) => handleNotificationSettingChange('newBooking', 'email', checked === true)}
                  />
                  <Label htmlFor="new-booking-email">Email</Label>
                  
                  <Switch 
                    id="new-booking-sms"
                    checked={notificationSettings.newBooking.sms} 
                    onCheckedChange={(checked) => handleNotificationSettingChange('newBooking', 'sms', checked === true)}
                  />
                  <Label htmlFor="new-booking-sms">SMS</Label>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-8">
                <div className="flex-1">
                  <h4 className="font-medium">Booking Cancellation</h4>
                  <p className="text-sm text-muted-foreground">Notify when a booking is cancelled</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <Switch 
                    id="cancellation-email"
                    checked={notificationSettings.bookingCancellation.email} 
                    onCheckedChange={(checked) => handleNotificationSettingChange('bookingCancellation', 'email', checked === true)}
                  />
                  <Label htmlFor="cancellation-email">Email</Label>
                  
                  <Switch 
                    id="cancellation-sms"
                    checked={notificationSettings.bookingCancellation.sms} 
                    onCheckedChange={(checked) => handleNotificationSettingChange('bookingCancellation', 'sms', checked === true)}
                  />
                  <Label htmlFor="cancellation-sms">SMS</Label>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-8">
                <div className="flex-1">
                  <h4 className="font-medium">Booking Reminder</h4>
                  <p className="text-sm text-muted-foreground">Notify before a booking starts</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <Switch 
                    id="reminder-email"
                    checked={notificationSettings.bookingReminder.email} 
                    onCheckedChange={(checked) => handleNotificationSettingChange('bookingReminder', 'email', checked === true)}
                  />
                  <Label htmlFor="reminder-email">Email</Label>
                  
                  <Switch 
                    id="reminder-sms"
                    checked={notificationSettings.bookingReminder.sms} 
                    onCheckedChange={(checked) => handleNotificationSettingChange('bookingReminder', 'sms', checked === true)}
                  />
                  <Label htmlFor="reminder-sms">SMS</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 w-full">
              <Label htmlFor="reminder-time">Reminder Time</Label>
              <Select 
                value={notificationSettings.reminderTime}
                onValueChange={(value) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  reminderTime: value 
                }))}
              >
                <SelectTrigger id="reminder-time">
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes before</SelectItem>
                  <SelectItem value="30m">30 minutes before</SelectItem>
                  <SelectItem value="1h">1 hour before</SelectItem>
                  <SelectItem value="2h">2 hours before</SelectItem>
                  <SelectItem value="1d">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
              <div className="flex justify-end w-full">
                <Button onClick={saveNotificationSettings}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </TabContentLayout>
  );
};
