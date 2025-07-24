'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Dialog, DialogContent } from "@/registry/new-york-v4/ui/dialog";
import { 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Grid3X3,
  Filter,
  Star,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryImage } from '@/types/provider';
import Image from 'next/image';

interface ProviderGalleryProps {
  gallery: GalleryImage[];
}

export function ProviderGallery({ gallery }: ProviderGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Get unique categories from gallery images, fallback to default categories
  const galleryCategories = Array.from(new Set(gallery.map(img => img.category)));
  const categories = galleryCategories.length > 0 
    ? ['All', ...galleryCategories]
    : ['All', 'before_after', 'portfolio', 'workspace', 'certificates'];
  
  // Category display names
  const categoryNames: { [key: string]: string } = {
    'All': 'All Photos',
    'before_after': 'Before & After',
    'portfolio': 'Portfolio',
    'workspace': 'Workspace',
    'certificates': 'Certifications'
  };

  // Filter images by category
  const filteredImages = gallery.filter(image => 
    selectedCategory === 'All' || image.category === selectedCategory
  );

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setShowModal(false);
  };

  if (gallery.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Gallery</h2>
          <p className="text-muted-foreground">
            View examples of this provider&apos;s work
          </p>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Images Yet</h3>
            <p className="text-muted-foreground">
              This provider hasn&apos;t uploaded any portfolio images yet.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Gallery</h2>
          <p className="text-muted-foreground">
            {filteredImages.length} of {gallery.length} photos
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {categoryNames[category] || category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <GalleryImageCard
            key={image.id}
            image={image}
            index={index}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      {filteredImages.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              No images found in this category.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Image Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent 
          className="max-w-4xl p-0 bg-black/95" 
          onKeyDown={handleKeyDown}
        >
          <div className="relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setShowModal(false)}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Navigation Buttons */}
            {selectedImageIndex !== null && selectedImageIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}

            {selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}

            {/* Image */}
            {selectedImageIndex !== null && (
              <div className="flex flex-col">
                <div className="relative">
                  <Image
                    src={filteredImages[selectedImageIndex].url}
                    alt={filteredImages[selectedImageIndex].caption || 'Gallery image'}
                    width={1280} // Assuming a large width for the modal
                    height={720} // Assuming a large height for the modal
                    className="w-full max-h-[80vh] object-contain"
                  />
                </div>
                
                {/* Image Info */}
                <div className="p-6 bg-background">
                  <div className="flex items-start justify-between">
                    <div>
                      {filteredImages[selectedImageIndex].caption && (
                        <h3 className="font-semibold mb-2">
                          {filteredImages[selectedImageIndex].caption}
                        </h3>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {categoryNames[filteredImages[selectedImageIndex].category] || 
                         filteredImages[selectedImageIndex].category}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {selectedImageIndex + 1} of {filteredImages.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface GalleryImageCardProps {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}

function GalleryImageCard({ image, index, onClick }: GalleryImageCardProps) {
  const categoryNames: { [key: string]: string } = {
    'before_after': 'Before & After',
    'portfolio': 'Portfolio',
    'workspace': 'Workspace',
    'certificates': 'Certifications'
  };

  return (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-square">
        <Image src={image.url} alt={image.caption || 'Gallery image'} width={400} height={192} className="w-full h-48 object-cover rounded-lg" />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs bg-black/50 text-white border-none">
            {categoryNames[image.category] || image.category}
          </Badge>
        </div>
        
        {/* Main Badge */}
        {image.isMain && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        
        {/* Caption Overlay */}
        {image.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-sm font-medium line-clamp-2">
              {image.caption}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
} 