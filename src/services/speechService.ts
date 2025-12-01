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
      this.isListening = true;

      let fullTranscript = "";

      this.recognition.onresult = (event: any) => {
          const result = event.results[event.resultIndex];
          const text = result[0].transcript.toLowerCase();

          // 🔥 STOP KEYWORD
          if (text.includes("stop listening")) {
            this.stopListening();
            onStop();
            return;
          }

          fullTranscript += " " + text;

          if (result.isFinal) {
            onTranscript(fullTranscript.trim());
            fullTranscript = "";
          }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        reject(event.error);
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Chrome sometimes auto-stops, restart automatically
          this.recognition.start();
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
        reject(new Error('Speech recognition not supported'));
        return;
      }

      // Stop any existing recognition
      if (this.isListening) {
        try {
          this.recognition.stop();
        } catch (_) {}
      }

      this.recognition.continuous = true;
      this.recognition.interimResults = false; // Only final results
      this.isListening = true;
      this.pushToTalkTranscript = "";

      this.recognition.onresult = (event: any) => {
        let fullTranscript = "";
        // Collect all final results
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            fullTranscript += result[0].transcript + " ";
            console.log(`✅ Final result [${i}]:`, result[0].transcript);
          }
        }
        if (fullTranscript) {
          this.pushToTalkTranscript = fullTranscript.trim();
          console.log('📝 Updated transcript:', this.pushToTalkTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('❌ Speech error:', event.error);
        // Don't reject on no-speech errors, just continue
        if (event.error !== 'no-speech') {
          this.isListening = false;
        }
      };

      this.recognition.onend = () => {
        console.log('🔄 Recognition ended, listening:', this.isListening);
        if (this.isListening) {
          // Auto-restart if still in push-to-talk mode
          try {
            this.recognition.start();
            console.log('🔄 Auto-restarted recognition');
          } catch (e) {
            console.log('⚠️ Could not restart:', e);
          }
        }
      };

      try {
        this.recognition.start();
        console.log('🎤 Recognition started');
        resolve();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopPushToTalk(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.recognition) {
        console.log('⚠️ No recognition available');
        resolve("");
        return;
      }

      if (!this.isListening) {
        console.log('⚠️ Not listening');
        resolve("");
        return;
      }

      this.isListening = false;
      console.log('🛑 Stopping, current:', this.pushToTalkTranscript);
      
      // Wait longer to ensure final results are captured
      setTimeout(() => {
        try {
          this.recognition.stop();
        } catch (_) {}
        
        const transcript = this.pushToTalkTranscript.trim();
        console.log('✅ Returning transcript:', transcript);
        this.pushToTalkTranscript = "";
        resolve(transcript);
      }, 500); // Longer delay for Chrome to process final results
    });
  }

  isCurrentlyListening() {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
