import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { speechService } from '@/services/speechService';
import { toast } from 'sonner';

interface VoiceAddressInputProps {
  onAddressCapture: (address: string, city: string, zipCode: string) => void;
}

export const VoiceAddressInput = ({ onAddressCapture }: VoiceAddressInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseAddress = (spokenText: string): { address: string; city: string; zipCode: string } | null => {
    // Clean up the text
    const cleaned = spokenText.trim().toLowerCase();
    
    // Try to extract ZIP code (5 digits, possibly spoken as individual digits)
    const zipPatterns = [
      /\b(\d{5})\b/,  // Standard 5-digit
      /zip\s*(?:code)?\s*(\d{5})/i,
      /(\d)\s+(\d)\s+(\d)\s+(\d)\s+(\d)(?:\s|$)/  // Individually spoken digits
    ];
    
    let zipCode = '';
    let remainingText = cleaned;
    
    for (const pattern of zipPatterns) {
      const match = cleaned.match(pattern);
      if (match) {
        if (pattern.source.includes('\\s+')) {
          // Handle individually spoken digits
          zipCode = match.slice(1, 6).join('');
        } else {
          zipCode = match[1];
        }
        // Remove zip code from text
        remainingText = cleaned.replace(match[0], '').trim();
        break;
      }
    }
    
    if (!zipCode) {
      return null;
    }
    
    // Try to extract city (usually comes before zip or after address)
    // Look for common city patterns
    const cityPatterns = [
      /city\s+(?:is\s+)?([a-z\s]+?)(?:\s+zip|\s+\d|$)/i,
      /in\s+([a-z\s]+?)(?:\s+zip|\s+\d|$)/i,
      /,\s*([a-z\s]+?)(?:\s+zip|\s+\d|$)/i,
    ];
    
    let city = '';
    for (const pattern of cityPatterns) {
      const match = remainingText.match(pattern);
      if (match) {
        city = match[1].trim();
        remainingText = remainingText.replace(match[0], '').trim();
        break;
      }
    }
    
    // If no city pattern found, try to extract the last few words before zip
    if (!city) {
      const words = remainingText.split(/\s+/);
      if (words.length >= 2) {
        city = words.slice(-2).join(' ');
        remainingText = words.slice(0, -2).join(' ');
      }
    }
    
    // Remaining text is the street address
    let address = remainingText
      .replace(/^address\s+(?:is\s+)?/i, '')
      .replace(/^at\s+/i, '')
      .trim();
    
    if (!address || !city) {
      return null;
    }
    
    return {
      address: address.charAt(0).toUpperCase() + address.slice(1),
      city: city.charAt(0).toUpperCase() + city.slice(1),
      zipCode
    };
  };

  const handleVoiceInput = async () => {
    try {
      setIsListening(true);
      await speechService.speak('Please speak your complete shipping address including street address, city, and ZIP code');
      
      // Start listening
      await speechService.startPushToTalk();
      
      // Wait for user to finish speaking (simulate hold and release)
      // In real usage, user will release Ctrl+V or we'll detect silence
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Error starting voice input:', error);
      toast.error('Failed to start voice input');
      setIsListening(false);
    }
  };

  const stopAndProcess = async () => {
    try {
      setIsListening(false);
      setIsProcessing(true);
      
      const transcript = await speechService.stopPushToTalk();
      
      if (!transcript) {
        toast.error('No speech detected. Please try again.');
        await speechService.speak('No speech detected. Please try again.');
        setIsProcessing(false);
        return;
      }
      
      console.log('📍 Address transcript:', transcript);
      
      // Parse the address
      const parsed = parseAddress(transcript);
      
      if (!parsed) {
        toast.error('Could not understand address. Please speak: street address, city, and 5-digit ZIP code');
        await speechService.speak('Could not understand address format. Please say your street address, then city, then ZIP code clearly.');
        setIsProcessing(false);
        return;
      }
      
      // Fill the form
      onAddressCapture(parsed.address, parsed.city, parsed.zipCode);
      
      toast.success('Address captured successfully!');
      await speechService.speak(`Address set to ${parsed.address}, ${parsed.city}, ${parsed.zipCode}`);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast.error('Failed to process voice input');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      {!isListening && !isProcessing && (
        <Button
          type="button"
          onClick={handleVoiceInput}
          variant="outline"
          className="w-full"
          tabIndex={0}
          aria-label="Speak your shipping address"
        >
          <Mic className="mr-2 h-4 w-4" />
          Speak Address
        </Button>
      )}
      
      {isListening && (
        <div className="space-y-2">
          <Button
            type="button"
            onClick={stopAndProcess}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            tabIndex={0}
            aria-label="Stop recording and process address"
          >
            <MicOff className="mr-2 h-4 w-4 animate-pulse" />
            Stop & Process
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            🎤 Listening... Speak clearly: "123 Main Street, New York, 10001"
          </p>
        </div>
      )}
      
      {isProcessing && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm text-muted-foreground">Processing address...</span>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
        <p><strong>Voice Input Tips:</strong></p>
        <p>• Speak clearly: "Street address, city, ZIP code"</p>
        <p>• Example: "123 Main Street, New York, 10001"</p>
        <p>• Speak ZIP code as 5 digits</p>
      </div>
    </div>
  );
};