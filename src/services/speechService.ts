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

      if (this.isListening) {
        try {
          this.recognition.stop();
        } catch (_) {}
      }

      this.recognition.continuous = true;
      this.isListening = true;
      this.pushToTalkTranscript = "";

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            this.pushToTalkTranscript += " " + result[0].transcript;
          }
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Auto-restart if still in push-to-talk mode
          try {
            this.recognition.start();
          } catch (_) {}
        }
      };

      try {
        this.recognition.start();
        resolve();
      } catch (error) {
        this.isListening = false;
        reject(error);
      }
    });
  }

  stopPushToTalk(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.recognition || !this.isListening) {
        resolve("");
        return;
      }

      this.isListening = false;
      
      // Give a small delay to capture final results
      setTimeout(() => {
        try {
          this.recognition.stop();
        } catch (_) {}
        
        const transcript = this.pushToTalkTranscript.trim();
        this.pushToTalkTranscript = "";
        resolve(transcript);
      }, 100);
    });
  }

  isCurrentlyListening() {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
