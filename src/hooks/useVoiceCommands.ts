import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { speechService } from '@/services/speechService';
import { voiceCommandParser } from '@/services/voiceCommands';
import { useVoiceStore } from '@/stores/useVoiceStore';
import { useCartStore } from '@/stores/useCartStore';
import { usePreferenceStore } from '@/stores/usePreferenceStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

export const useVoiceCommands = (setLiveMessage: (msg: string) => void, setShowHelp: (show: boolean) => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAssistantOpen } = useVoiceStore();
  const { addItem } = useCartStore();
  const { updatePreference, textSize } = usePreferenceStore();
  const { logout } = useAuthStore();

  const executeCommand = useCallback(async (command: any) => {
    const intent = command.intent;
    setLiveMessage(`Executing: ${intent}`);

    switch (intent) {
      case 'NAVIGATE_HOME':
        navigate('/');
        await speechService.speak('Going to home page');
        break;

      case 'NAVIGATE_CART':
        navigate('/cart');
        await speechService.speak('Opening shopping cart');
        break;

      case 'NAVIGATE_ORDERS':
        navigate('/orders');
        await speechService.speak('Opening your orders');
        break;

      case 'NAVIGATE_ACCOUNT':
        navigate('/account/preferences');
        await speechService.speak('Opening account preferences');
        break;

      case 'OPEN_ASSISTANT':
        setAssistantOpen(true);
        await speechService.speak('Opening shopping assistant');
        break;

      case 'SEARCH':
        if (command.parameters?.query) {
          navigate(`/s/${encodeURIComponent(command.parameters.query)}`);
          await speechService.speak(`Searching for ${command.parameters.query}`);
        }
        break;

      case 'ADD_TO_CART':
        const productMatch = location.pathname.match(/\/product\/(.+)/);
        if (productMatch) {
          addItem(productMatch[1]);
          toast.success('Added to cart');
          await speechService.speak('Item added to your shopping cart');
        } else {
          await speechService.speak('Please open a product page first');
        }
        break;

      case 'BUY_NOW':
        const buyProductMatch = location.pathname.match(/\/product\/(.+)/);
        if (buyProductMatch) {
          addItem(buyProductMatch[1]);
          navigate('/checkout');
          await speechService.speak('Added to cart. Taking you to checkout');
        } else {
          await speechService.speak('Please open a product page first');
        }
        break;

      case 'CHECKOUT':
        if (location.pathname === '/cart') {
          navigate('/checkout');
          await speechService.speak('Proceeding to checkout');
        } else {
          navigate('/cart');
          await speechService.speak('Opening your cart. Say checkout to proceed.');
        }
        break;

      case 'CONFIRM_ORDER':
        if (location.pathname === '/checkout') {
          await speechService.speak('Please fill in your address and press Place Order');
        } else {
          await speechService.speak('Please go to checkout first');
        }
        break;

      case 'READ_PAGE':
        await speechService.speak(getPageDescription());
        break;

      case 'READ_PRODUCT':
        const readProductMatch = location.pathname.match(/\/product\/(.+)/);
        if (readProductMatch) {
          await speechService.speak('Reading product details. Ask me questions or say add to cart');
        } else {
          await speechService.speak('Not on a product page');
        }
        break;

      case 'NEXT_PRODUCT':
        await speechService.speak('Use tab key to navigate to next product');
        break;

      case 'PREVIOUS_PRODUCT':
        await speechService.speak('Use shift tab to go back');
        break;

      case 'SHOW_HELP':
        setShowHelp(true);
        await speechService.speak('Opening help and commands');
        break;

      case 'ENABLE_HIGH_CONTRAST':
        updatePreference('highContrast', true);
        toast.success('High contrast enabled');
        await speechService.speak('High contrast mode enabled');
        break;

      case 'DISABLE_HIGH_CONTRAST':
        updatePreference('highContrast', false);
        toast.success('High contrast disabled');
        await speechService.speak('High contrast mode disabled');
        break;

      case 'INCREASE_TEXT_SIZE':
        const sizes = ['small', 'medium', 'large', 'xl'];
        const currentIndex = sizes.indexOf(textSize);
        if (currentIndex < sizes.length - 1) {
          updatePreference('textSize', sizes[currentIndex + 1]);
          toast.success('Text size increased');
          await speechService.speak('Text size increased');
        }
        break;

      case 'DECREASE_TEXT_SIZE':
        const sizesDown = ['small', 'medium', 'large', 'xl'];
        const currentIndexDown = sizesDown.indexOf(textSize);
        if (currentIndexDown > 0) {
          updatePreference('textSize', sizesDown[currentIndexDown - 1]);
          toast.success('Text size decreased');
          await speechService.speak('Text size decreased');
        }
        break;

      case 'SIGN_OUT':
        logout();
        navigate('/login');
        toast.success('Signed out');
        await speechService.speak('You have been signed out');
        break;

      default:
        await speechService.speak('Command not recognized. Say what can I say for help');
    }
  }, [navigate, location, setLiveMessage, setShowHelp, addItem, updatePreference, textSize, logout, setAssistantOpen]);

  const getPageDescription = () => {
    const path = location.pathname;
    if (path === '/') return 'You are on the home page. Browse featured products or search for items.';
    if (path.startsWith('/s/')) return 'You are viewing search results. Navigate through products using tab.';
    if (path.startsWith('/product/')) return 'You are on a product detail page. You can add to cart or buy now.';
    if (path === '/cart') return 'You are in your shopping cart. Review items and proceed to checkout.';
    if (path === '/checkout') return 'You are on the checkout page. Enter your shipping address to complete the order.';
    if (path === '/orders') return 'You are viewing your order history.';
    if (path === '/account/preferences') return 'You are in accessibility preferences. Adjust display and voice settings.';
    return 'You are on the AccessShop website.';
  };

  return { executeCommand };
};
