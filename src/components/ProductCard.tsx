import { Product } from '@/types';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { speechService } from '@/services/speechService';
import { forwardRef } from 'react';

interface ProductCardProps {
  product: Product;
  onQuickListen?: () => void;
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, onQuickListen }, ref) => {
    const navigate = useNavigate();

  const handleFocus = () => {
    // Speak product info when tabbing through products
    const dealInfo = product.originalPrice 
      ? `On sale for $${product.price}, original price $${product.originalPrice}` 
      : `$${product.price}`;
    const ratingInfo = `${product.rating} stars with ${product.reviewCount} reviews`;
    const announcement = `${product.name}. ${dealInfo}. ${ratingInfo}`;
    speechService.speak(announcement);
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const savingsPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      ref={ref}
      className="group cursor-pointer hover:shadow-xl transition-all duration-200 border-border focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 bg-card relative"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      onFocus={handleFocus}
      tabIndex={0}
      role="article"
      aria-label={`${product.name}, $${product.price}, ${product.rating} stars, ${product.reviewCount} reviews`}
    >
      {savingsPercent > 0 && (
        <div className="absolute top-2 left-2 bg-[hsl(var(--deal-badge))] text-[hsl(var(--deal-text))] text-xs font-bold px-2 py-1 rounded z-10">
          -{savingsPercent}% OFF
        </div>
      )}
      <div className="aspect-square overflow-hidden bg-white flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-normal text-sm line-clamp-2 text-foreground group-hover:text-primary">
          {product.name}
        </h3>
        <RatingStars rating={product.rating} count={product.reviewCount} size="sm" />
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-normal text-[hsl(var(--deal-badge))]" aria-label={`Price: $${product.price}`}>
            ${product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-muted-foreground line-through" aria-label={`Original price: $${product.originalPrice}`}>
                ${product.originalPrice}
              </span>
            </>
          )}
        </div>
        {product.prime && (
          <div className="flex items-center gap-2">
            <span className="inline-block text-xs font-bold px-2 py-0.5 bg-[hsl(var(--prime-badge))] text-[hsl(var(--prime-text))] rounded">
              prime
            </span>
            <span className="text-xs text-muted-foreground">FREE delivery</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Get it by tomorrow</p>
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
});

ProductCard.displayName = 'ProductCard';
