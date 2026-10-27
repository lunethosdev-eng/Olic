/**
 * Audio playback wrapper.
 * Uses expo-av when available; never crashes the app if native module fails.
 */
import { Platform } from 'react-native';

type SoundLike = {
  unloadAsync: () => Promise<void>;
  playAsync: () => Promise<void>;
  pauseAsync: () => Promise<void>;
  stopAsync: () => Promise<void>;
  setPositionAsync: (ms: number) => Promise<void>;
  getStatusAsync: () => Promise<any>;
  setOnPlaybackStatusUpdate: (cb: (s: any) => void) => void;
};

let AudioMod: any = null;
let loadError: string | null = null;

async function ensureAudio() {
  if (AudioMod) return AudioMod;
  if (loadError) return null;
  try {
    AudioMod = await import('expo-av');
    await AudioMod.Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    return AudioMod;
  } catch (e: any) {
    loadError = String(e?.message || e);
    console.warn('[Pokke audio] native module unavailable:', loadError);
    return null;
  }
}

export async function createSound(
  uri: string,
  onStatus?: (s: any) => void
): Promise<SoundLike | null> {
  const mod = await ensureAudio();
  if (!mod) return null;
  try {
    const { sound } = await mod.Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false, progressUpdateIntervalMillis: 250 },
      onStatus
    );
    return sound;
  } catch (e) {
    console.warn('[Pokke audio] createSound failed', e);
    return null;
  }
}

export async function playUri(uri: string): Promise<SoundLike | null> {
  const sound = await createSound(uri);
  if (sound) await sound.playAsync().catch(() => {});
  return sound;
}

export function audioAvailable(): boolean {
  return loadError === null;
}
