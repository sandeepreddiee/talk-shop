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
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const { isListening, setListening, isAssistantOpen, setAssistantOpen } = useVoiceStore();
  const itemCount = useCartStore((state) => state.itemCount);
  const [liveMessage, setLiveMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const { executeCommand } = useVoiceCommands(setLiveMessage, setShowHelp);
  usePreferenceEffects();

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
    
    // On product page, open assistant for voice interaction
    if (location.pathname.startsWith('/product/')) {
      setAssistantOpen(true);
      return;
    }
    
    if (isListening) {
      speechService.stopListening();
      setListening(false);
      setLiveMessage('Voice input stopped');
    } else {
      try {
        setLiveMessage('Listening...');
        setListening(true);
        
        const transcript = await speechService.startListening();
        setListening(false);
        
        console.log('Voice transcript:', transcript);
        
        if (!transcript || transcript.trim() === '') {
          setLiveMessage('No speech detected');
          await speechService.speak('I did not hear anything. Please try again.');
          return;
        }
        
        const command = voiceCommandParser.parse(transcript);
        if (command) {
          console.log('Parsed command:', command);
          await executeCommand(command);
        } else {
          setLiveMessage(`Command not recognized: "${transcript}"`);
          await speechService.speak('Command not recognized. Say what can I say for help');
        }
      } catch (error) {
        console.error('Voice error:', error);
        setListening(false);
        setLiveMessage('Voice input failed');
        await speechService.speak('Voice input failed. Please try again.');
      }
    }
  };

  useEffect(() => {
    const voiceShortcut = {
      key: 'v',
      ctrl: true,
      handler: handleVoiceToggle,
      description: 'Toggle voice input'
    };

    const forceVoiceShortcut = {
      key: 'v',
      ctrl: true,
      shift: true,
      handler: handleVoiceToggle,
      description: 'Force toggle voice input'
    };

    const helpShortcut = {
      key: '?',
      handler: () => setShowHelp(true),
      description: 'Show help'
    };

    shortcutManager.register(voiceShortcut);
    shortcutManager.register(forceVoiceShortcut);
    shortcutManager.register(helpShortcut);

    return () => {
      shortcutManager.unregister({ key: 'v', ctrl: true });
      shortcutManager.unregister({ key: 'v', ctrl: true, shift: true });
      shortcutManager.unregister({ key: '?' });
    };
  }, [location.pathname, isAssistantOpen, isListening]);

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
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account/preferences" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      {!location.pathname.startsWith('/product/') && (
        <AssistantPanel 
          isOpen={isAssistantOpen} 
          onClose={() => setAssistantOpen(false)}
          context={{
            page: location.pathname,
            cartCount: itemCount
          }}
        />
      )}
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
