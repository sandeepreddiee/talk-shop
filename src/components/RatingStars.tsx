import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const RatingStars = ({ rating, count, size = 'md', showCount = true }: RatingStarsProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating);
    const partial = i === Math.floor(rating) && rating % 1 !== 0;

    return (
      <Star
        key={i}
        className={`${sizeClasses[size]} ${
          filled ? 'fill-yellow-400 text-yellow-400' : partial ? 'fill-yellow-200 text-yellow-400' : 'text-border'
        }`}
        aria-hidden="true"
      />
    );
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center" role="img" aria-label={`${rating} out of 5 stars`}>
        {stars}
      </div>
      {showCount && count !== undefined && (
        <span className="text-sm text-muted-foreground ml-2">({count.toLocaleString()})</span>
      )}
    </div>
  );
};
