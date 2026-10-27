import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, radius } from '@/theme';
import { GlassView } from '@/components/GlassView';
import { useSettingsStore } from '@/stores/settings';
import { useEffect, useRef } from 'react';

export default function SearchScreen() {
  const autoFocus = useSettingsStore((s) => s.autoFocusSearch);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
        <GlassView style={styles.searchBox} border>
          <TextInput
            ref={inputRef}
            placeholder="Canciones, artistas, playlists…"
            placeholderTextColor={colors.textTertiary}
            style={styles.input}
            autoCorrect={false}
            returnKeyType="search"
          />
        </GlassView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...typography.displaySmall,
    color: colors.textPrimary,
  },
  searchBox: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  input: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
});
