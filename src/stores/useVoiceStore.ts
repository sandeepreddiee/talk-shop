import { create } from 'zustand';

interface VoiceState {
  isListening: boolean;
  isAssistantOpen: boolean;
  isAISpeaking: boolean;
  lastCommand: string | null;
  setListening: (listening: boolean) => void;
  setAssistantOpen: (open: boolean) => void;
  setAISpeaking: (speaking: boolean) => void;
  setLastCommand: (command: string | null) => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isListening: false,
  isAssistantOpen: false,
  isAISpeaking: false,
  lastCommand: null,

  setListening: (listening: boolean) => set({ isListening: listening }),
  setAssistantOpen: (open: boolean) => set({ isAssistantOpen: open }),
  setAISpeaking: (speaking: boolean) => set({ isAISpeaking: speaking }),
  setLastCommand: (command: string | null) => set({ lastCommand: command })
}));
