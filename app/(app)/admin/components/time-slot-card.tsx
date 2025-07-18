'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Trash2 } from 'lucide-react';
import { TimeSlot, Service } from '../types';
import { formatDateTime } from '../utils';

interface TimeSlotCardProps {
  timeSlot: TimeSlot;
  service?: Service;
  onDelete: (slotId: string) => void;
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = ({ timeSlot, service, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="text-base">{service?.name || 'Unknown Service'}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(timeSlot.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <p><strong>Start:</strong> {formatDateTime(timeSlot.start_time)}</p>
          <p><strong>End:</strong> {formatDateTime(timeSlot.end_time)}</p>
        </div>
        <Badge className={timeSlot.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {timeSlot.is_available ? 'Available' : 'Unavailable'}
        </Badge>
      </CardContent>
    </Card>
  );
};
