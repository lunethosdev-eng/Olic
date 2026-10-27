import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ExperimentalFeatures = {
  liquidGlass: boolean;      // Liquid Glass / Electric Glass
  listenTogether: boolean;
  chats: boolean;
  stories: boolean;
  map: boolean;
  animatedCoversDefault: boolean;
};

export type SettingsState = {
  experimental: ExperimentalFeatures;
  autoFocusSearch: boolean;
  downloadLocation: 'app' | 'device'; // default preference
  setExperimental: (key: keyof ExperimentalFeatures, value: boolean) => void;
  setAutoFocusSearch: (value: boolean) => void;
  setDownloadLocation: (value: 'app' | 'device') => void;
};

const defaultExperimental: ExperimentalFeatures = {
  liquidGlass: false,
  listenTogether: false,
  chats: false,
  stories: false,
  map: false,
  animatedCoversDefault: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      experimental: defaultExperimental,
      autoFocusSearch: true,
      downloadLocation: 'app',

      setExperimental: (key, value) =>
        set((state) => ({
          experimental: { ...state.experimental, [key]: value },
        })),

      setAutoFocusSearch: (value) => set({ autoFocusSearch: value }),
      setDownloadLocation: (value) => set({ downloadLocation: value }),
    }),
    {
      name: 'pokke-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
