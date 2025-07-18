import { useMemo, useCallback } from 'react'
import { useDebounce } from './use-debounce'
import { ServiceProvider } from '@/components/search/constants';

export type { ServiceProvider } from '@/components/search/constants';


export interface SearchFilters {
  categories: string[]
  location: string
  priceRange: number[]
  availability: string[]
  sortBy: string
}

// Optimized search hook focused on data fetching and caching only
export function useOptimizedSearch(providers: ServiceProvider[]) {
  // Memoized provider data to prevent unnecessary recalculations
  const memoizedProviders = useMemo(() => providers, [providers]);

  // Optimized filtering function with better performance
  const filterProviders = useCallback((
    providers: ServiceProvider[],
    searchQuery: string,
    filters: SearchFilters
  ): ServiceProvider[] => {
    let filtered = [...providers];
    
    // Search query filter - optimized for performance
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(provider => {
        // Use includes for faster string matching
        return (
          provider.name.toLowerCase().includes(query) ||
          provider.businessName.toLowerCase().includes(query) ||
          provider.category.toLowerCase().includes(query) ||
          provider.description.toLowerCase().includes(query)
        );
      });
    }
    
    // Category filter - early return optimization
    if (filters.categories.length > 0) {
      filtered = filtered.filter(provider => 
        filters.categories.includes(provider.category)
      );
    }
    
    // Location filter - matches city, state, or ZIP code
    if (filters.location?.trim()) {
      const searchLocation = filters.location.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.city.toLowerCase().includes(searchLocation) ||
        provider.state.toLowerCase().includes(searchLocation) ||
        provider.zipCode.includes(searchLocation) ||
        provider.address.toLowerCase().includes(searchLocation)
      );
    }
    
    // Price range filter - optimized with early bounds check
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [minPrice, maxPrice] = filters.priceRange;
      if (minPrice > 0 || maxPrice < 500) { // Only filter if not default values
        filtered = filtered.filter(provider => 
          provider.startingPrice >= minPrice && 
          provider.startingPrice <= maxPrice
        );
      }
    }
    
    // Availability filter - using structured data
    if (filters.availability.length > 0) {
      filtered = filtered.filter(provider => {
        return filters.availability.some(availability => {
          switch (availability) {
            case "today":
              return provider.availabilityWindows.today;
            case "tomorrow":
              return provider.availabilityWindows.tomorrow;
            case "week":
              return provider.availabilityWindows.thisWeek;
            case "next-week":
              return provider.availabilityWindows.nextWeek;
            default:
              return true;
          }
        });
      });
    }
    
    return filtered;
  }, []);

  // Optimized sorting function
  const sortProviders = useCallback((
    providers: ServiceProvider[],
    sortBy: string
  ): ServiceProvider[] => {
    if (sortBy === "best-match") {
      return providers; // No sorting needed for best match
    }

    return [...providers].sort((a, b) => {
      switch (sortBy) {
        case "availability":
          const dateTimeA = new Date(`${a.nextAvailableSlot.date}T${a.nextAvailableSlot.time}`);
          const dateTimeB = new Date(`${b.nextAvailableSlot.date}T${b.nextAvailableSlot.time}`);
          return dateTimeA.getTime() - dateTimeB.getTime();
        case "price-asc":
          return a.startingPrice - b.startingPrice;
        case "price-desc":
          return b.startingPrice - a.startingPrice;
        case "rating":
          return b.rating - a.rating;
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance);
        case "newest":
          return b.reviewCount - a.reviewCount; // Using reviewCount as proxy for "newest"
        default:
          return 0;
      }
    });
  }, []);

  // Main search function - memoized for performance
  const searchProviders = useCallback((
    searchQuery: string,
    filters: SearchFilters
  ): ServiceProvider[] => {
    // Filter first, then sort for better performance
    const filtered = filterProviders(memoizedProviders, searchQuery, filters);
    return sortProviders(filtered, filters.sortBy);
  }, [memoizedProviders, filterProviders, sortProviders]);

  // Search statistics calculator
  const calculateSearchStats = useCallback((
    results: ServiceProvider[],
    searchQuery: string,
    filters: SearchFilters
  ) => {
    const hasActiveFilters = 
      filters.categories.length > 0 ||
      filters.availability.length > 0 ||
      (filters.location?.trim().length || 0) > 0 ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 500 ||
      searchQuery.trim().length > 0;

    const activeFilterCount = 
      filters.categories.length +
      filters.availability.length +
      (filters.location?.trim() ? 1 : 0) +
      (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500 ? 1 : 0) +
      (searchQuery.trim() ? 1 : 0);

    return {
      totalResults: results.length,
      hasActiveFilters,
      activeFilterCount,
      query: searchQuery
    };
  }, []);

  // Category suggestions based on current providers
  const getCategorySuggestions = useCallback((providers: ServiceProvider[]) => {
    const categoryCounts = providers.reduce((acc, provider) => {
      acc[provider.category] = (acc[provider.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({ category, count }));
  }, []);

  // Price range suggestions
  const getPriceRangeSuggestions = useCallback((providers: ServiceProvider[]) => {
    const prices = providers.map(p => p.startingPrice);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    };
  }, []);

  return {
    // Core functionality
    searchProviders,
    calculateSearchStats,
    
    // Helper functions
    getCategorySuggestions,
    getPriceRangeSuggestions,
    
    // Raw data access
    providers: memoizedProviders
  };
} 