import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

class WhisperService {
  private transcriber: any = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    console.log('🎤 Initializing Whisper model...');
    try {
      // Use tiny.en model for faster loading and processing
      this.transcriber = await pipeline(
        'automatic-speech-recognition',
        'onnx-community/whisper-tiny.en',
        { device: 'webgpu' }
      );
      this.isInitialized = true;
      console.log('✅ Whisper model loaded');
    } catch (error) {
      console.error('❌ Failed to load Whisper model:', error);
      throw error;
    }
  }

  async startRecording(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Initialize model on first use
        if (!this.isInitialized) {
          await this.initialize();
        }

        console.log('🎙️ Starting audio recording...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        this.audioChunks = [];
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        
        this.mediaRecorder.onstop = () => {
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };
        
        this.mediaRecorder.start();
        this.isRecording = true;
        console.log('✅ Recording started');
        resolve();
      } catch (error) {
        console.error('❌ Failed to start recording:', error);
        reject(error);
      }
    });
  }

  async stopRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        console.log('⚠️ Not currently recording');
        resolve('');
        return;
      }

      console.log('🛑 Stopping recording...');
      this.isRecording = false;

      this.mediaRecorder.onstop = async () => {
        try {
          console.log('📦 Processing audio chunks...');
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          
          // Convert blob to URL for Whisper
          const audioUrl = URL.createObjectURL(audioBlob);
          
          console.log('🔄 Transcribing with Whisper...');
          const output = await this.transcriber(audioUrl);
          
          console.log('✅ Transcription complete:', output.text);
          
          // Cleanup
          URL.revokeObjectURL(audioUrl);
          this.audioChunks = [];
          
          resolve(output.text);
        } catch (error) {
          console.error('❌ Transcription error:', error);
          reject(error);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  async preloadModel(): Promise<void> {
    try {
      console.log('⏳ Preloading Whisper model...');
      await this.initialize();
      console.log('✅ Model preloaded and ready');
    } catch (error) {
      console.error('❌ Failed to preload model:', error);
    }
  }
}

export const whisperService = new WhisperService();
