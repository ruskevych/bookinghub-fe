import React, { useState, useCallback, memo } from 'react';
import { Controller, Control } from 'react-hook-form';
import { Button } from "@/registry/new-york-v4/ui/button";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select";
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york-v4/ui/popover";
import { Calendar } from "@/registry/new-york-v4/ui/calendar";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area";
import { ChevronDown, ChevronUp, CalendarIcon, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  categories, 
  quickDateOptions, 
  sortOptions,
  type Filters 
} from './constants';

interface SearchFormData extends Filters {
  searchQuery: string;
}

interface FilterSidebarProps {
  filters: SearchFormData;
  onFiltersChange: (filters: Partial<SearchFormData>) => void;
  activeFilterCount: number;
  onClearFilters: () => void;
  onCategoryChange: (category: string, checked: boolean) => void;
  control: Control<SearchFormData>;
  isMobile?: boolean;
  viewportRef?: React.RefObject<HTMLDivElement>;
  categorySuggestions?: { category: string; count: number }[];
  priceRangeSuggestions?: { min: number; max: number; average: number };
}

// Memoized FilterSection component for better performance
const FilterSection = memo(function FilterSection({ 
  id, 
  title, 
  children, 
  expanded, 
  onToggle 
}: { 
  id: string; 
  title: string; 
  children: React.ReactNode;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const handleToggle = useCallback(() => {
    onToggle(id);
  }, [id, onToggle]);

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        onClick={handleToggle}
        className="w-full justify-between h-auto p-2 font-medium text-left"
      >
        {title}
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      {expanded && children}
    </div>
  );
});

// Memoized Category section for performance
const CategorySection = memo(function CategorySection({
  categories: allCategories,
  selectedCategories,
  onCategoryChange,
  showMore,
  onToggleShowMore
}: {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
  showMore: boolean;
  onToggleShowMore: () => void;
}) {
  const visibleCategories = showMore ? allCategories : allCategories.slice(0, 5);

  return (
    <div className="space-y-2">
      {visibleCategories.map((category) => (
        <div key={category} className="flex items-center space-x-2">
          <Checkbox 
            id={category}
            checked={selectedCategories.includes(category)}
            onCheckedChange={(checked) => onCategoryChange(category, !!checked)}
          />
          <label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {category}
          </label>
        </div>
      ))}
      {allCategories.length > 5 && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggleShowMore}
          className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
        >
          {showMore ? 'Show Less' : `Show ${allCategories.length - 5} More`}
        </Button>
      )}
    </div>
  );
});

// Memoized Location section
const LocationSection = memo(function LocationSection({
  control
}: {
  control: Control<SearchFormData>;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Location or ZIP Code</label>
      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              placeholder="Enter city, address, or ZIP code"
              className="pl-10"
            />
          </div>
        )}
      />
      <div className="text-xs text-muted-foreground">
        Results will be sorted by distance from your location
      </div>
    </div>
  );
});

// Memoized Price Range section
const PriceRangeSection = memo(function PriceRangeSection({
  control
}: {
  control: Control<SearchFormData>;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-xs font-medium">Min</label>
          <Controller
            name="priceRange"
            control={control}
            render={({ field }) => {
              const handleMinPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange([Number(e.target.value), field.value[1]]);
              }, [field.onChange, field.value]);

              return (
                <Input
                  type="number"
                  value={field.value[0]}
                  onChange={handleMinPriceChange}
                  placeholder="$0"
                  min="0"
                />
              );
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Max</label>
          <Controller
            name="priceRange"
            control={control}
            render={({ field }) => {
              const handleMaxPriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange([field.value[0], Number(e.target.value)]);
              }, [field.onChange, field.value]);

              return (
                <Input
                  type="number"
                  value={field.value[1]}
                  onChange={handleMaxPriceChange}
                  placeholder="$500"
                  min="0"
                />
              );
            }}
          />
        </div>
      </div>
      <Controller
        name="priceRange"
        control={control}
        render={({ field }) => (
          <div className="text-xs text-muted-foreground">
            ${field.value[0]} - ${field.value[1]}
          </div>
        )}
      />
    </div>
  );
});

// Memoized Availability section
const AvailabilitySection = memo(function AvailabilitySection({
  control
}: {
  control: Control<SearchFormData>;
}) {
  return (
    <div className="space-y-3">
      <Controller
        name="availability"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            {quickDateOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={option.value}
                  checked={field.value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValue = checked 
                      ? [...field.value, option.value]
                      : field.value.filter(v => v !== option.value);
                    field.onChange(newValue);
                  }}
                />
                <label htmlFor={option.value} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
});


export const FilterSidebar = memo(function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  activeFilterCount, 
  onClearFilters,
  onCategoryChange,
  control,
  isMobile = false, 
  viewportRef,
  categorySuggestions = [],
  priceRangeSuggestions

}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    location: true,
    price: true,
    availability: false
  });
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const toggleShowMoreCategories = useCallback(() => {
    setShowMoreCategories(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Filter Header */}
      <div className="border-b bg-background pb-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{activeFilterCount}</Badge>
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Filter Content */}
      <ScrollArea 
        className="h-[calc(100vh-16rem)] md:h-[calc(100vh-12rem)]"
        viewportRef={viewportRef}
      >
        <div className="p-4 space-y-6">
          {/* Sort */}
          <div className="space-y-3">
            <h4 className="font-medium">Sort by</h4>
            <Controller
              name="sortBy"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Separator />

          {/* Categories */}
          <FilterSection 
            id="categories" 
            title="Categories"
            expanded={expandedSections.categories}
            onToggle={toggleSection}
          >
            {/* Category Suggestions */}
            {categorySuggestions && categorySuggestions.length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-muted-foreground mb-1">Popular categories:</div>
                <div className="flex flex-wrap gap-2">
                  {categorySuggestions.slice(0, 5).map((suggestion: { category: string; count: number }) => (
                    <Badge key={suggestion.category} variant="outline">
                      {suggestion.category} ({suggestion.count})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <CategorySection
              categories={categories}
              selectedCategories={filters.categories}
              onCategoryChange={onCategoryChange}
              showMore={showMoreCategories}
              onToggleShowMore={toggleShowMoreCategories}
            />
          </FilterSection>

          {/* Location */}
          <FilterSection 
            id="location" 
            title="Location"
            expanded={expandedSections.location}
            onToggle={toggleSection}
          >
            <LocationSection control={control} />
          </FilterSection>

          {/* Price Range */}
          <FilterSection 
            id="price" 
            title="Price Range"
            expanded={expandedSections.price}
            onToggle={toggleSection}
          >
            {/* Price Range Suggestions */}
{priceRangeSuggestions && (
  <div className="mb-2">
    <span className="text-xs text-muted-foreground">
      Suggested: ${priceRangeSuggestions.min} - ${priceRangeSuggestions.max} (avg: ${priceRangeSuggestions.average})
    </span>
  </div>
)}
<PriceRangeSection control={control} />
          </FilterSection>

          {/* Availability */}
          <FilterSection 
            id="availability" 
            title="Availability"
            expanded={expandedSections.availability}
            onToggle={toggleSection}
          >
            <AvailabilitySection control={control} />
          </FilterSection>


        </div>
      </ScrollArea>
    </div>
  );
});

// Add custom comparison function for better memoization
FilterSidebar.displayName = 'FilterSidebar'; 