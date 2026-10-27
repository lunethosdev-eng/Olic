import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Track } from '@/stores/player';

let sound: Audio.Sound | null = null;
let currentTrackId: string | null = null;

export async function setupAudio() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    playThroughEarpieceAndroid: false,
  });

  if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }
}

export async function loadAndPlay(
  track: Track,
  onStatus?: (status: AVPlaybackStatus) => void
) {
  try {
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: track.audio_url },
      { shouldPlay: true, progressUpdateIntervalMillis: 250 },
      onStatus
    );
    sound = newSound;
    currentTrackId = track.id;

    // Media notification (Android / iOS)
    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: track.title,
          body: track.artist,
          data: { trackId: track.id },
          sticky: true,
          priority: Notifications.AndroidNotificationPriority.LOW,
        },
        trigger: null,
      });
    }

    return newSound;
  } catch (e) {
    console.warn('Audio load error', e);
    throw e;
  }
}

export async function pause() {
  if (sound) await sound.pauseAsync();
}

export async function play() {
  if (sound) await sound.playAsync();
}

export async function seekTo(seconds: number) {
  if (sound) await sound.setPositionAsync(seconds * 1000);
}

export async function unload() {
  if (sound) {
    await sound.unloadAsync();
    sound = null;
    currentTrackId = null;
  }
}

export function getCurrentSound() {
  return sound;
}
