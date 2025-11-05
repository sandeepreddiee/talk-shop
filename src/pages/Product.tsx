import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/RatingStars';
import { useCartStore } from '@/stores/useCartStore';
import { toast } from 'sonner';
import { ShoppingCart, Zap } from 'lucide-react';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = productService.getProductById(id || '');
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return <div className="container py-8">Product not found</div>;
  }

  const handleAddToCart = () => {
    addItem(product.id);
    toast.success('Added to cart');
  };

  const handleBuyNow = () => {
    addItem(product.id);
    navigate('/cart');
  };

  return (
    <main id="main-content" className="container py-8 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <RatingStars rating={product.rating} count={product.reviewCount} size="lg" />
          <div className="text-3xl font-bold">${product.price}</div>
          <p className="text-muted-foreground">{product.description}</p>
          <ul className="list-disc list-inside space-y-1">
            {product.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
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
        </div>
      </div>
    </main>
  );
}
