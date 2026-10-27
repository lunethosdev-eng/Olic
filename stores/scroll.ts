import { create } from 'zustand';
import { SharedValue } from 'react-native-reanimated';

type ScrollState = {
  scrollY: number;
  setScrollY: (y: number) => void;
  compactProgress: number; // 0 → 1
  setCompactProgress: (v: number) => void;
};

export const useScrollStore = create<ScrollState>((set) => ({
  scrollY: 0,
  setScrollY: (y) => {
    const compact = Math.min(1, Math.max(0, (y - 40) / 80));
    set({ scrollY: y, compactProgress: compact });
  },
  compactProgress: 0,
  setCompactProgress: (v) => set({ compactProgress: v }),
}));
