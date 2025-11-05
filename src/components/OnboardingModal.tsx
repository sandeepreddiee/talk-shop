import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, Keyboard, Volume2 } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal = ({ isOpen, onComplete }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to AccessShop',
      description: 'This store is designed for everyone, with voice-first accessibility built in.',
      icon: <Volume2 className="h-12 w-12 text-primary mx-auto mb-4" />
    },
    {
      title: 'Voice Commands',
      description: 'Press Ctrl+V anywhere to start voice input. Say commands like "Search for headphones" or "Go to cart".',
      icon: <Mic className="h-12 w-12 text-primary mx-auto mb-4" />
    },
    {
      title: 'Keyboard Navigation',
      description: 'Everything is keyboard accessible. Press Tab to navigate, Enter to activate, and ? for help.',
      icon: <Keyboard className="h-12 w-12 text-primary mx-auto mb-4" />
    },
    {
      title: 'Screen Reader Support',
      description: 'All features work seamlessly with screen readers. Navigate by landmarks, hear announcements, and enjoy full accessibility.',
      icon: <Volume2 className="h-12 w-12 text-primary mx-auto mb-4" />
    }
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" aria-describedby="onboarding-description">
        <DialogHeader>
          <DialogTitle>{currentStep.title}</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          {currentStep.icon}
          <DialogDescription id="onboarding-description" className="text-base">
            {currentStep.description}
          </DialogDescription>
        </div>
        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  idx === step ? 'bg-primary' : 'bg-muted'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="flex gap-2">
            {!isLastStep && (
              <Button variant="ghost" onClick={onComplete}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>
              {isLastStep ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
