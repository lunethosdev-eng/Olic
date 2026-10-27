import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

type Props = {
  isPlaying: boolean;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
};

export function PlayerControls({
  isPlaying,
  shuffle,
  repeat,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleShuffle,
  onCycleRepeat,
}: Props) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onToggleShuffle} style={styles.sideBtn} hitSlop={12}>
        <Text style={[styles.icon, shuffle && styles.active]}>⇄</Text>
      </Pressable>

      <Pressable onPress={onPrev} style={styles.sideBtn} hitSlop={12}>
        <Text style={styles.icon}>⏮</Text>
      </Pressable>

      <Pressable onPress={onTogglePlay} style={styles.playBtn} hitSlop={8}>
        <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
      </Pressable>

      <Pressable onPress={onNext} style={styles.sideBtn} hitSlop={12}>
        <Text style={styles.icon}>⏭</Text>
      </Pressable>

      <Pressable onPress={onCycleRepeat} style={styles.sideBtn} hitSlop={12}>
        <Text style={[styles.icon, repeat !== 'off' && styles.active]}>
          {repeat === 'one' ? '🔂' : '🔁'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  sideBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    color: colors.textSecondary,
  },
  active: {
    color: colors.textPrimary,
  },
  playIcon: {
    fontSize: 26,
    color: '#000000',
    marginLeft: 2,
  },
});
