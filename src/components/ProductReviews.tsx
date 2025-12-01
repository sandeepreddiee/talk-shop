import { useEffect, useState } from 'react';
import { reviewService, Review } from '@/services/database/reviewService';
import { RatingStars } from './RatingStars';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      const data = await reviewService.getProductReviews(productId);
      setReviews(data);
      setLoading(false);
    };

    loadReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{review.title}</CardTitle>
                  <RatingStars rating={review.rating} size="sm" />
                </div>
                {review.verified_purchase && (
                  <Badge variant="secondary">Verified Purchase</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{review.content}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{new Date(review.created_at).toLocaleDateString()}</span>
                <span>{review.helpful_count} people found this helpful</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
