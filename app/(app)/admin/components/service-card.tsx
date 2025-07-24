'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Clock, DollarSign, Edit, Settings, Trash2, Users } from 'lucide-react';
import { Service } from '../types';
import { formatDuration } from '../utils';
import Image from 'next/image';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit, onDelete }) => {
  return (
    <Card key={service.id} className="overflow-hidden">                  
      {service.photo_url && (
        <div className="w-full h-40 overflow-hidden">
          <Image 
            src={service.photo_url} 
            alt={service.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x200?text=No+Image';
            }}
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{service.name}</CardTitle>
            {service.category && (
              <Badge variant="outline" className="mt-1">{service.category}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => onEdit(service)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(service.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {service.description && (
          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
        )}
        <div className="flex flex-wrap gap-2 text-sm mb-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            {formatDuration(service.duration)}
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
            ${service.price.toFixed(2)}
          </div>
          {service.location && (
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-1 text-gray-500" />
              {service.location}
            </div>
          )}
        </div>
        {(service.is_group_service || (service.max_capacity ?? 0) > 1) && (
          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md inline-flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {service.is_group_service ? 'Group service' : ''}
            {(service.max_capacity ?? 0) > 1 && ` (Max: ${service.max_capacity})`}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
