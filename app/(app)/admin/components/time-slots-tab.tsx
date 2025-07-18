'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/registry/new-york-v4/ui/dialog';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Service, TimeSlot, TimeSlotFormData } from '../types';
import { TimeSlotCard } from './time-slot-card';
import { TimeSlotForm } from './time-slot-form';
import { TabContentLayout } from '@/components/layouts/TabContentLayout';

interface TimeSlotsTabProps {
  timeSlots: TimeSlot[];
  setTimeSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  services: Service[];
}

export const TimeSlotsTab: React.FC<TimeSlotsTabProps> = ({ timeSlots, setTimeSlots, services }) => {
  const [showTimeSlotDialog, setShowTimeSlotDialog] = useState(false);

  const handleCreateTimeSlot = (data: TimeSlotFormData) => {
    const newSlot: TimeSlot = {
      ...data,
      id: Date.now().toString(),
    };
    setTimeSlots((prev) => [...prev, newSlot]);
    toast.success('Time slot created successfully');
    setShowTimeSlotDialog(false);
  };

  const handleDeleteTimeSlot = (slotId: string) => {
    if (!confirm('Are you sure you want to delete this time slot?')) return;
    setTimeSlots((prev) => prev.filter((s) => s.id !== slotId));
    toast.success('Time slot deleted successfully');
  };

  const getServiceForSlot = (serviceId: string) => {
    return services.find(s => s.id === serviceId);
  };

  const addTimeSlotButton = (
    <Dialog open={showTimeSlotDialog} onOpenChange={setShowTimeSlotDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Time Slot</DialogTitle>
        </DialogHeader>
        <TimeSlotForm 
          services={services}
          onSubmit={handleCreateTimeSlot}
          onCancel={() => setShowTimeSlotDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <TabContentLayout
      title="Time Slots Management"
      actions={addTimeSlotButton}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {timeSlots.map((slot) => (
          <TimeSlotCard 
            key={slot.id}
            timeSlot={slot}
            service={getServiceForSlot(slot.service_id)}
            onDelete={handleDeleteTimeSlot}
          />
        ))}
        {timeSlots.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No time slots found. Click "Add Time Slot" to create one.
          </div>
        )}
      </div>
    </TabContentLayout>
  );
};
