import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Badge = 'owner' | 'admin' | 'exclusive' | 'verified' | null;

export type Profile = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bannerUrl?: string;
  badge: Badge;
  likedArtists: string[];
  pinRequired?: boolean;
};

type AuthState = {
  user: Profile | null;
  hydrated: boolean;
  login: (email: string, password: string, pin?: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { email: string; password: string; username: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  setLikedArtists: (ids: string[]) => void;
  grantBadge: (usernameOrId: string, badge: Badge) => Promise<boolean>;
};

const OWNER_EMAIL = 'lunethos.dev@gmail.com';
const OWNER_PASS = 'red9959.';
const OWNER_PIN = '4049959';

const STORAGE_KEY = 'pokke.auth.v1';

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ user: JSON.parse(raw), hydrated: true });
      else set({ hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  login: async (email, password, pin) => {
    const e = email.trim().toLowerCase();
    if (e === OWNER_EMAIL.toLowerCase() && password === OWNER_PASS) {
      if (pin !== OWNER_PIN) {
        return { ok: false, error: 'PIN de owner incorrecto' };
      }
      const user: Profile = {
        id: 'owner-1',
        email: OWNER_EMAIL,
        username: 'lunethos',
        displayName: 'Lunethos',
        badge: 'owner',
        likedArtists: [],
        pinRequired: true,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      set({ user });
      return { ok: true };
    }
    // TODO: Kokoro Supabase auth
    return { ok: false, error: 'Cuenta no encontrada (conecta Kokoro para más usuarios)' };
  },

  register: async ({ email, password, username }) => {
    if (!email || !password || !username) return { ok: false, error: 'Completa todos los campos' };
    if (email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase()) {
      return { ok: false, error: 'Ese correo está reservado' };
    }
    const user: Profile = {
      id: `u_${Date.now()}`,
      email: email.trim(),
      username: username.trim(),
      displayName: username.trim(),
      badge: null,
      likedArtists: [],
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user });
    return { ok: true };
  },

  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ user: null });
  },

  setLikedArtists: (ids) => {
    const u = get().user;
    if (!u) return;
    const next = { ...u, likedArtists: ids };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ user: next });
  },

  grantBadge: async (usernameOrId, badge) => {
    const me = get().user;
    if (!me || (me.badge !== 'owner' && me.badge !== 'admin')) return false;
    // Real-time would go through Kokoro; local stub for now
    console.log('[admin] grantBadge', usernameOrId, badge);
    return true;
  },
}));
