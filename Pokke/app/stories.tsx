import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { useSettingsStore } from '@/stores/settings';

export default function StoriesScreen() {
  const enabled = useSettingsStore((s) => s.experimental.stories);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Stories</Text>
        <Text style={styles.subtitle}>
          {enabled
            ? 'Anillo gradiente · editor · música · stickers · menciones'
            : 'Activa “Stories” en Funciones experimentales.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, gap: spacing.sm },
  title: { ...typography.displaySmall, color: colors.textPrimary },
  subtitle: { ...typography.bodyMedium, color: colors.textSecondary },
});
