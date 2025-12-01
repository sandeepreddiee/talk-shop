import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Package, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { speechService } from '@/services/speechService';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Header = () => {
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.itemCount);
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['Audio', 'Wearables', 'Accessories', 'Gaming', 'Video', 'Power'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/s/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success('Signed out successfully');
      speechService.speak('Signed out successfully');
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[hsl(var(--header-bg))] text-white shadow-md" role="banner">
      <div className="container flex h-16 items-center gap-3 px-4">
        <Link
          to="/"
          className="flex items-center space-x-2 font-bold text-2xl hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 transition-colors"
          aria-label="AccessShop Home"
        >
          <Package className="h-8 w-8" aria-hidden="true" />
          <span className="hidden sm:inline">AccessShop</span>
        </Link>

        <Select>
          <SelectTrigger
            className="w-[120px] bg-white text-foreground border-0 h-10"
            aria-label="Select product category"
          >
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <form onSubmit={handleSearch} className="flex-1 flex" role="search">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-r-none h-10 border-0"
            aria-label="Search products"
          />
          <Button type="submit" size="icon" className="rounded-l-none h-10 bg-primary hover:bg-primary/90" aria-label="Search">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </form>

        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/wishlist')}
                className="text-white hover:bg-[hsl(var(--header-hover))] hover:text-white flex flex-col items-center h-auto py-1 px-3"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs font-normal">Wishlist</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/orders')}
                className="text-white hover:bg-[hsl(var(--header-hover))] hover:text-white flex flex-col items-center h-auto py-1 px-3"
                aria-label="Orders"
              >
                <Package className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs font-normal">Orders</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/account')}
                className="text-white hover:bg-[hsl(var(--header-hover))] hover:text-white flex flex-col items-center h-auto py-1 px-3"
                aria-label="Account"
              >
                <User className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs font-normal">Account</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cart')}
                className="text-white hover:bg-[hsl(var(--header-hover))] hover:text-white relative flex items-center gap-2 h-auto py-1 px-3"
                aria-label={`Cart, ${itemCount} items`}
              >
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                  {itemCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-normal hidden sm:inline">Cart</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-[hsl(var(--header-hover))] hover:text-white ml-2"
                aria-label="Sign out"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/login')}
                className="text-white hover:bg-[hsl(var(--header-hover))] hover:text-white"
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/signup')}
                className="bg-primary hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};