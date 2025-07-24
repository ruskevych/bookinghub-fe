'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { BookingWizard } from '@/components/booking/booking-wizard';
import { toast } from 'sonner';

function BookingPageContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get initial service from URL params if provided
  const preSelectedServiceId = searchParams.get('service');
  const preSelectedProviderId = searchParams.get('provider');

  // TODO: Uncomment auth check when ready for production
  // useEffect(() => {
  //   // Redirect to login if not authenticated
  //   if (!isAuthenticated) {
  //     toast.error('Please log in to book a service');
  //     router.push('/login?redirect=/booking');
  //     return;
  //   }
  // }, [isAuthenticated, router]);

  // if (!isAuthenticated) {
  //   return null; // Show nothing while redirecting
  // }

  return (
    <div className="min-h-screen bg-background">
      <BookingWizard 
        preSelectedServiceId={preSelectedServiceId}
        preSelectedProviderId={preSelectedProviderId}
      />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  );
} 