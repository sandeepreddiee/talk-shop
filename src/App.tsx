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
import { useState, useEffect } from "react";
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
      <VoiceInterface onSpeakingChange={setIsAISpeaking} />
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
