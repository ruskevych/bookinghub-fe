'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york-v4/ui/avatar";
import { Textarea } from "@/registry/new-york-v4/ui/textarea";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import { Progress } from "@/registry/new-york-v4/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york-v4/ui/dialog";
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Filter,
  ChevronDown,
  Verified,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Review } from '@/types/provider';
import { REVIEW_FILTER_OPTIONS, REVIEW_SORT_OPTIONS } from '@/data/dummy-ui-data';

interface ProviderReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onSubmitReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  compact?: boolean;
}

export function ProviderReviews({ 
  reviews, 
  averageRating, 
  totalReviews, 
  onSubmitReview,
  compact = false 
}: ProviderReviewsProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [showWriteReview, setShowWriteReview] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = 5 - i;
    const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => filterRating === null || Math.floor(review.rating) === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    })
    .slice(0, compact ? 3 : undefined);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl lg:text-2xl font-bold">Reviews</h2>
          {!compact && (
            <p className="text-sm lg:text-base text-muted-foreground">
              {totalReviews} reviews from verified customers
            </p>
          )}
        </div>
        
        <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs min-h-[44px] touch-manipulation flex-shrink-0">
              <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">Write Review</span>
              <span className="sm:hidden">Review</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <WriteReviewForm
              onSubmit={onSubmitReview}
              onClose={() => setShowWriteReview(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Rating Overview */}
      <Card className="overflow-hidden border-2">
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <span className="text-4xl font-bold">{averageRating}</span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground">
                Based on {totalReviews} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by rating:</span>
            <Button
              variant={filterRating === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRating(null)}
            >
              All
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filterRating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRating(rating)}
                className="gap-1"
              >
                {rating}
                <Star className="w-3 h-3 fill-current" />
              </Button>
            ))}
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {compact && reviews.length > 3 && (
        <div className="text-center">
          <Button variant="outline">
            View All {totalReviews} Reviews
          </Button>
        </div>
      )}

      {filteredReviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No reviews match your filters.
          </p>
        </div>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [showFullComment, setShowFullComment] = useState(false);
  const isLongComment = review.comment.length > 200;

  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.customerAvatar} alt={review.customerName} />
            <AvatarFallback>
              {review.customerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-sm lg:text-base break-words">{review.customerName}</h4>
                  {review.verified && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      <Verified className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground break-words">
                  {review.serviceName} • {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3 lg:w-4 lg:h-4",
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <p className="text-muted-foreground">
                {isLongComment && !showFullComment
                  ? `${review.comment.slice(0, 200)}...`
                  : review.comment
                }
              </p>
              {isLongComment && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowFullComment(!showFullComment)}
                  className="p-0 h-auto text-sm"
                >
                  {showFullComment ? 'Show less' : 'Read more'}
                </Button>
              )}
            </div>

            {/* Provider Response */}
            {review.providerResponse && (
              <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold">Provider Response</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(review.providerResponse.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {review.providerResponse.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" className="h-auto p-0">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful ({review.helpful || 0})
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface WriteReviewFormProps {
  onSubmit: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  onClose: () => void;
}

function WriteReviewForm({ onSubmit, onClose }: WriteReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        customerId: 'current-user', // This would come from auth context
        customerName: 'Current User', // This would come from auth context
        rating,
        comment: comment.trim(),
        serviceId: 'selected-service', // This would be selected in form
        serviceName: 'Selected Service', // This would be selected in form
        verified: true
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating Selection */}
      <div>
        <label className="text-sm font-medium mb-2 block">Your Rating</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              className="p-1"
            >
              <Star
                className={cn(
                  "w-6 h-6 transition-colors",
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-sm font-medium mb-2 block">Your Review</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell others about your experience..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={rating === 0 || comment.trim() === '' || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
} 