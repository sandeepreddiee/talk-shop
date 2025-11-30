import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceButton } from './VoiceButton';
import { useCartStore } from '@/stores/useCartStore';
import { useVoiceStore } from '@/stores/useVoiceStore';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeaderProps {
  onVoiceToggle: () => void;
}

export const Header = ({ onVoiceToggle }: HeaderProps) => {
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.itemCount);
  const isListening = useVoiceStore((state) => state.isListening);
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['Audio', 'Wearables', 'Accessories', 'Gaming', 'Video', 'Power'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/s/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background" role="banner">
      <div className="container flex h-16 items-center gap-4 px-4">
        <Link
          to="/"
          className="flex items-center space-x-2 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          aria-label="AccessShop Home"
        >
          <Package className="h-6 w-6" aria-hidden="true" />
          <span>AccessShop</span>
        </Link>

        <Select>
          <SelectTrigger
            className="w-[150px]"
            aria-label="Select product category"
          >
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <form onSubmit={handleSearch} className="flex-1 flex gap-2" role="search">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            aria-label="Search products"
          />
          <VoiceButton
            isListening={isListening}
            onClick={onVoiceToggle}
            variant="outline"
          />
          <Button type="submit" size="icon" aria-label="Search">
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </form>

        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/orders')}
            aria-label="Orders"
          >
            <span className="hidden sm:inline">Orders</span>
            <Package className="h-5 w-5 sm:ml-2" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/account')}
            aria-label="Account"
          >
            <span className="hidden sm:inline">Account</span>
            <User className="h-5 w-5 sm:ml-2" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cart')}
            className="relative"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                aria-hidden="true"
              >
                {itemCount}
              </span>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
};
