import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SkipToContentLink } from "./components/SkipToContentLink";
import { MicStatusPill } from "./components/MicStatusPill";
import { HelpOverlay } from "./components/HelpOverlay";
import { AssistantPanel } from "./components/AssistantPanel";
import { LiveRegion } from "./components/LiveRegion";
import { OnboardingModal } from "./components/OnboardingModal";
import { KeyboardShortcutsPanel } from "./components/KeyboardShortcutsPanel";
import { useVoiceStore } from "./stores/useVoiceStore";
import { useCartStore } from "./stores/useCartStore";
import { useWishlistStore } from "./stores/useWishlistStore";
import { useAuthStore } from "./stores/useAuthStore";
import { speechService } from "./services/speechService";
import { voiceCommandParser } from "./services/voiceCommands";
import { shortcutManager } from "./services/shortcutManager";
import { useVoiceCommands } from "./hooks/useVoiceCommands";
import { usePreferenceEffects } from "./hooks/usePreferenceEffects";
import { useState, useEffect, useCallback } from "react";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import AccessibilityMetrics from "./pages/AccessibilityMetrics";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/AuthGuard";
import { DemoMode } from "./components/DemoMode";
import { useRealtimeOrders } from "./hooks/useRealtimeOrders";
import { useRealtimeCart } from "./hooks/useRealtimeCart";
import { supabase } from "./integrations/supabase/client";
import VoiceInterface from "./components/VoiceInterface";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const { setAssistantOpen } = useVoiceStore();
  const itemCount = useCartStore((state) => state.itemCount);
  const loadCart = useCartStore(state => state.loadCart);
  const loadWishlist = useWishlistStore(state => state.loadWishlist);
  const { user, setUser, setSession } = useAuthStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [triggerVoice, setTriggerVoice] = useState<number>(0);
  
  usePreferenceEffects();
  useRealtimeOrders();
  useRealtimeCart();

  // Initialize auth session
  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Load user data when authenticated
      if (session?.user) {
        setTimeout(() => {
          loadCart();
          loadWishlist();
        }, 0);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadCart();
        loadWishlist();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      // Don't auto-speak on mount - let user interact first
    }
  }, []);

  // Stop speech on any click
  useEffect(() => {
    const handleClick = () => {
      speechService.stopSpeaking();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  // CRITICAL: Ctrl+V handler with maximum priority
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Log EVERY keypress for debugging
      if (e.ctrlKey || e.metaKey) {
        console.log('🔑 Modifier + Key:', e.key, {
          ctrl: e.ctrlKey,
          meta: e.metaKey,
          shift: e.shiftKey,
          key: e.key,
          code: e.code
        });
      }
      
      // Check for Ctrl+V or Cmd+V
      const isCtrlV = (e.ctrlKey || e.metaKey) && 
                      (e.key === 'v' || e.key === 'V' || e.code === 'KeyV') &&
                      !e.shiftKey && 
                      !e.altKey;
      
      if (isCtrlV) {
        console.log('🎯 CTRL+V DETECTED!');
        
        const target = e.target as HTMLElement;
        const isEditable = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.isContentEditable ||
                          target.getAttribute('contenteditable') === 'true';
        
        console.log('📍 Target:', target.tagName, 'Editable:', isEditable);
        
        if (!isEditable) {
          console.log('✅ NOT in editable field - TRIGGERING VOICE');
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          setTriggerVoice(prev => {
            const newValue = Date.now(); // Use timestamp to ensure it always changes
            console.log('🚀 TRIGGER VOICE - Previous:', prev, 'New:', newValue);
            return newValue;
          });
        } else {
          console.log('⏭️ In editable field - allowing default paste');
        }
      }
    };

    console.log('🎧 Installing Ctrl+V listener');
    // Use capture phase and highest priority
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    
    return () => {
      console.log('🎧 Removing Ctrl+V listener');
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);

  useEffect(() => {
    shortcutManager.register({
      key: 'k',
      ctrl: true,
      handler: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: 'Focus search'
    });

    shortcutManager.register({
      key: 's',
      ctrl: true,
      shift: true,
      handler: () => setShowShortcuts(!showShortcuts),
      description: 'Toggle shortcuts panel'
    });

    return () => {
      shortcutManager.destroy();
    };
  }, [showShortcuts]);

  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContentLink />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/s/:query" element={<Search />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<AuthGuard><Cart /></AuthGuard>} />
        <Route path="/checkout" element={<AuthGuard><Checkout /></AuthGuard>} />
        <Route path="/order-confirmation/:orderId" element={<AuthGuard><OrderConfirmation /></AuthGuard>} />
        <Route path="/orders" element={<AuthGuard><Orders /></AuthGuard>} />
        <Route path="/account" element={<AuthGuard><Account /></AuthGuard>} />
        <Route path="/wishlist" element={<AuthGuard><Wishlist /></AuthGuard>} />
        <Route path="/metrics" element={<AuthGuard><AccessibilityMetrics /></AuthGuard>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <DemoMode />
      {showShortcuts && <KeyboardShortcutsPanel />}
      <Footer />
      <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
      <VoiceInterface onSpeakingChange={setIsAISpeaking} trigger={triggerVoice} />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
