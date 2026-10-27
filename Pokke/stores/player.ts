import { create } from 'zustand';

export type Track = {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  cover_url?: string | null;
  animated_cover_url?: string | null;
  audio_url: string;
  duration_seconds: number;
  lyrics_text?: string | null;
  lyrics_url?: string | null;
};

export type PlayerState = {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  position: number; // seconds
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  showAnimatedCover: boolean;
  isFullPlayerOpen: boolean;
  isLyricsExpanded: boolean;

  setTrack: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  next: () => void;
  prev: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setShowAnimatedCover: (v: boolean) => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  toggleLyrics: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  position: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',
  showAnimatedCover: false,
  isFullPlayerOpen: false,
  isLyricsExpanded: false,

  setTrack: (track) =>
    set({
      currentTrack: track,
      duration: track.duration_seconds,
      position: 0,
      isPlaying: true,
      showAnimatedCover: !!track.animated_cover_url,
    }),

  setQueue: (tracks) => set({ queue: tracks }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  seek: (seconds) => set({ position: seconds }),

  next: () => {
    const { queue, currentTrack, shuffle, repeat } = get();
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    let nextIdx = idx + 1;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    }
    if (nextIdx >= queue.length) {
      if (repeat === 'all') nextIdx = 0;
      else return;
    }
    get().setTrack(queue[nextIdx]);
  },

  prev: () => {
    const { queue, currentTrack, position } = get();
    if (!currentTrack || queue.length === 0) return;
    if (position > 3) {
      set({ position: 0 });
      return;
    }
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = idx <= 0 ? queue.length - 1 : idx - 1;
    get().setTrack(queue[prevIdx]);
  },

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

  cycleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off',
    })),

  setShowAnimatedCover: (v) => set({ showAnimatedCover: v }),

  openFullPlayer: () => set({ isFullPlayerOpen: true }),
  closeFullPlayer: () => set({ isFullPlayerOpen: false }),
  toggleLyrics: () => set((s) => ({ isLyricsExpanded: !s.isLyricsExpanded })),
}));
