'use client';

import React from 'react';
import { Card, CardContent } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york-v4/ui/avatar";
import { 
  Star, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Share2, 
  Shield, 
  CheckCircle,
  Award,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Provider } from '@/types/provider';
// TODO: Define getInitials inline or remove if not needed

interface ProviderHeaderProps {
  provider: Provider;
  onToggleFavorite: () => void;
  onMessage: () => void;
  onShare: () => void;
}

export function ProviderHeader({ 
  provider, 
  onToggleFavorite, 
  onMessage, 
  onShare 
}: ProviderHeaderProps) {
  const isMobile = useIsMobile();
  const initials = provider.name.split(' ').map(name => name[0]).join('').substring(0, 2).toUpperCase();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-3 lg:gap-6">
            <Avatar className="h-16 w-16 lg:h-24 lg:w-24 flex-shrink-0">
              <AvatarImage src={provider.profileImage} alt={provider.name} />
              <AvatarFallback className="text-base lg:text-lg">{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-foreground break-words">
                    {provider.name}
                  </h1>
                  <p className="text-base lg:text-lg text-muted-foreground break-words">
                    {provider.businessName}
                  </p>
                </div>
                
                {/* Mobile Action Buttons */}
                <div className="flex lg:hidden gap-1 ml-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleFavorite}
                    className={cn(
                      "h-10 w-10 min-h-[44px] min-w-[44px]",
                      provider.isFavorite && "text-red-600 border-red-200"
                    )}
                    aria-label={provider.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={cn(
                      "w-4 h-4",
                      provider.isFavorite && "fill-current"
                    )} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={onShare}
                    className="h-10 w-10 min-h-[44px] min-w-[44px]"
                    aria-label="Share this provider"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Rating and Reviews */}
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 lg:w-5 lg:h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-base lg:text-lg">{provider.rating}</span>
                  <span className="text-sm lg:text-base text-muted-foreground">
                    ({provider.totalReviews} reviews)
                  </span>
                </div>
                
                {provider.verificationStatus.isVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Shield className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="text-xs lg:text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>

              {/* Location and Category */}
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 mb-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-xs lg:text-sm">
                    {provider.location.city}, {provider.location.state}
                  </span>
                </div>
                
                <Badge variant="secondary" className="text-xs lg:text-sm">
                  {provider.category}
                </Badge>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="text-xs lg:text-sm">{provider.available}</span>
                </div>
              </div>

              {/* Badges and Achievements */}
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.verificationStatus.badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
                
                {provider.yearsExperience > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {provider.yearsExperience}+ years experience
                  </Badge>
                )}
                
                {provider.verificationStatus.backgroundCheck && (
                  <Badge variant="outline" className="text-xs text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Background checked
                  </Badge>
                )}
              </div>

              {/* Quick Info - Responsive grid */}
              <div className={cn(
                "grid gap-3 lg:gap-4 text-sm",
                isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
              )}>
                <div>
                  <span className="text-muted-foreground text-xs lg:text-sm">Starting at</span>
                  <div className="font-semibold text-sm lg:text-base">${provider.startingPrice}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs lg:text-sm">Response time</span>
                  <div className="font-semibold text-sm lg:text-base">
                    {provider.responseTime || 'Within 24h'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs lg:text-sm">Languages</span>
                  <div className="font-semibold text-sm lg:text-base">
                    {provider.languages?.join(', ') || 'English'}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs lg:text-sm">Service radius</span>
                  <div className="font-semibold text-sm lg:text-base">
                    {provider.location.serviceRadius} miles
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex flex-col gap-3 min-w-0 pl-4 pr-4">
            <Button 
              className="min-w-[140px] min-h-[44px]"
              onClick={() => {/* Handle book now */}}
              aria-label="Book an appointment with this provider"
            >
              Book Now
            </Button>
            <Button 
              variant="outline" 
              className="min-w-[140px] min-h-[44px]"
              onClick={onMessage}
              aria-label="Send a message to this provider"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleFavorite}
                className={cn(
                  "min-h-[44px] min-w-[44px]",
                  provider.isFavorite && "text-red-600 border-red-200"
                )}
                aria-label={provider.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={cn(
                  "w-4 h-4",
                  provider.isFavorite && "fill-current"
                )} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onShare}
                className="min-h-[44px] min-w-[44px]"
                aria-label="Share this provider"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {provider.bio && (
          <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t">
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
              {provider.bio}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 