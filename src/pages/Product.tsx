import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService } from '@/services/database/productService';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/RatingStars';
import { useCartStore } from '@/stores/useCartStore';
import { useVoiceStore } from '@/stores/useVoiceStore';
import { speechService } from '@/services/speechService';
import { WishlistButton } from '@/components/WishlistButton';
import { ProductReviews } from '@/components/ProductReviews';
import { ProductAssistant } from '@/components/ProductAssistant';
import { toast } from 'sonner';
import { ShoppingCart, Zap, MessageCircle, Volume2 } from 'lucide-react';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { activityService } from '@/services/activityService';
import { playSuccessSound, playErrorSound } from '@/components/AudioFeedback';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { setAssistantOpen: setGlobalAssistantOpen } = useVoiceStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        
        if (data) {
          speechService.speak(`Product page. ${data.name}. Price: $${data.price}. Rating: ${data.rating} stars. Say add to cart, buy now, or ask assistant for help.`);
          await activityService.logActivity('view_product', { productId: id, productName: data.name });
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addItem(product.id);
      toast.success('Added to cart');
      await speechService.speak('Added to cart');
      playSuccessSound();
      await activityService.logActivity('add_to_cart', { productId: product.id, productName: product.name });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      if (error?.message === 'User not authenticated') {
        toast.error('Please log in to add items to cart');
        await speechService.speak('Please log in to add items to your cart');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error('Failed to add to cart');
      }
      playErrorSound();
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    try {
      await addItem(product.id);
      await speechService.speak('Taking you to checkout');
      await activityService.logActivity('buy_now', { productId: product.id, productName: product.name });
      navigate('/checkout');
    } catch (error: any) {
      console.error('Error processing buy now:', error);
      if (error?.message === 'User not authenticated') {
        toast.error('Please log in to make a purchase');
        await speechService.speak('Please log in to make a purchase');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error('Failed to process purchase');
      }
      playErrorSound();
    }
  };

  const handleAskAssistant = () => {
    setAssistantOpen(true);
    activityService.logActivity('open_voice_assistant', { context: 'product', productId: product?.id });
  };

  const handleListenDescription = async () => {
    if (!product) return;
    await speechService.speak(`${product.name}. Price: ${product.price} dollars. ${product.description}. Key features: ${product.features.join('. ')}`);
    await activityService.logActivity('voice_product_description', { productId: product.id });
  };

  if (loading) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main id="main-content" className="container py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container py-8 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full rounded-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
            }}
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <RatingStars rating={product.rating} count={product.reviewCount} size="lg" />
          <div className="text-3xl font-bold" aria-label={`Price: $${product.price}`}>
            ${product.price}
          </div>
          {product.originalPrice && (
            <div className="text-lg text-muted-foreground line-through">
              Was: ${product.originalPrice}
            </div>
          )}
          {!product.inStock && (
            <div className="text-destructive font-semibold" role="alert">
              Out of Stock
            </div>
          )}
          <p className="text-muted-foreground">{product.description}</p>
          
          <div>
            <h2 className="font-semibold mb-2">Key Features:</h2>
            <ul className="list-disc list-inside space-y-1">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleListenDescription} 
              variant="outline"
              className="w-full"
              aria-label="Listen to product description"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Listen to Description
            </Button>
            <Button 
              onClick={handleAskAssistant}
              variant="outline"
              className="w-full"
              aria-label="Ask assistant about this product"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Ask Assistant
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleAddToCart} 
              size="lg" 
              className="w-full bg-[hsl(var(--deal-badge))] hover:bg-[hsl(var(--deal-badge))]/90 text-white"
              disabled={!product.inStock}
              aria-label={product.inStock ? "Add to cart" : "Out of stock"}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button 
              onClick={handleBuyNow} 
              size="lg" 
              variant="outline" 
              className="w-full"
              disabled={!product.inStock}
              aria-label={product.inStock ? "Buy now" : "Out of stock"}
            >
              <Zap className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
          </div>

          <WishlistButton
            productId={product.id}
            productName={product.name}
            size="lg"
          />

          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Voice commands:</strong></p>
            <p>• "Add to cart" - Add this item</p>
            <p>• "Buy now" - Go directly to checkout</p>
            <p>• "Ask assistant" - Get help with questions</p>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />
      
      {product && (
        <ProductAssistant 
          product={product} 
          open={assistantOpen} 
          onOpenChange={setAssistantOpen}
        />
      )}
    </main>
  );
}
