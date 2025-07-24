'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { Checkbox } from '@/registry/new-york-v4/ui/checkbox';
import { Service, ServiceFormData } from '../types';
import Image from 'next/image';

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
}

// Zod schema for form validation
const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  price: z.number().min(0, 'Price cannot be negative'),
  business_id: z.string().optional(),
  category: z.string().optional(),
  photo_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  max_capacity: z.number().min(1, 'Capacity must be at least 1'),
  is_group_service: z.boolean(),
  location: z.string().optional(),
});

export const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors } 
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      duration: 60,
      price: 0,
      business_id: '',
      category: '',
      photo_url: '',
      max_capacity: 1,
      is_group_service: false,
      location: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Service Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Haircut, Massage, Consultation"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          {...register('category')}
          placeholder="e.g., Beauty, Health, Consulting"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe your service in detail"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="photo_url">Photo URL</Label>
        <Input
          id="photo_url"
          type="url"
          {...register('photo_url')}
          placeholder="https://example.com/image.jpg"
        />
        {errors.photo_url && <p className="text-sm text-red-500">{errors.photo_url.message}</p>}
        
        <Controller
          name="photo_url"
          control={control}
          render={({ field }) => (
            <>
              {field.value && (
                <div className="mt-2 rounded-md overflow-hidden border border-gray-200">
                  <Image 
                    src={field.value} 
                    alt="Service preview" 
                    width={128}
                    height={128}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Preview+Unavailable';
                    }}
                  />
                </div>
              )}
            </>
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            {...register('duration', { valueAsNumber: true })}
            min="1"
          />
          {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            min="0"
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register('location')}
            placeholder="Room #, Online, etc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_capacity">Max Capacity</Label>
          <Input
            id="max_capacity"
            type="number"
            {...register('max_capacity', { valueAsNumber: true })}
            min="1"
          />
          {errors.max_capacity && <p className="text-sm text-red-500">{errors.max_capacity.message}</p>}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Controller
          name="is_group_service"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="is_group_service"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="is_group_service">Group Service</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {initialData ? 'Update' : 'Create'} Service
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
