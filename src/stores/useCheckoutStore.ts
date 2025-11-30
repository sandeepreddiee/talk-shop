import { create } from 'zustand';

interface CheckoutState {
  address: string;
  city: string;
  zipCode: string;
  setAddress: (address: string) => void;
  setCity: (city: string) => void;
  setZipCode: (zipCode: string) => void;
  setShippingAddress: (address: string, city: string, zipCode: string) => void;
  clearAddress: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  address: '',
  city: '',
  zipCode: '',
  
  setAddress: (address: string) => set({ address }),
  setCity: (city: string) => set({ city }),
  setZipCode: (zipCode: string) => set({ zipCode }),
  
  setShippingAddress: (address: string, city: string, zipCode: string) => 
    set({ address, city, zipCode }),
  
  clearAddress: () => set({ address: '', city: '', zipCode: '' }),
}));
