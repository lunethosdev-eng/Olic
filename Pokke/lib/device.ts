import { Platform, useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

export type DeviceClass = 'phone' | 'tablet' | 'desktop' | 'tv';

export function useDeviceClass(): DeviceClass {
  const { width, height } = useWindowDimensions();
  const shortest = Math.min(width, height);
  const longest = Math.max(width, height);

  return useMemo(() => {
    // TV detection (rough — improve with Platform.isTV when using tvos fork)
    if (Platform.isTV || (Platform.OS === 'android' && longest >= 1920 && shortest >= 1080)) {
      return 'tv';
    }

    if (Platform.OS === 'web') {
      if (width >= 1200) return 'desktop';
      if (width >= 768) return 'tablet';
      return 'phone';
    }

    // Native
    if (shortest >= 600) return 'tablet';
    return 'phone';
  }, [width, height, shortest, longest]);
}

export function isTV(device: DeviceClass) {
  return device === 'tv';
}

export function isDesktop(device: DeviceClass) {
  return device === 'desktop';
}

export function isPhone(device: DeviceClass) {
  return device === 'phone';
}
