import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import { colors, spacing, typography } from '@/theme';
import { GlassView } from '@/components/GlassView';
import { fetchTracks } from '@/lib/music';
import { usePlayerStore, type Track } from '@/stores/player';
import { useScrollStore } from '@/stores/scroll';

const AnimatedScrollView = Animated.createAnimatedComponent(
  require('react-native').ScrollView
);

export default function HomeScreen() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { setTrack, setQueue, openFullPlayer } = usePlayerStore();
  const setScrollY = useScrollStore((s) => s.setScrollY);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchTracks(12);
        if (!cancelled) setTracks(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const play = (track: Track) => {
    setQueue(tracks);
    setTrack(track);
    openFullPlayer();
    router.push('/player');
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(e.nativeEvent.contentOffset.y);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AnimatedScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.greeting}>Buenas</Text>
        <Text style={styles.title}>Pokke</Text>

        <GlassView style={styles.card} strong>
          <Text style={styles.cardTitle}>Ahora mismo</Text>
          <Text style={styles.cardBody}>
            Audio real · Karaoke · Descargas · Nav con gota de agua{'\n'}
            GitHub Actions APK listo
          </Text>
        </GlassView>

        <Text style={styles.section}>Recientes</Text>
        {loading ? (
          <ActivityIndicator color={colors.textSecondary} style={{ marginTop: 20 }} />
        ) : (
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
          >
            {tracks.map((t) => (
              <Pressable key={t.id} onPress={() => play(t)} style={styles.cardTrack}>
                {t.cover_url ? (
                  <Image source={{ uri: t.cover_url }} style={styles.cover} />
                ) : (
                  <View style={[styles.cover, styles.coverPh]}>
                    <Text style={{ fontSize: 28 }}>♪</Text>
                  </View>
                )}
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {t.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {t.artist}
                </Text>
              </Pressable>
            ))}
          </Animated.ScrollView>
        )}

        <Text style={styles.section}>Hecho para ti</Text>
        <View style={styles.grid}>
          {tracks.slice(0, 6).map((t) => (
            <Pressable key={t.id + '-g'} onPress={() => play(t)} style={styles.gridItem}>
              {t.cover_url ? (
                <Image source={{ uri: t.cover_url }} style={styles.gridCover} />
              ) : (
                <View style={[styles.gridCover, styles.coverPh]} />
              )}
              <Text style={styles.gridTitle} numberOfLines={1}>
                {t.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </AnimatedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 160,
    gap: spacing.lg,
  },
  greeting: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  title: { ...typography.displayMedium, color: colors.textPrimary },
  card: { padding: spacing.lg, gap: spacing.sm },
  cardTitle: { ...typography.titleMedium, color: colors.textPrimary },
  cardBody: { ...typography.bodyMedium, color: colors.textSecondary },
  section: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  row: { gap: spacing.md, paddingRight: spacing.lg },
  cardTrack: { width: 140, gap: 6 },
  cover: { width: 140, height: 140, borderRadius: 12 },
  coverPh: {
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackTitle: { ...typography.titleSmall, color: colors.textPrimary },
  trackArtist: { ...typography.bodySmall, color: colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { width: '47%', gap: 6 },
  gridCover: { width: '100%', aspectRatio: 1, borderRadius: 12 },
  gridTitle: { ...typography.labelMedium, color: colors.textPrimary },
});
