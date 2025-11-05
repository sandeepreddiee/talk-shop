import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { productService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/RatingStars';
import { useCartStore } from '@/stores/useCartStore';
import { useVoiceStore } from '@/stores/useVoiceStore';
import { speechService } from '@/services/speechService';
import { AssistantPanel } from '@/components/AssistantPanel';
import { toast } from 'sonner';
import { ShoppingCart, Zap, MessageCircle } from 'lucide-react';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = productService.getProductById(id || '');
  const addItem = useCartStore((state) => state.addItem);
  const { isAssistantOpen, setAssistantOpen } = useVoiceStore();

  useEffect(() => {
    if (product) {
      speechService.speak(`Product page. ${product.name}. Price: $${product.price}. Rating: ${product.rating} stars. Say add to cart, buy now, or press Ctrl V to ask assistant for help.`);
    }
  }, [product]);

  if (!product) {
    return <div className="container py-8">Product not found</div>;
  }

  const handleAddToCart = async () => {
    addItem(product.id);
    toast.success('Added to cart');
    await speechService.speak('Added to cart');
  };

  const handleBuyNow = async () => {
    addItem(product.id);
    await speechService.speak('Taking you to checkout');
    navigate('/checkout');
  };

  const handleAskAssistant = () => {
    setAssistantOpen(true);
  };

  const handleListenDescription = async () => {
    await speechService.speak(`${product.name}. Price: ${product.price} dollars. ${product.description}. Key features: ${product.features.join('. ')}`);
  };

  return (
    <main id="main-content" className="container py-8 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full rounded-lg"
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
          
          <div className="flex gap-4">
            <Button onClick={handleAddToCart} size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button onClick={handleBuyNow} size="lg" variant="secondary" className="flex-1">
              <Zap className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
          </div>

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
          product,
          page: 'product'
        }}
        autoStartVoice={true}
      />
    </main>
  );
}
