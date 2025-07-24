"use client"

import React, { useState, useRef, useCallback, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/registry/new-york-v4/ui/sheet";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { SearchHeader } from "@/components/search/search-header";
import { ResultsGrid } from "@/components/search/results-grid";
import { TopNavbar } from '@/components/top-navbar';
import {
  mockProviders,
  type ViewMode,
  type Filters,
  type ServiceProvider,
  type SearchFormData,
} from "@/components/search/constants";
import { useOptimizedSearch } from "@/hooks/use-search";
import { encodeSearchParams, decodeSearchParams } from "@/components/search/utils";
import { Grid3X3, List, SlidersHorizontal, Map} from "lucide-react";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useProviderSearch } from '@/hooks/use-provider-search';

const DEFAULT_FORM_VALUES: SearchFormData = {
  searchQuery: "",
  categories: [],
  location: "",
  priceRange: [0, 500],
  availability: [],
  sortBy: "best-match",
};

export default function SearchPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceSearchPage />
    </Suspense>
  );
}

function ServiceSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth(); // Get user and isAuthenticated from useAuth
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["2", "6", "10"]))
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Debounced search query state
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  // Recently Viewed scroll control
  const recentlyViewedRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  
  // Define the ref for the filter modal's scroll area
  const filterViewportRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  // SINGLE React Hook Form instance - Initialize with URL params
  const form = useForm<SearchFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange"
  })

  const { control, watch, reset, setValue } = form

  // Initialize form with URL parameters on mount
  useEffect(() => {
    if (!isInitialized) {
      const initialValues = decodeSearchParams(searchParams);
      reset(initialValues);
      setIsInitialized(true);
    }
  }, [searchParams, reset, isInitialized]);

  // Watch individual fields to avoid array recreation issues
  const searchQuery = watch("searchQuery")
  const categories = watch("categories")
  const location = watch("location")
  const priceRange = watch("priceRange")
  const availability = watch("availability")
  const sortBy = watch("sortBy")
  
  // Current form data for URL updates
  const currentFormData = useMemo(() => ({
    searchQuery,
    categories: categories || [],
    location: location || "",
    priceRange: priceRange || [0, 500],
    availability: availability || [],
    sortBy: sortBy || "best-match"
  }), [searchQuery, categories, location, priceRange, availability, sortBy]);

  // Debounced search query implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery || "");
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL parameters when form data changes (debounced)
  useEffect(() => {
    if (!isInitialized) return; // Don't update URL during initialization
    
    const timer = setTimeout(() => {
      const newParams = encodeSearchParams(currentFormData);
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      
      // Only update if URL has actually changed
      if (newUrl !== window.location.pathname + window.location.search) {
        router.replace(newUrl, { scroll: false });
      }
    }, 500); // Debounce URL updates

    return () => clearTimeout(timer);
  }, [currentFormData, router, isInitialized]);

  // Loading effect for visual feedback
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [debouncedSearch, categories, location, priceRange, availability, sortBy]);

  // Example usage:
  const searchInput = {
    query: '', // Bind to search input value
    categories: [], // Bind to selected categories
    location: '', // Bind to location filter
    priceRange: undefined, // Bind to price range filter
    availability: [], // Bind to availability filter
    sortBy: '', // Bind to sort option
    limit: 10,
    page: 1,
  };
  const { providers, pagination, filters, loading, error, refetch } = useProviderSearch(searchInput);

  // Use 'providers' for rendering search results, 'filters' for filter options, and handle 'loading' and 'error' states.

  // Suggestions and stats now come from 'filters' and 'pagination' returned by useProviderSearch
  const categorySuggestions = filters?.categories || [];
  const priceRangeSuggestions = filters?.priceRanges || [];
  const searchStats = pagination || {};

  // Memoized active filter count
  const activeFilterCount = useMemo(() => 
    (categories?.length || 0) +
    (location ? 1 : 0) +
    (priceRange?.[0] !== 0 || priceRange?.[1] !== 500 ? 1 : 0) +
    (availability?.length || 0) +
    (sortBy !== "best-match" ? 1 : 0)
  , [categories, location, priceRange, availability, sortBy]);

  // Optimized event handlers with useCallback
  const handleSearchChange = useCallback((value: string) => {
    setValue('searchQuery', value);
  }, [setValue]);

  const handleDropdownToggle = useCallback((show: boolean) => {
    setShowSearchDropdown(show);
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setShowMobileMenu(prev => !prev);
  }, []);

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

  const clearAllFilters = useCallback(() => {
    reset(DEFAULT_FORM_VALUES);
  }, [reset]);

  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    const currentCategories = form.getValues('categories');
    const newCategories = checked 
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    setValue('categories', newCategories);
  }, [form, setValue]);

  const handleFiltersChange = useCallback((newFilters: Partial<SearchFormData>) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        setValue(key as keyof SearchFormData, value);
      }
    });
  }, [setValue]);

  const handleBookNow = useCallback((provider: ServiceProvider) => {
    // Navigate to booking page with provider pre-selected
    console.log("Book now for provider:", provider.name);
    router.push(`/booking?provider=${provider.id}`);
  }, [router]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Memoized form values for child components
  const watchedValues = useMemo(() => ({
    searchQuery: searchQuery || "",
    categories: categories || [],
    location: location || "",
    priceRange: priceRange || [0, 500],
    availability: availability || [],
    sortBy: sortBy || "best-match"
  }), [searchQuery, categories, location, priceRange, availability, sortBy]);

  return (
    <>
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        showSearchDropdown={showSearchDropdown}
        onDropdownToggle={handleDropdownToggle}
        onMobileMenuToggle={handleMobileMenuToggle}
        showMobileMenu={showMobileMenu}
        user={user}
        isAuthenticated={!!isAuthenticated}
      />
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={watchedValues}
                onFiltersChange={handleFiltersChange}
                activeFilterCount={activeFilterCount}
                onClearFilters={clearAllFilters}
                onCategoryChange={handleCategoryChange}
                control={control}
                categorySuggestions={categorySuggestions}
                priceRangeSuggestions={priceRangeSuggestions}
              />
            </div>
          </aside>

          {/* Results Area */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {searchQuery ? `Results for &quot;${searchQuery}&quot;` : "All Services"}
                </h1>
                <p className="text-muted-foreground">
                  {providers.length} service{providers.length !== 1 ? 's' : ''} found
                </p>
                {/* Search Stats */}
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="text-xs text-muted-foreground">Active filters: {searchStats.activeFilterCount}</span>
                  {searchStats.hasActiveFilters && (
                    <span className="text-xs text-muted-foreground">Filtered by query: &quot;{searchStats.query}&quot;</span>
                  )}
                </div>
                {/* Price Range Suggestion */}
                {priceRangeSuggestions && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Suggested price range: ${priceRangeSuggestions.min} - ${priceRangeSuggestions.max} (avg: ${priceRangeSuggestions.average})
                  </div>
                )}
              </div>
              
              {/* View Mode Toggles */}
              <div className="hidden md:flex items-center space-x-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handleViewModeChange("grid")}
                  className="h-8 w-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handleViewModeChange("list")}
                  className="h-8 w-8"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handleViewModeChange("map")}
                  className="h-8 w-8"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results */}
            <ResultsGrid
              providers={providers}
              viewMode={viewMode}
              isLoading={isLoading}
              onToggleFavorite={toggleFavorite}
              onBookNow={handleBookNow}
            />
          </main>
        </div>
      </div>
    </>
  )
} 