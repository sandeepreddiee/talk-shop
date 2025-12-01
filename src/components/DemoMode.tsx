import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Play, X, Volume2, Mic, Eye, Keyboard } from 'lucide-react';
import { speechService } from '@/services/speechService';
import { useNavigate } from 'react-router-dom';

interface DemoStep {
  title: string;
  description: string;
  speech: string;
  action?: () => void;
  icon: any;
}

export const DemoMode = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const demoSteps: DemoStep[] = [
    {
      title: 'Welcome to AccessShop',
      description: 'A voice-first, accessibility-focused e-commerce platform',
      speech: 'Welcome to AccessShop! This is a demonstration of how our platform helps blind and visually impaired users shop independently using voice commands and accessibility features.',
      icon: Volume2
    },
    {
      title: 'Voice Commands',
      description: 'Control the entire application with your voice',
      speech: 'You can control the entire application using voice commands. Press Control plus V to start voice input, then say commands like "go to cart", "search for headphones", or "read this page".',
      icon: Mic
    },
    {
      title: 'Keyboard Shortcuts',
      description: 'Fast navigation without a mouse',
      speech: 'We provide keyboard shortcuts for efficient navigation. Press question mark to see all available shortcuts. Control V activates voice input, and you can navigate using standard keyboard controls.',
      icon: Keyboard
    },
    {
      title: 'Screen Reader Support',
      description: 'Optimized for screen readers like JAWS and NVDA',
      speech: 'Every element has proper ARIA labels and semantic HTML for perfect screen reader compatibility. Live regions announce changes automatically, and all interactive elements are keyboard accessible.',
      icon: Eye
    },
    {
      title: 'Real-time Features',
      description: 'Live updates for orders and inventory',
      speech: 'Orders update in real-time, so you always know the latest status. When items go out of stock, you are notified immediately. The shopping experience is fully synchronized across devices.',
      action: () => navigate('/orders'),
      icon: Play
    },
    {
      title: 'Accessibility Preferences',
      description: 'Customize the experience to your needs',
      speech: 'You can customize high contrast mode, text size, voice verbosity, and more in the accessibility preferences. The site remembers your preferences for future visits.',
      action: () => navigate('/account'),
      icon: Eye
    }
  ];

  useEffect(() => {
    if (isActive && !isPaused) {
      const step = demoSteps[currentStep];
      
      const speak = async () => {
        await speechService.speak(step.speech);
        
        if (step.action) {
          setTimeout(() => step.action?.(), 1000);
        }

        setTimeout(() => {
          if (currentStep < demoSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
          } else {
            setIsActive(false);
            setCurrentStep(0);
            speechService.speak('Demo completed. Thank you for watching!');
          }
        }, 3000);
      };

      speak();
    }
  }, [isActive, currentStep, isPaused]);

  const startDemo = () => {
    setIsActive(true);
    setCurrentStep(0);
    setIsPaused(false);
  };

  const stopDemo = () => {
    setIsActive(false);
    setCurrentStep(0);
    speechService.stopSpeaking();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      speechService.stopSpeaking();
    }
  };

  if (!isActive) {
    return (
      <div className="fixed top-20 left-4 z-40">
        <Button
          onClick={startDemo}
          size="sm"
          className="shadow-lg rounded-full"
          aria-label="Start demo mode"
        >
          <Play className="mr-2 h-4 w-4" />
          Start Demo
        </Button>
      </div>
    );
  }

  const step = demoSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon className="h-12 w-12 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={stopDemo}
            aria-label="Stop demo"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} / {demoSteps.length}
            </span>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-lg leading-relaxed">{step.speech}</p>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={togglePause} variant="outline">
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            {currentStep < demoSteps.length - 1 && (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Skip to Next
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
