import { AssistantMessage } from '@/types';
import { productService } from './productService';

type AssistantIntent = 'PRODUCT_COMPARISON' | 'REVIEW_SUMMARY' | 'GENERAL_QUESTION' | 'PRODUCT_RECOMMENDATION';

interface AssistantResponse {
  intent: AssistantIntent;
  response: string;
}

const detectIntent = (query: string): AssistantIntent => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('difference')) {
    return 'PRODUCT_COMPARISON';
  }
  
  if (lowerQuery.includes('review') || lowerQuery.includes('opinion') || lowerQuery.includes('rating')) {
    return 'REVIEW_SUMMARY';
  }
  
  if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest') || lowerQuery.includes('best')) {
    return 'PRODUCT_RECOMMENDATION';
  }
  
  return 'GENERAL_QUESTION';
};

const generateResponse = (query: string, intent: AssistantIntent, context?: any): string => {
  switch (intent) {
    case 'PRODUCT_COMPARISON':
      return `Based on the products you're looking at, here's what I can tell you: The main differences are in features, price points, and customer ratings. The higher-priced option typically offers more advanced features and longer warranty coverage. Would you like me to focus on any specific aspect?`;
      
    case 'REVIEW_SUMMARY':
      if (context?.productId) {
        return `This product has excellent reviews overall. Customers particularly praise the quality and value for money. The most common positive feedback mentions durability and performance. A few reviewers noted minor issues with packaging, but overall satisfaction is very high at 4.5 stars.`;
      }
      return `I can help you understand customer reviews. Which product would you like me to summarize?`;
      
    case 'PRODUCT_RECOMMENDATION':
      const products = productService.getAllProducts().slice(0, 3);
      return `Based on your query, I'd recommend checking out these top-rated products: ${products.map(p => p.name).join(', ')}. They all have excellent ratings and are currently in stock. Would you like more details on any of these?`;
      
    case 'GENERAL_QUESTION':
    default:
      return `I'm here to help you shop! I can compare products, summarize reviews, provide recommendations, and answer questions about items. What would you like to know?`;
  }
};

export const assistantService = {
  processQuery: (query: string, context?: any): Promise<AssistantResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const intent = detectIntent(query);
        const response = generateResponse(query, intent, context);
        resolve({ intent, response });
      }, 800);
    });
  },

  getQuickActions: (context?: any): string[] => {
    if (context?.productId) {
      return [
        'Describe this product in detail',
        'Summarize customer reviews',
        'Compare with similar products',
        'What are the main features?',
        'Is this a good deal?'
      ];
    }
    
    return [
      'Show me today\'s deals',
      'What\'s popular in electronics?',
      'Help me find a gift',
      'Show highly rated products',
      'What can I say?'
    ];
  }
};
