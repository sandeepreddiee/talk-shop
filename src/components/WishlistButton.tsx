import { useState, useEffect, forwardRef } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { toast } from 'sonner';
import { speechService } from '@/services/speechService';
import { playSuccessSound } from './AudioFeedback';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
}

export const WishlistButton = forwardRef<HTMLButtonElement, WishlistButtonProps>(({ 
  productId, 
  productName,
  size = 'default',
  variant = 'outline'
}, ref) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const [isInList, setIsInList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsInList(isInWishlist(productId));
  }, [productId, isInWishlist]);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isInList) {
        await removeFromWishlist(productId);
        toast.success('Removed from wishlist');
        await speechService.speak(`Removed ${productName} from wishlist`);
      } else {
        await addToWishlist(productId);
        toast.success('Added to wishlist');
        await speechService.speak(`Added ${productName} to wishlist`);
        playSuccessSound();
      }
      setIsInList(!isInList);
    } catch (error: any) {
      console.error('Wishlist error:', error);
      if (error?.message === 'User not authenticated') {
        toast.error('Please log in to use wishlist');
      } else {
        toast.error('Failed to update wishlist');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      ref={ref}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      size={size}
      variant={variant}
      disabled={isLoading}
      tabIndex={-1}
      aria-label={isInList ? 'Remove from wishlist' : 'Add to wishlist'}
      className="gap-2"
    >
      <Heart
        className={`h-5 w-5 ${isInList ? 'fill-current text-red-500' : ''}`}
        aria-hidden="true"
      />
      {size !== 'icon' && (isInList ? 'Remove from Wishlist' : 'Add to Wishlist')}
    </Button>
  );
});

WishlistButton.displayName = 'WishlistButton';
