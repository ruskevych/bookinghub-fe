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

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect
  }

  const [activeTab, setActiveTab] = useState('services');
  
  const renderActiveTab = () => {
    switch(activeTab) {
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
          <div className="flex h-full">
            <Sidebar variant="floating" className="bg-gradient-to-b from-primary/5 to-background border-r mt-0">
              <SidebarContent className="mt-18 overflow-y-auto">
                <SidebarMenu className="space-y-1 px-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'services'}
                      onClick={() => setActiveTab('services')}
                      className={`rounded-md transition-all ${activeTab === 'services' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                    >
                      <Briefcase className="mr-3 h-5 w-5" />
                      <span>Services</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'time-slots'}
                      onClick={() => setActiveTab('time-slots')}
                      className={`rounded-md transition-all ${activeTab === 'time-slots' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                    >
                      <Clock className="mr-3 h-5 w-5" />
                      <span>Time Slots</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'bookings'}
                      onClick={() => setActiveTab('bookings')}
                      className={`rounded-md transition-all ${activeTab === 'bookings' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                    >
                      <BookOpen className="mr-3 h-5 w-5" />
                      <span>Bookings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'calendar'}
                      onClick={() => setActiveTab('calendar')}
                      className={`rounded-md transition-all ${activeTab === 'calendar' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                    >
                      <Calendar className="mr-3 h-5 w-5" />
                      <span>Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'analytics'}
                      onClick={() => setActiveTab('analytics')}
                      className={`rounded-md transition-all ${activeTab === 'analytics' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                    >
                      <BarChart3 className="mr-3 h-5 w-5" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'customers'}
                      onClick={() => setActiveTab('customers')}
                      className={`rounded-md transition-all ${activeTab === 'customers' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                    >
                      <Users className="mr-3 h-5 w-5" />
                      <span>Customers</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'staff'}
                      onClick={() => setActiveTab('staff')}
                      className={`rounded-md transition-all ${activeTab === 'staff' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                    >
                      <Users className="mr-3 h-5 w-5" />
                      <span>Staff</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeTab === 'settings'}
                      onClick={() => setActiveTab('settings')}
                      className={`rounded-md transition-all ${activeTab === 'settings' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}`}
                    >
                      <Settings className="mr-3 h-5 w-5" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            
            <SidebarInset>
              <div className={`container p-8 overflow-y-auto pb-26 ${
                activeTab === 'analytics' ? 'max-w-none' : 'max-w-6xl'
              }`}>
                {loading ? (
                  <LoadingSpinner message="Loading dashboard..." />
                ) : (
                  renderActiveTab()
                )}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}