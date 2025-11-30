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
import { useVoiceStore } from "./stores/useVoiceStore";
import { useCartStore } from "./stores/useCartStore";
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
import AccessibilityMetrics from "./pages/AccessibilityMetrics";
import NotFound from "./pages/NotFound";
import { AuthGuard } from "./components/AuthGuard";
import { DemoMode } from "./components/DemoMode";
import { useRealtimeOrders } from "./hooks/useRealtimeOrders";
import { useRealtimeCart } from "./hooks/useRealtimeCart";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const { isListening, setListening, isAssistantOpen, setAssistantOpen } = useVoiceStore();
  const itemCount = useCartStore((state) => state.itemCount);
  const [liveMessage, setLiveMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const { executeCommand } = useVoiceCommands(setLiveMessage, setShowHelp);
  const loadCart = useCartStore(state => state.loadCart);
  usePreferenceEffects();
  useRealtimeOrders();
  useRealtimeCart();

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
      speechService.speak('Welcome to AccessShop, your voice-first accessible shopping experience');
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleVoiceToggle = async () => {
    // Stop any ongoing speech first
    speechService.stopSpeaking();
    
    if (isListening) {
      speechService.stopListening();
      setListening(false);
    } else {
      try {
        setListening(true);
        const transcript = await speechService.startListening();
        setListening(false);
        
        const command = voiceCommandParser.parse(transcript);
        if (command) {
          await executeCommand(command);
        } else {
          setLiveMessage('Command not recognized');
          await speechService.speak('Command not recognized. Say what can I say for help');
        }
      } catch (error) {
        setListening(false);
      }
    }
  };

  useEffect(() => {
    shortcutManager.register({
      key: 'v',
      ctrl: true,
      handler: handleVoiceToggle,
      description: 'Toggle voice input'
    });

    shortcutManager.register({
      key: 'v',
      ctrl: true,
      shift: true,
      handler: handleVoiceToggle,
      description: 'Force toggle voice input'
    });

    shortcutManager.register({
      key: '?',
      handler: () => setShowHelp(true),
      description: 'Show help'
    });

    return () => {
      shortcutManager.destroy();
    };
  }, [isListening]);

  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContentLink />
      <Header onVoiceToggle={handleVoiceToggle} />
      <MicStatusPill />
      <LiveRegion message={liveMessage} />
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
        <Route path="/metrics" element={<AuthGuard><AccessibilityMetrics /></AuthGuard>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <DemoMode />
      <Footer />
      <AssistantPanel 
        isOpen={isAssistantOpen} 
        onClose={() => setAssistantOpen(false)}
        context={{
          page: location.pathname,
          cartCount: itemCount
        }}
      />
      <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
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
