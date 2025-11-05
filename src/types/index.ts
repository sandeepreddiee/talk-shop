export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  prime?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: string;
}

export interface UserPreferences {
  highContrast: boolean;
  textSize: 'small' | 'medium' | 'large' | 'xl';
  voiceVerbosity: 'short' | 'detailed';
  voiceFirstMode: boolean;
}

export interface VoiceCommand {
  intent: string;
  confidence: number;
  parameters?: Record<string, any>;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
