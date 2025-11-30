import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService } from '@/services/database/productService';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/RatingStars';
import { useCartStore } from '@/stores/useCartStore';
import { useVoiceStore } from '@/stores/useVoiceStore';
import { speechService } from '@/services/speechService';
import { AssistantPanel } from '@/components/AssistantPanel';
import { WishlistButton } from '@/components/WishlistButton';
import { toast } from 'sonner';
import { ShoppingCart, Zap, MessageCircle } from 'lucide-react';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { activityService } from '@/services/activityService';
import { playSuccessSound, playErrorSound } from '@/components/AudioFeedback';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const { isAssistantOpen, setAssistantOpen } = useVoiceStore();

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
    activityService.logActivity('open_assistant', { context: 'product', productId: product?.id });
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

          <div className="flex gap-2">
            <Button 
              onClick={handleListenDescription} 
              variant="outline"
              className="flex-1"
              aria-label="Listen to product description"
            >
              Listen to Description
            </Button>
            <Button 
              onClick={handleAskAssistant}
              variant="outline"
              className="flex-1"
              aria-label="Ask assistant about this product"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Ask Assistant
            </Button>
          </div>
          
          <div>
            <Button 
              onClick={handleAddToCart} 
              size="lg" 
              className="flex-1"
              disabled={!product.inStock}
              aria-label={product.inStock ? "Add to cart" : "Out of stock"}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button 
              onClick={handleBuyNow} 
              size="lg" 
              variant="secondary" 
              className="flex-1"
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

      <AssistantPanel 
        isOpen={isAssistantOpen} 
        onClose={() => setAssistantOpen(false)}
        context={{
          product: product ? {
            id: product.id,
            name: product.name,
            price: product.price,
            rating: product.rating,
            reviewCount: product.reviewCount,
            category: product.category,
            description: product.description,
            features: product.features,
            inStock: product.inStock,
            image: product.image
          } : undefined,
          page: 'product'
        }}
      />
    </main>
  );
}
