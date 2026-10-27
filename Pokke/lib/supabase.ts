import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Kokoro Supabase (accounts, profiles, social, chats, settings)
const KOKORO_URL = process.env.EXPO_PUBLIC_KOKORO_URL ?? 'https://esjoifsjljvymttinyhj.supabase.co';
const KOKORO_ANON_KEY = process.env.EXPO_PUBLIC_KOKORO_ANON_KEY ?? '';

// Ukiyo (music catalog)
const UKIYO_URL = process.env.EXPO_PUBLIC_UKIYO_URL ?? '';
const UKIYO_ANON_KEY = process.env.EXPO_PUBLIC_UKIYO_ANON_KEY ?? '';

const storage = Platform.OS === 'web'
  ? undefined
  : AsyncStorage;

export const kokoro = createClient(KOKORO_URL, KOKORO_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

export const ukiyo = createClient(UKIYO_URL, UKIYO_ANON_KEY, {
  auth: {
    persistSession: false,
  },
});

// Helper types (will expand)
export type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  theme: string | null;
  frame: string | null;
  stickers: any[];
  is_public: boolean;
  show_listening: boolean;
  show_playlists: boolean;
  show_favorites: boolean;
  allow_messages: boolean;
  followers_count: number;
  following_count: number;
};
