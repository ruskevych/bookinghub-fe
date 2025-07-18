import React, { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york-v4/ui/avatar";
import { Heart, MapPin, Star, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceProvider } from './constants';

interface ProviderCardProps {
  provider: ServiceProvider;
  viewMode: "grid" | "list" | "map";
  onToggleFavorite: (providerId: string) => void;
  onBookNow?: (provider: ServiceProvider) => void;
}

// Memoized components for better performance
const ProviderRating = memo(function ProviderRating({ 
  rating, 
  reviewCount 
}: { 
  rating: number; 
  reviewCount: number; 
}) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating}</span>
      <span className="text-sm text-muted-foreground">({reviewCount})</span>
    </div>
  );
});

const ProviderLocation = memo(function ProviderLocation({ 
  city,
  state,
  zipCode
}: { 
  city: string;
  state: string;
  zipCode: string;
}) {
  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <MapPin className="h-3 w-3" />
      {city}, {state} {zipCode}
    </div>
  );
});

const ProviderAvailability = memo(function ProviderAvailability({ 
  available 
}: { 
  available: string; 
}) {
  return (
    <div className="flex items-center gap-1 text-sm text-green-600">
      <Clock className="h-3 w-3" />
      {available}
    </div>
  );
});

const FavoriteButton = memo(function FavoriteButton({ 
  isFavorite, 
  onToggle,
  className 
}: { 
  isFavorite: boolean; 
  onToggle: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={className}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )} 
      />
    </Button>
  );
});

const ProviderAvatar = memo(function ProviderAvatar({ 
  image, 
  name,
  className 
}: { 
  image: string; 
  name: string;
  className?: string;
}) {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <Avatar className={className}>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
});

// List view component
const ProviderCardList = memo(function ProviderCardList({
  provider,
  onToggleFavorite,
  onBookNow
}: {
  provider: ServiceProvider;
  onToggleFavorite: (providerId: string) => void;
  onBookNow?: (provider: ServiceProvider) => void;
}) {
  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(provider.id);
  }, [onToggleFavorite, provider.id]);

  const handleBookNow = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBookNow?.(provider);
  }, [onBookNow, provider]);

  const handleFavoriteToggle = useCallback(() => {
    onToggleFavorite(provider.id);
  }, [onToggleFavorite, provider.id]);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <ProviderAvatar 
            image={provider.image} 
            name={provider.name}
            className="h-16 w-16 flex-shrink-0"
          />
          
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-grow">
                <h3 className="font-semibold truncate">{provider.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{provider.businessName}</p>
              </div>
              
              <FavoriteButton
                isFavorite={provider.isFavorite}
                onToggle={handleFavoriteToggle}
                className="flex-shrink-0 ml-2"
              />
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <ProviderRating rating={provider.rating} reviewCount={provider.reviewCount} />
              <ProviderLocation 
                city={provider.city} 
                state={provider.state} 
                zipCode={provider.zipCode} 
              />
              <Badge variant="secondary" className="text-xs">
                {provider.category}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {provider.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold">${provider.startingPrice}</div>
                <ProviderAvailability available={provider.available} />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/providers/${provider.id}`, '_blank');
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button onClick={handleBookNow} size="sm">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Grid view component
const ProviderCardGrid = memo(function ProviderCardGrid({
  provider,
  onToggleFavorite,
  onBookNow
}: {
  provider: ServiceProvider;
  onToggleFavorite: (providerId: string) => void;
  onBookNow?: (provider: ServiceProvider) => void;
}) {
  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(provider.id);
  }, [onToggleFavorite, provider.id]);

  const handleBookNow = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBookNow?.(provider);
  }, [onBookNow, provider]);

  const handleFavoriteToggle = useCallback(() => {
    onToggleFavorite(provider.id);
  }, [onToggleFavorite, provider.id]);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <ProviderAvatar 
            image={provider.image} 
            name={provider.name}
            className="h-12 w-12"
          />
          
          <FavoriteButton
            isFavorite={provider.isFavorite}
            onToggle={handleFavoriteToggle}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
        
        <div className="space-y-1">
          <h3 className="font-semibold leading-tight">{provider.name}</h3>
          <p className="text-sm text-muted-foreground">{provider.businessName}</p>
        </div>
        
        <Badge variant="secondary" className="w-fit text-xs">
          {provider.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="py-3">
        <div className="mb-2">
          <ProviderRating rating={provider.rating} reviewCount={provider.reviewCount} />
        </div>
        
        <div className="mb-3">
          <ProviderLocation 
            city={provider.city} 
            state={provider.state} 
            zipCode={provider.zipCode} 
          />
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {provider.description}
        </p>
        
        <div className="mb-4">
          <ProviderAvailability available={provider.available} />
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">${provider.startingPrice}</span>
            <span className="text-sm text-muted-foreground">starting from</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to provider profile
                window.open(`/providers/${provider.id}`, '_blank');
              }}
              className="flex-1" 
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button onClick={handleBookNow} className="flex-1" size="sm">
              Book Now
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
});

export const ProviderCard = memo(function ProviderCard({ 
  provider, 
  viewMode, 
  onToggleFavorite,
  onBookNow 
}: ProviderCardProps) {
  if (viewMode === "list") {
    return (
      <ProviderCardList
        provider={provider}
        onToggleFavorite={onToggleFavorite}
        onBookNow={onBookNow}
      />
    );
  }

  // Grid view (default)
  return (
    <ProviderCardGrid
      provider={provider}
      onToggleFavorite={onToggleFavorite}
      onBookNow={onBookNow}
    />
  );
});

// Add display name for better debugging
ProviderCard.displayName = 'ProviderCard'; 