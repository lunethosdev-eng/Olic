import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type Props = {
  position: number; // seconds
  duration: number;
  onSeek?: (seconds: number) => void;
};

function formatTime(sec: number) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Progress bar matching the reference image:
 * thin track, white fill, times on sides, clean and minimal.
 */
export function ProgressBar({ position, duration, onSeek }: Props) {
  const progress = duration > 0 ? Math.min(1, position / duration) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.barRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
          <View style={[styles.thumb, { left: `${progress * 100}%` }]} />
        </View>
      </View>
      <View style={styles.times}>
        <Text style={styles.time}>{formatTime(position)}</Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  barRow: {
    height: 20,
    justifyContent: 'center',
  },
  track: {
    height: 3,
    backgroundColor: colors.player.progressTrack,
    borderRadius: 2,
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.player.progressFill,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    top: -4,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginLeft: -5.5,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    ...typography.labelSmall,
    color: colors.textTertiary,
  },
});
