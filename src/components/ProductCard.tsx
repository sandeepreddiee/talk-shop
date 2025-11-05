import { Product } from '@/types';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onQuickListen?: () => void;
}

export const ProductCard = ({ product, onQuickListen }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="article"
      aria-label={`${product.name}, $${product.price}, ${product.rating} stars, ${product.reviewCount} reviews`}
    >
      <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary">
          {product.name}
        </h3>
        <RatingStars rating={product.rating} count={product.reviewCount} size="sm" />
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold" aria-label={`Price: $${product.price}`}>
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through" aria-label={`Original price: $${product.originalPrice}`}>
              ${product.originalPrice}
            </span>
          )}
        </div>
        {product.prime && (
          <span className="inline-block text-xs px-2 py-1 bg-accent text-accent-foreground rounded">
            Prime
          </span>
        )}
        {onQuickListen && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={(e) => {
              e.stopPropagation();
              onQuickListen();
            }}
            aria-label="Quick listen to product details"
          >
            <Volume2 className="h-4 w-4 mr-2" aria-hidden="true" />
            Quick Listen
          </Button>
        )}
      </div>
    </Card>
  );
};
