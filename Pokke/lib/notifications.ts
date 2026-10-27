import { Audio } from 'expo-av';
import { Platform } from 'react-native';

const SOUNDS = {
  bubble: require('@/assets/sounds/bubble-pop.mp3'),
  marimba: require('@/assets/sounds/marimba.mp3'),
  twinkle: require('@/assets/sounds/twinkle.mp3'),
  joyous: require('@/assets/sounds/joyous-chime.mp3'),
  message: require('@/assets/sounds/message.mp3'),
  outOfNowhere: require('@/assets/sounds/out-of-nowhere.mp3'),
} as const;

export type NotifSound = keyof typeof SOUNDS;

let lastSound: Audio.Sound | null = null;

/** Play a local UI notification sound (chats, map, system) */
export async function playNotifSound(name: NotifSound = 'bubble') {
  try {
    if (lastSound) {
      await lastSound.unloadAsync().catch(() => {});
      lastSound = null;
    }
    const { sound } = await Audio.Sound.createAsync(SOUNDS[name], {
      shouldPlay: true,
      volume: 0.85,
    });
    lastSound = sound;
    sound.setOnPlaybackStatusUpdate((st) => {
      if (st.isLoaded && st.didJustFinish) {
        sound.unloadAsync().catch(() => {});
      }
    });
  } catch (e) {
    console.warn('playNotifSound', name, e);
  }
}
