import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AVPlaybackStatus } from 'expo-av';
import { GlassView } from '@/components/GlassView';
import { ProgressBar } from './ProgressBar';
import { PlayerControls } from './PlayerControls';
import { ContextMenu, ContextAction } from './ContextMenu';
import { KaraokeLyrics } from './KaraokeLyrics';
import { usePlayerStore } from '@/stores/player';
import { loadAndPlay, pause, play, seekTo, setupAudio } from '@/lib/audio';
import { downloadTrack } from '@/lib/download';
import { colors, spacing, typography, radius } from '@/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const COVER_SIZE = Math.min(SCREEN_W - 64, 340);

export function FullPlayer() {
  const insets = useSafeAreaInsets();
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    shuffle,
    repeat,
    showAnimatedCover,
    isLyricsExpanded,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    cycleRepeat,
    setShowAnimatedCover,
    closeFullPlayer,
    toggleLyrics,
    seek,
  } = usePlayerStore();

  const [menuVisible, setMenuVisible] = useState(false);
  const [downloadSub, setDownloadSub] = useState(false);

  const onStatus = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      const pos = (status.positionMillis ?? 0) / 1000;
      const dur = (status.durationMillis ?? 0) / 1000;
      usePlayerStore.setState({
        position: pos,
        duration: dur || currentTrack?.duration_seconds || 0,
        isPlaying: status.isPlaying,
      });
      if (status.didJustFinish) next();
    },
    [currentTrack, next]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!currentTrack) return;
      await setupAudio();
      try {
        await loadAndPlay(currentTrack, onStatus);
        if (!cancelled) usePlayerStore.setState({ isPlaying: true });
      } catch (e) {
        console.warn(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentTrack?.id]);

  useEffect(() => {
    if (!currentTrack) return;
    if (isPlaying) play().catch(() => {});
    else pause().catch(() => {});
  }, [isPlaying]);

  if (!currentTrack) return null;

  const coverUri =
    showAnimatedCover && currentTrack.animated_cover_url
      ? currentTrack.animated_cover_url
      : currentTrack.cover_url;

  const handleSeek = async (seconds: number) => {
    seek(seconds);
    await seekTo(seconds);
  };

  const handleAction = async (action: ContextAction) => {
    if (action === 'download') {
      setDownloadSub(true);
      return;
    }
    if (action === 'download-app' || action === 'download-device') {
      const target = action === 'download-app' ? 'app' : 'device';
      const result = await downloadTrack(currentTrack, target);
      setDownloadSub(false);
      setMenuVisible(false);
      if (result.success) {
        Alert.alert(
          'Descarga lista',
          target === 'app'
            ? 'Guardado en carpeta Pokke (app)'
            : 'Guardado en almacenamiento / álbum Pokke'
        );
      } else {
        Alert.alert('Error', result.error ?? 'No se pudo descargar');
      }
      return;
    }
    if (action === 'close') {
      setDownloadSub(false);
      setMenuVisible(false);
      return;
    }
    setMenuVisible(false);
    setDownloadSub(false);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.topBar}>
        <Pressable onPress={closeFullPlayer} hitSlop={12} style={styles.topBtn}>
          <Text style={styles.chevron}>˅</Text>
        </Pressable>
        <View style={styles.topCenter}>
          <Text style={styles.nowPlaying}>Reproduciendo</Text>
          <Text style={styles.topTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            setDownloadSub(false);
            setMenuVisible(true);
          }}
          hitSlop={12}
          style={styles.topBtn}
        >
          <Text style={styles.dots}>•••</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coverWrap}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.cover} />
          ) : (
            <View style={[styles.cover, styles.coverPlaceholder]}>
              <Text style={{ fontSize: 48 }}>♪</Text>
            </View>
          )}
          {currentTrack.animated_cover_url && (
            <Pressable
              style={styles.animatedToggle}
              onPress={() => setShowAnimatedCover(!showAnimatedCover)}
            >
              <Text style={styles.animatedToggleText}>
                {showAnimatedCover ? 'Estático' : 'Animado'}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.songTitle} numberOfLines={2}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        <View style={styles.progressWrap}>
          <ProgressBar
            position={position}
            duration={duration || currentTrack.duration_seconds}
            onSeek={handleSeek}
          />
        </View>

        <View style={styles.controlsWrap}>
          <PlayerControls
            isPlaying={isPlaying}
            shuffle={shuffle}
            repeat={repeat}
            onTogglePlay={togglePlay}
            onNext={next}
            onPrev={prev}
            onToggleShuffle={toggleShuffle}
            onCycleRepeat={cycleRepeat}
          />
        </View>

        <Pressable onPress={toggleLyrics}>
          <GlassView style={styles.lyricsBox} strong>
            <Text style={styles.lyricsHeader}>Letras · Karaoke</Text>
            <KaraokeLyrics
              lyricsText={currentTrack.lyrics_text}
              position={position}
              expanded={isLyricsExpanded}
            />
            {!isLyricsExpanded && (
              <Text style={styles.expandHint}>Toca para expandir</Text>
            )}
          </GlassView>
        </Pressable>
      </ScrollView>

      <ContextMenu
        visible={menuVisible}
        onClose={() => {
          setMenuVisible(false);
          setDownloadSub(false);
        }}
        onAction={handleAction}
        showDownloadSubmenu={downloadSub}
        hasAnimatedCover={!!currentTrack.animated_cover_url}
        showAnimated={showAnimatedCover}
        onToggleAnimated={() => setShowAnimatedCover(!showAnimatedCover)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  topBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  chevron: { fontSize: 28, color: colors.textSecondary, fontWeight: '300' },
  dots: { fontSize: 22, color: colors.textPrimary, letterSpacing: 1 },
  topCenter: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.sm },
  nowPlaying: {
    ...typography.labelSmall,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  topTitle: { ...typography.labelMedium, color: colors.textSecondary, marginTop: 2 },
  scroll: { paddingHorizontal: spacing.xl, alignItems: 'center', gap: spacing.lg },
  coverWrap: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  cover: { width: '100%', height: '100%' },
  coverPlaceholder: {
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedToggle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  animatedToggleText: { ...typography.labelSmall, color: '#fff' },
  info: { width: '100%', alignItems: 'center', gap: 4 },
  songTitle: { ...typography.displaySmall, color: colors.textPrimary, textAlign: 'center' },
  artist: { ...typography.bodyLarge, color: colors.textSecondary },
  progressWrap: { width: '100%', marginTop: spacing.sm },
  controlsWrap: { width: '100%', marginTop: spacing.sm },
  lyricsBox: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: radius.xl,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  lyricsHeader: {
    ...typography.labelMedium,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  expandHint: { ...typography.labelSmall, color: colors.textTertiary, marginTop: 4 },
});
