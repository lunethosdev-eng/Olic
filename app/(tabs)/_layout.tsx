import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { FloatingNav } from '@/components/FloatingNav';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { colors } from '@/theme';
import { usePlayerStore } from '@/stores/player';

export default function TabsLayout() {
  const hasTrack = usePlayerStore((s) => !!s.currentTrack);

  return (
    <View style={styles.container}>
      <Slot />
      {hasTrack && <MiniPlayer bottomOffset={88} />}
      <FloatingNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
