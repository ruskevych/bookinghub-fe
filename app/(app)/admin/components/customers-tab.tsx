'use client';

import React, { useState, useMemo } from 'react';
import { Booking } from '../types';
import { Card, CardContent } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/registry/new-york-v4/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/registry/new-york-v4/ui/dialog';
import { Search, Mail, Phone } from 'lucide-react';
import { TabContentLayout } from '@/components/layouts/TabContentLayout';

// Customer interface - we'll derive this from bookings
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalBookings: number;
  lastBooking: string;
  totalSpent: number;
}

interface CustomersTabProps {
  bookings: Booking[];
}

export const CustomersTab: React.FC<CustomersTabProps> = ({ bookings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  // Mock customers data - in a real app, this would come from an API
  // Here we're simulating customer data based on bookings
  const customers = useMemo(() => {
    // In a real app, you'd have a proper customers database
    // For this demo, we'll create mock customers based on bookings
    const customerMap: Record<string, Customer> = {};
    
    // Simulate customer data from bookings
    bookings.forEach(booking => {
      if (!customerMap[booking.user_id]) {
        // Create a mock customer based on user_id
        customerMap[booking.user_id] = {
          id: booking.user_id,
          name: `Customer ${booking.user_id.substring(0, 5)}`, // Mock name
          email: `customer${booking.user_id.substring(0, 5)}@example.com`, // Mock email
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`, // Mock phone
          totalBookings: 0,
          lastBooking: '',
          totalSpent: 0
        };
      }
      
      // Update customer stats
      customerMap[booking.user_id].totalBookings += 1;
      
      // Update last booking if this one is more recent
      const bookingDate = new Date(booking.start_time);
      const lastBookingDate = customerMap[booking.user_id].lastBooking 
        ? new Date(customerMap[booking.user_id].lastBooking)
        : new Date(0);
        
      if (bookingDate > lastBookingDate) {
        customerMap[booking.user_id].lastBooking = booking.start_time;
      }
      
      // Add to total spent (assuming average service price of $50-150)
      customerMap[booking.user_id].totalSpent += Math.floor(Math.random() * 100) + 50;
    });
    
    return Object.values(customerMap);
  }, [bookings]);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    
    const query = searchQuery.toLowerCase();
    return customers.filter(
      customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.includes(query))
    );
  }, [customers, searchQuery]);

  // Get customer bookings
  const getCustomerBookings = (customerId: string) => {
    return bookings.filter(booking => booking.user_id === customerId);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const searchInput = (
    <div className="relative w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search customers..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );

  return (
    <TabContentLayout 
      title="Customer Management"
      actions={searchInput}
      maxWidth="full"
    >

      <Card className="w-full">
        <CardContent className="p-0 w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">Customer</TableHead>
                <TableHead className="px-6">Email</TableHead>
                <TableHead className="px-6">Total Bookings</TableHead>
                <TableHead className="px-6">Last Booking</TableHead>
                <TableHead className="px-6">Total Spent</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium px-6">{customer.name}</TableCell>
                  <TableCell className="px-6">{customer.email}</TableCell>
                  <TableCell className="px-6">{customer.totalBookings}</TableCell>
                  <TableCell className="px-6">{customer.lastBooking ? formatDate(customer.lastBooking) : 'N/A'}</TableCell>
                  <TableCell className="px-6">${customer.totalSpent.toFixed(2)}</TableCell>
                  <TableCell className="px-6 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewCustomer(customer)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    {selectedCustomer.email}
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-4 w-4" />
                      {selectedCustomer.phone}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Bookings:</span>
                    <span className="font-medium">{selectedCustomer.totalBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spent:</span>
                    <span className="font-medium">${selectedCustomer.totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Booking:</span>
                    <span className="font-medium">
                      {selectedCustomer.lastBooking ? formatDate(selectedCustomer.lastBooking) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Booking History</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCustomerBookings(selectedCustomer.id).map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.service_name}</TableCell>
                        <TableCell>{formatDate(booking.start_time)}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {getCustomerBookings(selectedCustomer.id).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          No booking history found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCustomerDetails(false)}>
                  Close
                </Button>
                <Button>
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TabContentLayout>
  );
};
