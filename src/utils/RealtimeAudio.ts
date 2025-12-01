import { supabase } from '@/integrations/supabase/client';

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private recorder: AudioRecorder | null = null;
  private clientTools: Record<string, (args: any) => Promise<any>>;

  constructor(
    private onMessage: (message: any) => void,
    clientTools?: Record<string, (args: any) => Promise<any>>
  ) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
    this.clientTools = clientTools || {};
  }

  async init() {
    try {
      console.log('Initializing Realtime Chat...');
      
      // Get ephemeral token from Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("realtime-token");
      
      if (error || !data?.client_secret?.value) {
        throw new Error(error?.message || "Failed to get ephemeral token");
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log('Got ephemeral token');

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up connection state monitoring
      this.pc.onconnectionstatechange = () => {
        console.log('🔌 Connection state:', this.pc?.connectionState);
        if (this.pc?.connectionState === 'failed' || this.pc?.connectionState === 'disconnected') {
          console.error('WebRTC connection failed or disconnected');
          this.onMessage({ type: 'error', error: { message: 'Connection lost. Please try again.' } });
        }
      };

      this.pc.oniceconnectionstatechange = () => {
        console.log('🧊 ICE connection state:', this.pc?.iceConnectionState);
      };

      // Set up remote audio
      this.pc.ontrack = e => {
        console.log('🎵 Received audio track');
        this.audioEl.srcObject = e.streams[0];
      };

      // Add local audio track
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.pc.addTrack(ms.getTracks()[0]);
      console.log('🎤 Added local audio track');

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      
      this.dc.onopen = () => {
        console.log('📡 Data channel opened - ready to communicate');
      };
      
      this.dc.onclose = () => {
        console.log('📡 Data channel closed');
      };
      
      this.dc.onerror = (error) => {
        console.error('📡 Data channel error:', error);
      };
      
      this.dc.addEventListener("message", async (e) => {
        const event = JSON.parse(e.data);
        console.log("📨 Received event:", event.type, event);
        
        // Handle function calls
        if (event.type === 'response.function_call_arguments.done') {
          await this.handleFunctionCall(event);
        }
        
        this.onMessage(event);
      });

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      console.log('Created offer');

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      console.log('🌐 Connecting to OpenAI Realtime API...');
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error('❌ Failed to connect to OpenAI:', sdpResponse.status, errorText);
        throw new Error(`Failed to connect to OpenAI (${sdpResponse.status}): ${errorText}`);
      }
      
      console.log('✅ Connected to OpenAI Realtime API');

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established");

      // Wait for data channel to open before sending session config
      await new Promise<void>((resolve) => {
        if (this.dc?.readyState === 'open') {
          resolve();
        } else {
          this.dc!.onopen = () => {
            console.log('📡 Data channel opened - sending session config');
            resolve();
          };
        }
      });

      // Configure session with tools
      const tools = Object.keys(this.clientTools).map(name => {
        // Define tool configurations
        const toolConfigs: Record<string, any> = {
          search_products: {
            description: "Search for products by name, category, or features",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string", description: "Search query" },
                category: { type: "string", description: "Optional category filter" }
              },
              required: ["query"]
            }
          },
          view_product: {
            description: "Open and navigate to a product's detail page",
            parameters: {
              type: "object",
              properties: {
                productId: { type: "string", description: "Product ID" },
                productName: { type: "string", description: "Product name to search for" }
              }
            }
          },
          get_product_details: {
            description: "Get full details about a specific product",
            parameters: {
              type: "object",
              properties: {
                productId: { type: "string", description: "Product ID (leave empty for current product)" }
              }
            }
          },
          add_to_cart: {
            description: "Add a product to shopping cart",
            parameters: {
              type: "object",
              properties: {
                productId: { type: "string", description: "Product ID" },
                productName: { type: "string", description: "Product name to search for" },
                quantity: { type: "number", description: "Quantity to add" }
              }
            }
          },
          update_shipping_address: {
            description: "Update shipping address fields during checkout. Extract address from user speech.",
            parameters: {
              type: "object",
              properties: {
                address: { type: "string", description: "Street address" },
                city: { type: "string", description: "City name" },
                zipCode: { type: "string", description: "ZIP code" }
              }
            }
          },
          place_order: {
            description: "Complete the checkout and place the order",
            parameters: { type: "object", properties: {} }
          },
          navigate: {
            description: "Navigate to different pages",
            parameters: {
              type: "object",
              properties: {
                destination: { 
                  type: "string", 
                  enum: ["home", "cart", "checkout", "wishlist", "orders", "account"],
                  description: "Destination to navigate to"
                },
                productId: { type: "string", description: "Product ID for product pages" }
              }
            }
          }
        };

        return {
          type: "function",
          name,
          description: toolConfigs[name]?.description || "",
          parameters: toolConfigs[name]?.parameters || { type: "object", properties: {} }
        };
      });

      // Get current page info
      const currentPath = window.location.pathname;
      let pageContext = "";
      if (currentPath.includes('/checkout')) {
        pageContext = "The user is currently on the checkout page ready to complete their order.";
      } else if (currentPath.includes('/cart')) {
        pageContext = "The user is currently viewing their shopping cart.";
      } else if (currentPath.includes('/product/')) {
        pageContext = "The user is currently viewing a product detail page.";
      } else if (currentPath === '/') {
        pageContext = "The user is currently on the home page.";
      } else if (currentPath.includes('/s/')) {
        pageContext = "The user is currently viewing search results.";
      }

      this.dc!.send(JSON.stringify({
        type: 'session.update',
        session: {
          modalities: ["text", "audio"],
          instructions: `You are a helpful shopping assistant for AccessShop, an accessible e-commerce platform. Help users find products, manage their cart, and complete purchases.
          
${pageContext}

IMPORTANT: When users ask to update their address while on the checkout page, extract the address components (street address, city, ZIP code) from their speech and immediately call update_shipping_address. Do NOT tell them to navigate to checkout if they're already there.

Be conversational, friendly, and context-aware. If a user is already on the checkout page and asks about their address, help them update it right away.`,
          voice: "alloy",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1"
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          },
          tools,
          tool_choice: "auto",
          temperature: 0.8
        }
      }));
      console.log('📤 Sent session configuration with tools:', tools.map(t => t.name));

      // Start recording
      this.recorder = new AudioRecorder((audioData) => {
        if (this.dc?.readyState === 'open') {
          this.dc.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: this.encodeAudioData(audioData)
          }));
        }
      });
      await this.recorder.start();
      console.log('Audio recording started');

    } catch (error) {
      console.error("Error initializing chat:", error);
      throw error;
    }
  }

  private encodeAudioData(float32Array: Float32Array): string {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  }

  async sendMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({type: 'response.create'}));
  }

  private async handleFunctionCall(event: any) {
    const { call_id, name, arguments: argsString } = event;
    console.log('🔧 Function call:', name, argsString);
    
    try {
      const args = JSON.parse(argsString);
      const tool = this.clientTools[name];
      
      if (!tool) {
        console.error('Tool not found:', name);
        return;
      }
      
      const result = await tool(args);
      console.log('✅ Function result:', result);
      
      // Send function output back to the API
      if (this.dc?.readyState === 'open') {
        this.dc.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id,
            output: JSON.stringify(result)
          }
        }));
        
        // Trigger a new response
        this.dc.send(JSON.stringify({ type: 'response.create' }));
      }
    } catch (error) {
      console.error('❌ Function call error:', error);
    }
  }

  disconnect() {
    console.log('Disconnecting Realtime Chat');
    this.recorder?.stop();
    this.dc?.close();
    this.pc?.close();
  }
}
