import { VoiceCommand } from '@/types';

interface CommandPattern {
  patterns: RegExp[];
  intent: string;
  extractParams?: (match: RegExpMatchArray) => Record<string, any>;
}

const commandPatterns: CommandPattern[] = [
  {
    patterns: [/go home|go to home|open home|home page/i],
    intent: 'NAVIGATE_HOME'
  },
  {
    patterns: [/open cart|go to cart|show cart|view cart/i],
    intent: 'NAVIGATE_CART'
  },
  {
    patterns: [/open orders|go to orders|show orders|my orders/i],
    intent: 'NAVIGATE_ORDERS'
  },
  {
    patterns: [/open account|account settings|preferences|settings/i],
    intent: 'NAVIGATE_ACCOUNT'
  },
  {
    patterns: [/search for (.+)|find (.+)|look for (.+)/i],
    intent: 'SEARCH',
    extractParams: (match) => ({ query: match[1] || match[2] || match[3] })
  },
  {
    patterns: [/next product|next item/i],
    intent: 'NEXT_PRODUCT'
  },
  {
    patterns: [/previous product|previous item|back/i],
    intent: 'PREVIOUS_PRODUCT'
  },
  {
    patterns: [/read (?:this )?product|describe (?:this )?product/i],
    intent: 'READ_PRODUCT'
  },
  {
    patterns: [/add to cart|add item|put in cart/i],
    intent: 'ADD_TO_CART'
  },
  {
    patterns: [/buy now|purchase now|buy it now/i],
    intent: 'BUY_NOW'
  },
  {
    patterns: [/open details|show details|product details/i],
    intent: 'OPEN_DETAILS'
  },
  {
    patterns: [/read page|read this page|what's on this page/i],
    intent: 'READ_PAGE'
  },
  {
    patterns: [/summarize|summarize page|summarize this/i],
    intent: 'SUMMARIZE_PAGE'
  },
  {
    patterns: [/what can i say|help|show commands|voice commands/i],
    intent: 'SHOW_HELP'
  },
  {
    patterns: [/proceed to checkout|go to checkout|checkout/i],
    intent: 'CHECKOUT'
  },
  {
    patterns: [/confirm order|place order|complete order/i],
    intent: 'CONFIRM_ORDER'
  },
  {
    patterns: [/change quantity to (\d+)|set quantity (\d+)|quantity (\d+)/i],
    intent: 'CHANGE_QUANTITY',
    extractParams: (match) => ({ quantity: parseInt(match[1] || match[2] || match[3]) })
  },
  {
    patterns: [/remove (?:this )?item|delete (?:this )?item/i],
    intent: 'REMOVE_ITEM'
  },
  {
    patterns: [/(?:turn on|enable) high contrast/i],
    intent: 'ENABLE_HIGH_CONTRAST'
  },
  {
    patterns: [/(?:turn off|disable) high contrast/i],
    intent: 'DISABLE_HIGH_CONTRAST'
  },
  {
    patterns: [/increase text size|make text larger|bigger text/i],
    intent: 'INCREASE_TEXT_SIZE'
  },
  {
    patterns: [/decrease text size|make text smaller|smaller text/i],
    intent: 'DECREASE_TEXT_SIZE'
  },
  {
    patterns: [/sign out|log out|logout/i],
    intent: 'SIGN_OUT'
  }
];

export const voiceCommandParser = {
  parse: (transcript: string): VoiceCommand | null => {
    const cleaned = transcript.trim();
    
    for (const pattern of commandPatterns) {
      for (const regex of pattern.patterns) {
        const match = cleaned.match(regex);
        if (match) {
          return {
            intent: pattern.intent,
            confidence: 0.9,
            parameters: pattern.extractParams ? pattern.extractParams(match) : {}
          };
        }
      }
    }
    
    return null;
  },

  getCommandList: (): Array<{ intent: string; examples: string[] }> => {
    return [
      {
        intent: 'Navigation',
        examples: ['Go home', 'Open cart', 'Show orders', 'Open account']
      },
      {
        intent: 'Search',
        examples: ['Search for headphones', 'Find phone cases', 'Look for keyboards']
      },
      {
        intent: 'Product Actions',
        examples: ['Add to cart', 'Buy now', 'Next product', 'Previous product', 'Read product']
      },
      {
        intent: 'Page Reading',
        examples: ['Read page', 'Summarize page', 'What can I say']
      },
      {
        intent: 'Cart & Checkout',
        examples: ['Proceed to checkout', 'Remove item', 'Change quantity to 2']
      },
      {
        intent: 'Preferences',
        examples: ['Turn on high contrast', 'Increase text size']
      }
    ];
  }
};
