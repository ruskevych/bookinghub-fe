'use client';

import { useState } from 'react';
import { useAdminDashboard } from './hooks/use-admin-dashboard';
import { LoadingSpinner } from './components/loading-spinner';
import { AdminNavbar } from '@/components/admin-navbar';
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from '@/registry/new-york-v4/ui/sidebar';
import { LayoutDashboard, Calendar, BarChart3, Users, Settings, Briefcase, Clock, BookOpen } from 'lucide-react';
import { ServicesTab } from './components/services-tab';
import { TimeSlotsTab } from './components/time-slots-tab';
import { BookingsTab } from './components/bookings-tab';
import { CalendarTab } from './components/calendar-tab';
import { AnalyticsTab } from './components/analytics-tab';
import { CustomersTab } from './components/customers-tab';
import { SettingsTab } from './components/settings-tab';
import { StaffTab } from './components/staff-tab';
import { useAppStore } from '@/components/providers';

export default function AdminDashboardPage() {
  const {
    services,
    setServices,
    timeSlots,
    setTimeSlots,
    bookings,
    staff,
    setStaff,
    loading,
    isAuthenticated,
    isAdmin,
    user
  } = useAdminDashboard();

  const selectedTab = useAppStore((state) => state.selectedTab);
  const setSelectedTab = useAppStore((state) => state.setSelectedTab);

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect
  }

  const renderActiveTab = () => {
    switch(selectedTab) {
      case 'services':
        return <ServicesTab 
          services={services} 
          setServices={setServices} 
          businessId={user?.business_id || ''}
        />;
      case 'time-slots':
        return <TimeSlotsTab 
          timeSlots={timeSlots} 
          setTimeSlots={setTimeSlots} 
          services={services}
        />;
      case 'bookings':
        return <BookingsTab bookings={bookings} />;
      case 'calendar':
        return <CalendarTab 
          bookings={bookings}
          timeSlots={timeSlots}
          services={services}
        />;
      case 'analytics':
        return <AnalyticsTab 
          bookings={bookings}
          services={services}
        />;
      case 'customers':
        return <CustomersTab bookings={bookings} />;
      case 'staff':
        return <StaffTab staff={staff} bookings={bookings} />;
      case 'settings':
        return <SettingsTab businessId={user?.business_id || ''} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <AdminNavbar user={user} />
      </div>
      <div className="flex flex-1 overflow-hidden ">
        <SidebarProvider>
          <div className="flex w-full h-full">
            <Sidebar variant="floating" className="bg-gradient-to-b from-primary/5 to-background border-r mt-0">
              <SidebarContent className="mt-18 overflow-y-auto">
                <SidebarMenu className="space-y-1 px-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={selectedTab === 'services'}
                      onClick={() => setSelectedTab('services')}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Services
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={selectedTab === 'time-slots'}
                      onClick={() => setSelectedTab('time-slots')}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Time Slots
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={selectedTab === 'bookings'}
                      onClick={() => setSelectedTab('bookings')}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Bookings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={selectedTab === 'calendar'}
                      onClick={() => setSelectedTab('calendar')}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Calendar
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={selectedTab === 'analytics'}
                      onClick={() => setSelectedTab('analytics')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={selectedTab === 'customers'}
                      onClick={() => setSelectedTab('customers')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Customers
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={selectedTab === 'staff'}
                      onClick={() => setSelectedTab('staff')}
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Staff
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={selectedTab === 'settings'}
                      onClick={() => setSelectedTab('settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <main className="flex-1 overflow-y-auto">
              {renderActiveTab()}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}