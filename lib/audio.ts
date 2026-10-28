/**
 * Defensive audio layer. Never crashes the app if expo-av fails.
 */

type StatusCb = (s: {
  isLoaded: boolean;
  isPlaying?: boolean;
  positionMillis?: number;
  durationMillis?: number;
  didJustFinish?: boolean;
}) => void;

export type SoundHandle = {
  playAsync: () => Promise<void>;
  pauseAsync: () => Promise<void>;
  stopAsync: () => Promise<void>;
  unloadAsync: () => Promise<void>;
  setPositionAsync: (ms: number) => Promise<void>;
  getStatusAsync: () => Promise<any>;
  setOnPlaybackStatusUpdate: (cb: StatusCb | null) => void;
};

let AudioNS: any = null;
let tried = false;
let unavailable = false;
let current: SoundHandle | null = null;

async function getAudio(): Promise<any | null> {
  if (unavailable) return null;
  if (AudioNS) return AudioNS;
  if (tried) return null;
  tried = true;
  try {
    const mod = await import('expo-av');
    AudioNS = mod.Audio ?? mod;
    await AudioNS.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
    return AudioNS;
  } catch (e) {
    unavailable = true;
    console.warn('[audio] expo-av unavailable', e);
    return null;
  }
}

export async function setupAudio() {
  await getAudio();
}

function resolveUri(input: any): string | null {
  if (!input) return null;
  if (typeof input === 'string') return input;
  if (typeof input === 'object') {
    return (
      input.audio_url ||
      input.audioUrl ||
      input.url ||
      input.stream_url ||
      input.file_url ||
      null
    );
  }
  return null;
}

export async function loadAndPlay(
  trackOrUri: any,
  onStatus?: StatusCb
): Promise<SoundHandle | null> {
  const uri = resolveUri(trackOrUri);
  if (!uri) {
    console.warn('[audio] no audio_url on track', trackOrUri?.id || trackOrUri);
    return null;
  }
  const Audio = await getAudio();
  if (!Audio) return null;
  try {
    if (current) {
      await current.unloadAsync().catch(() => {});
      current = null;
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, progressUpdateIntervalMillis: 250 },
      onStatus
    );
    current = sound as SoundHandle;
    return current;
  } catch (e) {
    console.warn('[audio] loadAndPlay failed', e);
    return null;
  }
}

export async function play(sound?: SoundHandle | null) {
  try {
    await (sound || current)?.playAsync();
  } catch {}
}

export async function pause(sound?: SoundHandle | null) {
  try {
    await (sound || current)?.pauseAsync();
  } catch {}
}

export async function seekTo(sound: SoundHandle | null | undefined, seconds: number) {
  try {
    await (sound || current)?.setPositionAsync(Math.max(0, seconds * 1000));
  } catch {}
}

export async function stop() {
  try {
    await current?.stopAsync();
    await current?.unloadAsync();
  } catch {}
  current = null;
}
