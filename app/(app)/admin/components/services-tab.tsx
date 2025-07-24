'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/registry/new-york-v4/ui/dialog';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Service, ServiceFormData } from '../types';
import { ServiceCard } from './service-card';
import { ServiceForm } from './service-form';
import { TabContentLayout } from '@/components/layouts/TabContentLayout';
import { useCreateService } from '@/hooks/use-create-service';

interface ServicesTabProps {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  businessId: string;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ services, setServices, businessId }) => {
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { createService, loading, error } = useCreateService();
  const handleCreateService = async (data: ServiceFormData) => {
    try {
      await createService(data);
      // Handle success (e.g., show toast, close modal, refresh list)
    } catch (err) {
      // Handle error
      console.error('Failed to create service:', err);
    }
  };

  const handleUpdateService = (data: ServiceFormData) => {
    if (!selectedService) return;
    setServices((prev) => prev.map((s) =>
      s.id === selectedService.id ? { ...selectedService, ...data } : s
    ));
    toast.success('Service updated successfully');
    closeDialog();
  };

  const handleDeleteService = (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    toast.success('Service deleted successfully');
  };

  const openEditServiceDialog = (service: Service) => {
    setSelectedService(service);
    setShowServiceDialog(true);
  };

  const closeDialog = () => {
    setShowServiceDialog(false);
    setSelectedService(null);
  };

  const addServiceButton = (
    <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedService ? 'Edit Service' : 'Create New Service'}
          </DialogTitle>
        </DialogHeader>
        <ServiceForm 
          initialData={selectedService || undefined}
          onSubmit={selectedService ? handleUpdateService : handleCreateService}
          onCancel={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <TabContentLayout 
      title="Services Management"
      actions={addServiceButton}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {services.map((service) => (
          <ServiceCard 
            key={service.id}
            service={service}
            onEdit={openEditServiceDialog}
            onDelete={handleDeleteService}
          />
        ))}
        {services.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No services found. Click &quot;Add Service&quot; to create one.
          </div>
        )}
      </div>
    </TabContentLayout>
  );
};
