import React from "react";
import { cn } from "@/lib/utils";
import { ProviderCard } from "./provider-card";
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton";
import { Search } from "lucide-react";
import type { ServiceProvider, ViewMode } from "./constants";

interface ResultsGridProps {
  providers: ServiceProvider[];
  viewMode: ViewMode;
  isLoading: boolean;
  onToggleFavorite: (providerId: string) => void;
  onBookNow: (provider: ServiceProvider) => void;
}

export const ResultsGrid: React.FC<ResultsGridProps> = React.memo(function ResultsGrid({
  providers,
  viewMode,
  isLoading,
  onToggleFavorite,
  onBookNow,
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No services found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6",
      viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
    )}>
      {providers.map((provider) => (
        <ProviderCard
          key={provider.id}
          provider={provider}
          viewMode={viewMode}
          onToggleFavorite={onToggleFavorite}
          onBookNow={onBookNow}
        />
      ))}
    </div>
  );
});
