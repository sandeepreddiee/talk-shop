import { pipeline, env } from '@huggingface/transformers';

class WhisperService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;

  async startRecording(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
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
        
        // Small delay to ensure recording is fully initialized before user speaks
        setTimeout(() => {
          console.log('✅ Recording started and ready');
          resolve();
        }, 300);
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
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              
              console.log('🔄 Sending to OpenAI Whisper API...');
              
              const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
                  },
                  body: JSON.stringify({ audio: base64Audio })
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Transcription failed');
              }

              const data = await response.json();
              console.log('✅ Transcription complete:', data.text);
              
              // Cleanup
              this.audioChunks = [];
              
              resolve(data.text);
            } catch (error) {
              console.error('❌ Transcription error:', error);
              reject(error);
            }
          };
        } catch (error) {
          console.error('❌ Processing error:', error);
          reject(error);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}

export const whisperService = new WhisperService();
