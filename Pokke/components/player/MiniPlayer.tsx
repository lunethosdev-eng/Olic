import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { GlassView } from '@/components/GlassView';
import { usePlayerStore } from '@/stores/player';
import { colors, spacing, typography, radius } from '@/theme';

type Props = {
  bottomOffset?: number;
};

export function MiniPlayer({ bottomOffset = 80 }: Props) {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    openFullPlayer,
    showAnimatedCover,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const coverUri =
    showAnimatedCover && currentTrack.animated_cover_url
      ? currentTrack.animated_cover_url
      : currentTrack.cover_url;

  return (
    <Pressable
      onPress={openFullPlayer}
      style={[styles.wrapper, { bottom: bottomOffset }]}
    >
      <GlassView strong style={styles.bar} intensity={50}>
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.coverPh]}>
            <Text style={{ fontSize: 16 }}>♪</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
        <Pressable
          onPress={(e) => {
            e.stopPropagation?.();
            togglePlay();
          }}
          style={styles.play}
          hitSlop={10}
        >
          <Text style={styles.playIcon}>{isPlaying ? '❚❚' : '▶'}</Text>
        </Pressable>
      </GlassView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 90,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  coverPh: {
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },
  artist: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  play: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 18,
    color: colors.textPrimary,
  },
});
