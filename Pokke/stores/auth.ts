import { create } from 'zustand';
import { kokoro, type Profile } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  init: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,

  init: async () => {
    try {
      const { data } = await kokoro.auth.getSession();
      set({ session: data.session, user: data.session?.user ?? null });
      if (data.session?.user) {
        await get().refreshProfile();
      }
    } catch (e) {
      console.warn('Auth init error', e);
    } finally {
      set({ loading: false });
    }

    kokoro.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) await get().refreshProfile();
      else set({ profile: null });
    });
  },

  signIn: async (email, password) => {
    const { error } = await kokoro.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  },

  signUp: async (email, password, username) => {
    const { data, error } = await kokoro.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) return { error: error.message };
    // profile row is usually created by trigger; refresh later
    return {};
  },

  signOut: async () => {
    await kokoro.auth.signOut();
    set({ session: null, user: null, profile: null });
  },

  refreshProfile: async () => {
    const user = get().user;
    if (!user) return;
    const { data } = await kokoro
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (data) set({ profile: data as Profile });
  },
}));
