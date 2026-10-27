import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, radius } from '@/theme';
import { GlassView } from '@/components/GlassView';
import { useSettingsStore } from '@/stores/settings';

const DEMO = [
  { id: '1', name: 'Alex', last: '¿Escuchaste la nueva de Laufey?', time: '12:40' },
  { id: '2', name: 'María', last: 'Listen Together en 5 min', time: 'Ayer' },
];

export default function ChatsScreen() {
  const enabled = useSettingsStore((s) => s.experimental.chats);

  if (!enabled) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Chats</Text>
          <Text style={styles.subtitle}>
            Activa “Chats” en Ajustes → Funciones experimentales.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <Text style={styles.subtitle}>Individuales · reacciones · fondos · burbujas custom</Text>
      </View>
      <FlatList
        data={DEMO}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        renderItem={({ item }) => (
          <GlassView style={styles.row}>
            <View style={styles.avatar}>
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.last} numberOfLines={1}>{item.last}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </GlassView>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.sm },
  title: { ...typography.displaySmall, color: colors.textPrimary },
  subtitle: { ...typography.bodyMedium, color: colors.textSecondary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { ...typography.titleMedium, color: colors.textPrimary },
  last: { ...typography.bodySmall, color: colors.textSecondary },
  time: { ...typography.labelSmall, color: colors.textTertiary },
});
