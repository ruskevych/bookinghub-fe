'use client';

import React, { useMemo } from 'react';
import { Booking, Service } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Pie, PieChart, Cell } from 'recharts';
import { TabContentLayout } from '@/components/layouts/TabContentLayout';

interface AnalyticsTabProps {
  bookings: Booking[];
  services: Service[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ bookings, services }) => {
  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(booking => booking.status === 'Completed' || booking.status === 'Confirmed')
      .reduce((sum, booking) => {
        const service = services.find(s => s.id === booking.service_id);
        return sum + (service?.price || 0);
      }, 0);
  }, [bookings, services]);

  // Calculate service popularity
  const servicePopularity = useMemo(() => {
    const popularity: Record<string, number> = {};
    
    bookings.forEach(booking => {
      if (!popularity[booking.service_id]) {
        popularity[booking.service_id] = 0;
      }
      popularity[booking.service_id]++;
    });
    
    return Object.entries(popularity).map(([serviceId, count]) => {
      const service = services.find(s => s.id === serviceId);
      return {
        name: service?.name || 'Unknown Service',
        bookings: count
      };
    }).sort((a, b) => b.bookings - a.bookings);
  }, [bookings, services]);

  // Calculate booking status distribution
  const bookingStatusData = useMemo(() => {
    const statusCounts: Record<string, number> = {
      'Confirmed': 0,
      'Pending': 0,
      'Cancelled': 0,
      'Completed': 0
    };
    
    bookings.forEach(booking => {
      statusCounts[booking.status]++;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [bookings]);

  // Calculate monthly revenue
  const monthlyRevenue = useMemo(() => {
    const revenueByMonth: Record<string, number> = {};
    
    bookings
      .filter(booking => booking.status === 'Completed' || booking.status === 'Confirmed')
      .forEach(booking => {
        const date = new Date(booking.start_time);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!revenueByMonth[monthYear]) {
          revenueByMonth[monthYear] = 0;
        }
        
        const service = services.find(s => s.id === booking.service_id);
        revenueByMonth[monthYear] += service?.price || 0;
      });
    
    return Object.entries(revenueByMonth).map(([monthYear, revenue]) => ({
      month: monthYear,
      revenue
    }));
  }, [bookings, services]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <TabContentLayout title="Business Analytics" maxWidth="full">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.filter(b => b.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancellation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookings.length > 0 
                ? `${((bookings.filter(b => b.status === 'Cancelled').length / bookings.length) * 100).toFixed(1)}%` 
                : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Optimized Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Monthly Revenue Chart */}
        <Card className="lg:col-span-1 w-full">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#3182ce" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Popularity Chart */}
        <Card className="lg:col-span-1 w-full">
          <CardHeader>
            <CardTitle>Service Popularity</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicePopularity.slice(0, 5)} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#38a169" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status Distribution Chart */}
        <Card className="lg:col-span-1 w-full">
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Bookings']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </TabContentLayout>
  );
};
