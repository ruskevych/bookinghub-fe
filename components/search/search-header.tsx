import React, { useCallback } from "react";
import Link from "next/link";
import { Search, Mic, Clock, Star, Menu } from "lucide-react";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/registry/new-york-v4/ui/command";
import { AuthNav } from "@/components/auth/auth-nav";
import { ModeSwitcher } from "@/components/mode-switcher";
import { recentSearches, popularServices } from "./constants";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showSearchDropdown: boolean;
  onDropdownToggle: (show: boolean) => void;
  onMobileMenuToggle: () => void;
  showMobileMenu: boolean;
  user?: { name: string } | null;
  isAuthenticated?: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = React.memo(function SearchHeader({
  searchQuery,
  onSearchChange,
  showSearchDropdown,
  onDropdownToggle,
  onMobileMenuToggle,
  showMobileMenu,
  user,
  isAuthenticated = false,
}) {
  const handleSearchSelect = useCallback((search: string) => {
    onSearchChange(search);
    onDropdownToggle(false);
  }, [onSearchChange, onDropdownToggle]);

  const handleFocus = useCallback(() => onDropdownToggle(true), [onDropdownToggle]);
  const handleBlur = useCallback(() => {
    setTimeout(() => onDropdownToggle(false), 150);
  }, [onDropdownToggle]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Timeio</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex w-96 mx-8 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for services, providers, or locations..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="pl-10 pr-12 h-10"
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            {/* Dropdown positioned absolutely below the input */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 w-full z-50 mt-1 bg-popover border rounded-md shadow-md">
                <Command>
                  <CommandList className="max-h-64 overflow-y-auto">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Recent Searches">
                      {recentSearches.map((search) => (
                        <CommandItem
                          key={search}
                          onSelect={() => handleSearchSelect(search)}
                          className="cursor-pointer"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {search}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandGroup heading="Popular Services">
                      {popularServices.map((service) => (
                        <CommandItem
                          key={service}
                          onSelect={() => handleSearchSelect(service)}
                          className="cursor-pointer"
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {service}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ModeSwitcher />
              <AuthNav user={isAuthenticated ? (user ?? undefined) : undefined} />
            </div>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Search Bar */}
      <div className="md:hidden py-3 border-t">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </header>
  );
});
