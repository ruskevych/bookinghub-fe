import { useState, useEffect, useCallback } from 'react';
import type { Provider, Review, AvailabilitySlot } from '@/types/provider';
import { 
  getDummyProvider, 
  getDummyReviews, 
  generateMockAvailability 
} from '@/data/dummy-providers';

export interface UseProviderOptions {
  providerId: string;
  includeReviews?: boolean;
  includeAvailability?: boolean;
  includeGallery?: boolean;
}

export interface UseProviderReturn {
  provider: Provider | null;
  reviews: Review[];
  availability: AvailabilitySlot[];
  isLoading: boolean;
  error: string | null;
  refreshProvider: () => Promise<void>;
  bookService: (serviceId: string, slot: { date: string; time: string }) => Promise<void>;
  toggleFavorite: () => Promise<void>;
  submitReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
}

export function useProvider({
  providerId,
  includeReviews = true,
  includeAvailability = true,
  includeGallery = true
}: UseProviderOptions): UseProviderReturn {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch provider data - in real app, this would be an API call
  const fetchProviderData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get provider data from dummy data (replace with API call later)
      const providerData = getDummyProvider(providerId);
      
      if (!providerData) {
        throw new Error(`Provider with ID ${providerId} not found`);
      }

      // Get reviews data (replace with API call later)
      const reviewsData = includeReviews ? getDummyReviews(providerId) : [];
      
      // Get availability data (replace with API call later)
      const availabilityData = includeAvailability ? generateMockAvailability(providerId) : [];

      setProvider(providerData);
      setReviews(reviewsData);
      setAvailability(availabilityData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch provider data');
    } finally {
      setIsLoading(false);
    }
  }, [providerId, includeReviews, includeAvailability, includeGallery]);

  const refreshProvider = useCallback(async () => {
    await fetchProviderData();
  }, [fetchProviderData]);

  const bookService = useCallback(async (serviceId: string, slot: { date: string; time: string }) => {
    // In real app, this would make API call to book the service
    // TODO: Replace with actual API call
    console.log('Booking service:', { serviceId, slot, providerId });
    
    // Simulate booking success and update availability
    setAvailability(prev => 
      prev.map(availSlot => 
        availSlot.date === slot.date && availSlot.startTime === slot.time
          ? { ...availSlot, status: 'busy' as const }
          : availSlot
      )
    );
  }, [providerId]);

  const toggleFavorite = useCallback(async () => {
    if (!provider) return;
    
    // In real app, this would make API call
    // TODO: Replace with actual API call
    setProvider(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
  }, [provider]);

  const submitReview = useCallback(async (review: Omit<Review, 'id' | 'createdAt'>) => {
    // In real app, this would make API call
    // TODO: Replace with actual API call
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date(),
      helpful: 0
    };
    
    setReviews(prev => [newReview, ...prev]);
    
    // Update provider rating and review count
    if (provider) {
      const newReviewCount = provider.reviewCount + 1;
      const newTotalRating = (provider.rating * provider.reviewCount + review.rating);
      const newAverageRating = newTotalRating / newReviewCount;
      
      setProvider(prev => prev ? {
        ...prev,
        rating: Math.round(newAverageRating * 10) / 10,
        reviewCount: newReviewCount,
        totalReviews: newReviewCount
      } : null);
    }
  }, [provider]);

  useEffect(() => {
    if (providerId) {
      fetchProviderData();
    }
  }, [providerId, fetchProviderData]);

  return {
    provider,
    reviews,
    availability,
    isLoading,
    error,
    refreshProvider,
    bookService,
    toggleFavorite,
    submitReview
  };
} 