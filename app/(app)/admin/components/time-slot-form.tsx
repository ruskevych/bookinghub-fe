'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select';
import { Service, TimeSlotFormData } from '../types';

interface TimeSlotFormProps {
  services: Service[];
  onSubmit: (data: TimeSlotFormData) => void;
  onCancel: () => void;
}

// Zod schema for form validation
const timeSlotSchema = z.object({
  service_id: z.string().min(1, 'Service selection is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  is_available: z.boolean().default(true),
}).refine((data) => {
  if (!data.start_time || !data.end_time) return true; // Let the string validation handle empty fields
  return new Date(data.end_time) > new Date(data.start_time);
}, {
  message: 'End time must be after start time',
  path: ['end_time'], // This specifies which field the error belongs to
});

export const TimeSlotForm: React.FC<TimeSlotFormProps> = ({ services, onSubmit, onCancel }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<TimeSlotFormData>({
    resolver: zodResolver(timeSlotSchema),
    defaultValues: {
      service_id: '',
      start_time: '',
      end_time: '',
      is_available: true,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="service_id">Service</Label>
        <select
          id="service_id"
          {...register('service_id')}
          className="w-full p-2 border rounded-md"
          aria-invalid={errors.service_id ? 'true' : 'false'}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        {errors.service_id && <p className="text-sm text-red-500">{errors.service_id.message}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="datetime-local"
            {...register('start_time')}
            aria-invalid={errors.start_time ? 'true' : 'false'}
          />
          {errors.start_time && <p className="text-sm text-red-500">{errors.start_time.message}</p>}
        </div>
        <div>
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="datetime-local"
            {...register('end_time')}
            aria-invalid={errors.end_time ? 'true' : 'false'}
          />
          {errors.end_time && <p className="text-sm text-red-500">{errors.end_time.message}</p>}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Create Time Slot
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
