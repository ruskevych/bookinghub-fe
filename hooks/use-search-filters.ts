import { useState, useEffect, useMemo, useCallback } from 'react';
import { mockProviders, type Filters } from '@/components/search/constants';
import type { ServiceProvider } from '@/hooks/use-search';

interface UseSearchFiltersReturn {
  // Search state
  searchQuery: string;
  debouncedSearchQuery: string;
  isLoading: boolean;
  filters: Filters;
  favorites: Set<string>;
  
  // Results
  filteredProviders: ServiceProvider[];
  
  // Actions
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  setFilters: (filters: Filters) => void;
  toggleFavorite: (providerId: string) => void;
  clearAllFilters: () => void;
  handleCategoryChange: (category: string, checked: boolean) => void;
  
  // Filter counts
  activeFilterCount: number;
}

const DEFAULT_FILTERS: Filters = {
  categories: [],
  location: "",
  radius: [25],
  priceRange: [0, 500],
  availability: [],
  timePreference: [],
  sortBy: "best-match"
};

export function useSearchFilters(): UseSearchFiltersReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["2", "6", "10"]));

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // FIXED: Wrap setFilters in useCallback
  const setFilters = useCallback((newFilters: Filters) => {
    setFiltersState(newFilters);
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback((providerId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(providerId)) {
        newFavorites.delete(providerId);
      } else {
        newFavorites.add(providerId);
      }
      return newFavorites;
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  // Handle category filter changes
  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    setFiltersState(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.location) count++;
    if (filters.radius[0] !== 25) count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 500) count++;
    if (filters.availability.length > 0) count++;
    if (filters.timePreference.length > 0) count++;
    if (filters.sortBy !== "best-match") count++;
    return count;
  }, [filters]);

  // Filter and sort providers
  const filteredProviders = useMemo(() => {
    let result = [...mockProviders].map(provider => ({
      ...provider,
      isFavorite: favorites.has(provider.id)
    }));

    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(provider => 
        provider.name.toLowerCase().includes(query) ||
        provider.businessName.toLowerCase().includes(query) ||
        provider.category.toLowerCase().includes(query) ||
        provider.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(provider => filters.categories.includes(provider.category));
    }

    // Apply price range filter
    result = result.filter(provider => 
      provider.startingPrice >= filters.priceRange[0] && 
      provider.startingPrice <= filters.priceRange[1]
    );

    // Apply sorting
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "distance":
        result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      default:
        // Keep original order for "best-match" and "newest"
        break;
    }

    return result;
  }, [debouncedSearchQuery, filters, favorites]);

  return {
    // Search state
    searchQuery,
    debouncedSearchQuery,
    isLoading,
    filters,
    favorites,
    
    // Results
    filteredProviders,
    
    // Actions
    setSearchQuery,
    setIsLoading,
    setFilters,
    toggleFavorite,
    clearAllFilters,
    handleCategoryChange,
    
    // Filter counts
    activeFilterCount,
  };
}