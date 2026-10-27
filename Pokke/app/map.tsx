import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';
import { useSettingsStore } from '@/stores/settings';

export default function MapScreen() {
  const enabled = useSettingsStore((s) => s.experimental.map);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa</Text>
        <Text style={styles.subtitle}>
          {enabled
            ? 'Mapa 3D · amigos · rachas · batería · reacciones (próximamente con Mapbox/Google)'
            : 'Activa “Mapa” en Funciones experimentales.'}
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
