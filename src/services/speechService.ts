class SpeechService {
  private synthesis: SpeechSynthesis;
  private recognition: any;
  private isListening = false;
  private pushToTalkTranscript = "";

  constructor() {
    this.synthesis = window.speechSynthesis;

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";
    }
  }

  // -----------------------
  // TEXT TO SPEECH
  // -----------------------
  speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      this.stopSpeaking();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1;
      utter.pitch = 1;
      utter.volume = 1;
      utter.onend = () => resolve();
      this.synthesis.speak(utter);
    });
  }

  stopSpeaking() {
    this.synthesis.cancel();
  }

  // -----------------------
  // SPEECH TO TEXT (Single command - for global commands)
  // -----------------------
  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      // Temporarily disable continuous mode for single command
      this.recognition.continuous = false;
      
      if (this.isListening) {
        try {
          this.recognition.stop();
        } catch (_) {}
      }

      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        this.recognition.continuous = true; // Re-enable continuous
        resolve(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        this.recognition.continuous = true; // Re-enable continuous
        reject(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.recognition.continuous = true; // Re-enable continuous
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        this.recognition.continuous = true; // Re-enable continuous
        reject(error);
      }
    });
  }

  // -----------------------
  // SPEECH TO TEXT (Continuous)
  // -----------------------
  startContinuousListening(
    onTranscript: (text: string) => void,
    onStop: () => void
  ) {
    return new Promise<void>((resolve, reject) => {
      if (!this.recognition) {
        reject("Speech recognition not supported");
        return;
      }

      if (this.isListening) {
        try {
          this.recognition.stop();
        } catch (_) {}
      }

      this.recognition.continuous = true;
      this.recognition.interimResults = false; // Only final results
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        // Only process final results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          
          if (result.isFinal) {
            const text = result[0].transcript;
            console.log('🎤 Final transcript:', text);
            
            // Check for stop keyword
            if (text.toLowerCase().includes("stop listening")) {
              this.stopListening();
              onStop();
              return;
            }
            
            // Send final transcript
            onTranscript(text);
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          this.isListening = false;
          reject(event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Chrome sometimes auto-stops, restart automatically
          try {
            this.recognition.start();
          } catch (e) {
            console.error('Failed to restart recognition:', e);
          }
        }
      };

      this.recognition.start();
      resolve();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // -----------------------
  // PUSH-TO-TALK (Hold Ctrl+V)
  // -----------------------
  startPushToTalk(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        console.error('❌ Speech recognition not supported in this browser');
        reject(new Error('Speech recognition not supported'));
        return;
      }

      // Stop any existing recognition
      if (this.isListening) {
        console.log('⚠️ Already listening, stopping first');
        try {
          this.recognition.stop();
        } catch (_) {}
        // Wait a bit before restarting
        setTimeout(() => this.startPushToTalk(), 100);
        return;
      }

      console.log('🎤 Initializing push-to-talk...');
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true; // Need interim to see what's captured
      this.recognition.maxAlternatives = 1;
      this.isListening = true;
      this.pushToTalkTranscript = "";

      let lastFinalIndex = 0;

      this.recognition.onstart = () => {
        console.log('✅ Recognition STARTED successfully');
      };

      this.recognition.onresult = (event: any) => {
        console.log('📢 onresult event fired, results length:', event.results.length);
        
        // Process results from where we left off
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          console.log(`📝 Result [${i}] - isFinal: ${result.isFinal}, text: "${transcript}"`);
          
          if (result.isFinal) {
            // Append final results
            this.pushToTalkTranscript += transcript + " ";
            lastFinalIndex = i;
            console.log('✅ FINAL result captured. Full transcript:', this.pushToTalkTranscript);
          } else {
            console.log('⏳ Interim result:', transcript);
          }
        }
      };

      this.recognition.onaudiostart = () => {
        console.log('🎙️ Audio capture started');
      };

      this.recognition.onaudioend = () => {
        console.log('🎙️ Audio capture ended');
      };

      this.recognition.onspeechstart = () => {
        console.log('🗣️ Speech detected!');
      };

      this.recognition.onspeechend = () => {
        console.log('🗣️ Speech ended');
      };

      this.recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        console.error('Full error event:', event);
        
        if (event.error === 'no-speech') {
          console.log('⚠️ No speech detected');
        } else if (event.error === 'audio-capture') {
          console.error('❌ Microphone not accessible');
        } else if (event.error === 'not-allowed') {
          console.error('❌ Microphone permission denied');
        }
        
        // Only stop on serious errors
        if (event.error === 'not-allowed' || event.error === 'audio-capture') {
          this.isListening = false;
        }
      };

      this.recognition.onend = () => {
        console.log('🔄 Recognition ended. isListening:', this.isListening, 'transcript so far:', this.pushToTalkTranscript);
        
        if (this.isListening) {
          // Auto-restart if still in push-to-talk mode
          console.log('🔄 Auto-restarting...');
          try {
            this.recognition.start();
          } catch (e) {
            console.error('❌ Could not restart:', e);
          }
        }
      };

      try {
        this.recognition.start();
        console.log('🚀 Called recognition.start()');
        resolve();
      } catch (error) {
        console.error('❌ Failed to start recognition:', error);
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopPushToTalk(): Promise<string> {
    return new Promise((resolve) => {
      console.log('🛑 stopPushToTalk called');
      
      if (!this.recognition) {
        console.error('❌ No recognition object');
        resolve("");
        return;
      }

      if (!this.isListening) {
        console.log('⚠️ Not currently listening');
        resolve("");
        return;
      }

      this.isListening = false;
      console.log('📝 Current transcript before stopping:', this.pushToTalkTranscript);
      
      // Give time for any final results to come through
      setTimeout(() => {
        console.log('⏰ Delay complete, stopping recognition');
        
        try {
          this.recognition.stop();
          console.log('✅ Recognition stopped');
        } catch (e) {
          console.error('❌ Error stopping recognition:', e);
        }
        
        // Wait a bit more for onresult to fire with final results
        setTimeout(() => {
          const transcript = this.pushToTalkTranscript.trim();
          console.log('📤 Returning final transcript:', transcript);
          console.log('📏 Transcript length:', transcript.length);
          
          this.pushToTalkTranscript = "";
          resolve(transcript);
        }, 300);
      }, 200);
    });
  }

  isCurrentlyListening() {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
