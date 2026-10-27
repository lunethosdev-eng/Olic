import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Kokoro = accounts / profiles / social / badges
const KOKORO_URL =
  process.env.EXPO_PUBLIC_KOKORO_URL ?? 'https://ajbmpgnzkgtcmulocftd.supabase.co';
const KOKORO_ANON_KEY =
  process.env.EXPO_PUBLIC_KOKORO_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYm1wZ256a2d0Y211bG9jZnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNDU2MjksImV4cCI6MjEwNTkyMTYyOX0.twsBnT9WBBILyXFuoQh7viI578yoNbeQztKHsr8DB8k';

// Ukiyo = music catalog
const UKIYO_URL =
  process.env.EXPO_PUBLIC_UKIYO_URL ?? 'https://esjoifsjljvymttinyhj.supabase.co';
const UKIYO_ANON_KEY =
  process.env.EXPO_PUBLIC_UKIYO_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzam9pZnNqbGp2eW10dGlueWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzYyMTAsImV4cCI6MjEwNjYxMjIxMH0.GKA3KyoMElVwLUQlL2ad82IPjRmwKmMJEGPTUNwbuVQ';

const storage = Platform.OS === 'web' ? undefined : AsyncStorage;

function safeClient(url: string, key: string, opts?: any): SupabaseClient | null {
  if (!url || !key) {
    console.warn('[Pokke] Supabase missing url/key', url ? 'key missing' : 'url missing');
    return null;
  }
  try {
    return createClient(url, key, opts);
  } catch (e) {
    console.warn('[Pokke] createClient failed', e);
    return null;
  }
}

export const kokoro = safeClient(KOKORO_URL, KOKORO_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
}) as SupabaseClient;

export const ukiyo = safeClient(UKIYO_URL, UKIYO_ANON_KEY, {
  auth: { persistSession: false },
}) as SupabaseClient;

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
  badge?: string | null;
};
