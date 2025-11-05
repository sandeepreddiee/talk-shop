import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SkipToContentLink } from "./components/SkipToContentLink";
import { MicStatusPill } from "./components/MicStatusPill";
import { HelpOverlay } from "./components/HelpOverlay";
import { AssistantPanel } from "./components/AssistantPanel";
import { LiveRegion } from "./components/LiveRegion";
import { useVoiceStore } from "./stores/useVoiceStore";
import { speechService } from "./services/speechService";
import { voiceCommandParser } from "./services/voiceCommands";
import { shortcutManager } from "./services/shortcutManager";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  const { isListening, setListening, isAssistantOpen, setAssistantOpen } = useVoiceStore();
  const [liveMessage, setLiveMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const handleVoiceToggle = async () => {
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
          setLiveMessage(`Command: ${command.intent}`);
          if (command.intent === 'NAVIGATE_HOME') navigate('/');
          else if (command.intent === 'NAVIGATE_CART') navigate('/cart');
          else if (command.intent === 'SEARCH' && command.parameters?.query) {
            navigate(`/s/${encodeURIComponent(command.parameters.query)}`);
          }
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

    return () => shortcutManager.destroy();
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
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account/preferences" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <AssistantPanel isOpen={isAssistantOpen} onClose={() => setAssistantOpen(false)} />
      <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
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
