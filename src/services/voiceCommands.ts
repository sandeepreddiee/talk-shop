import { VoiceCommand } from '@/types';

interface CommandPattern {
  patterns: RegExp[];
  intent: string;
  extractParams?: (match: RegExpMatchArray) => Record<string, any>;
}

const commandPatterns: CommandPattern[] = [
  {
    patterns: [/go home|go to home|open home|home page|take me home/i],
    intent: 'NAVIGATE_HOME'
  },
  {
    patterns: [/open cart|go to cart|show cart|view cart|shopping cart/i],
    intent: 'NAVIGATE_CART'
  },
  {
    patterns: [/open orders|go to orders|show orders|my orders|order history/i],
    intent: 'NAVIGATE_ORDERS'
  },
  {
    patterns: [/open account|account settings|preferences|settings|my account/i],
    intent: 'NAVIGATE_ACCOUNT'
  },
  {
    patterns: [/open assistant|ask assistant|talk to assistant|help me shop|shopping help|assistant|voice assistant/i],
    intent: 'OPEN_ASSISTANT'
  },
  {
    patterns: [/search for (.+)|find (.+)|look for (.+)|show me (.+)/i],
    intent: 'SEARCH',
    extractParams: (match) => ({ query: match[1] || match[2] || match[3] || match[4] })
  },
  {
    patterns: [/next product|next item|next one/i],
    intent: 'NEXT_PRODUCT'
  },
  {
    patterns: [/previous product|previous item|back|go back/i],
    intent: 'PREVIOUS_PRODUCT'
  },
  {
    patterns: [/read (?:this )?product|describe (?:this )?product|tell me about this|product details/i],
    intent: 'READ_PRODUCT'
  },
  {
    patterns: [/add to cart|add (?:this )?(?:to )?(?:my )?cart|add (?:this )?item|put (?:this )?in (?:my )?cart|add (?:this )?product/i],
    intent: 'ADD_TO_CART'
  },
  {
    patterns: [/buy now|purchase now|buy it now|buy this/i],
    intent: 'BUY_NOW'
  },
  {
    patterns: [/read page|read this page|what's on this page|describe this page/i],
    intent: 'READ_PAGE'
  },
  {
    patterns: [/what can i say|help|show commands|voice commands|what commands|list commands|available commands|show me commands|command list/i],
    intent: 'SHOW_HELP'
  },
  {
    patterns: [/proceed to checkout|go to checkout|checkout|check out/i],
    intent: 'CHECKOUT'
  },
  {
    patterns: [/confirm order|place order|complete order|finish order/i],
    intent: 'CONFIRM_ORDER'
  },
  {
    patterns: [/change quantity to (\d+)|set quantity (\d+)|quantity (\d+)|make it (\d+)/i],
    intent: 'CHANGE_QUANTITY',
    extractParams: (match) => ({ quantity: parseInt(match[1] || match[2] || match[3] || match[4]) })
  },
  {
    patterns: [/remove (?:this )?item|delete (?:this )?item|remove (?:this )?product/i],
    intent: 'REMOVE_ITEM'
  },
  {
    patterns: [/(?:turn on|enable) high contrast|high contrast on/i],
    intent: 'ENABLE_HIGH_CONTRAST'
  },
  {
    patterns: [/(?:turn off|disable) high contrast|high contrast off/i],
    intent: 'DISABLE_HIGH_CONTRAST'
  },
  {
    patterns: [/increase text size|make text larger|bigger text|text bigger/i],
    intent: 'INCREASE_TEXT_SIZE'
  },
  {
    patterns: [/decrease text size|make text smaller|smaller text|text smaller/i],
    intent: 'DECREASE_TEXT_SIZE'
  },
  {
    patterns: [/login with pin (\d{6})|pin login (\d{6})|use pin (\d{6})/i],
    intent: 'PIN_LOGIN',
    extractParams: (match) => ({ pin: match[1] || match[2] || match[3] })
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
