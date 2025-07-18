'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookNowButtonProps {
  serviceId?: string;
  providerId?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export function BookNowButton({
  serviceId,
  providerId,
  variant = 'default',
  size = 'default',
  className,
  children,
  fullWidth = false,
}: BookNowButtonProps) {
  const router = useRouter();

  const handleBookNow = () => {
    const params = new URLSearchParams();
    
    if (serviceId) {
      params.append('service', serviceId);
    }
    
    if (providerId) {
      params.append('provider', providerId);
    }
    
    const url = params.toString() 
      ? `/booking?${params.toString()}`
      : '/booking';
    
    router.push(url);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBookNow}
      className={cn(
        fullWidth && 'w-full',
        className
      )}
    >
      {children || (
        <>
          <Calendar className="mr-2 h-4 w-4" />
          Book Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

// Quick variants for common use cases
export function QuickBookButton({ serviceId, providerId, className }: Pick<BookNowButtonProps, 'serviceId' | 'providerId' | 'className'>) {
  return (
    <BookNowButton
      serviceId={serviceId}
      providerId={providerId}
      size="sm"
      className={className}
    >
      Book Now
    </BookNowButton>
  );
}

export function PrimaryBookButton({ serviceId, providerId, className }: Pick<BookNowButtonProps, 'serviceId' | 'providerId' | 'className'>) {
  return (
    <BookNowButton
      serviceId={serviceId}
      providerId={providerId}
      size="lg"
      fullWidth
      className={cn('bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70', className)}
    />
  );
}

export function OutlineBookButton({ serviceId, providerId, className }: Pick<BookNowButtonProps, 'serviceId' | 'providerId' | 'className'>) {
  return (
    <BookNowButton
      serviceId={serviceId}
      providerId={providerId}
      variant="outline"
      className={className}
    />
  );
} 