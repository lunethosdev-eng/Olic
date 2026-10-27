import { View, Text, StyleSheet, Switch, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, typography, radius } from '@/theme';
import { GlassView } from '@/components/GlassView';
import { useSettingsStore, ExperimentalFeatures } from '@/stores/settings';

const EXPERIMENTAL_ITEMS: {
  key: keyof ExperimentalFeatures;
  title: string;
  description: string;
}[] = [
  {
    key: 'liquidGlass',
    title: 'Liquid Glass',
    description: 'Efecto de vidrio real (blur + highlights). Puede tener bugs.',
  },
  {
    key: 'listenTogether',
    title: 'Listen Together',
    description: 'Escucha sincronizada con amigos + mini chat.',
  },
  {
    key: 'chats',
    title: 'Chats',
    description: 'Chats individuales, reacciones, fondos y burbujas custom. Añade tab al nav.',
  },
  {
    key: 'stories',
    title: 'Stories',
    description: 'Stories con editor, música, stickers y anillo en el avatar.',
  },
  {
    key: 'map',
    title: 'Mapa',
    description: 'Mapa 3D con ubicación de amigos, rachas y reacciones.',
  },
  {
    key: 'animatedCoversDefault',
    title: 'Covers animados por defecto',
    description: 'Si la canción tiene cover animado, usarlo automáticamente.',
  },
];

export default function SettingsScreen() {
  const { experimental, setExperimental, autoFocusSearch, setAutoFocusSearch } =
    useSettingsStore();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Atrás</Text>
        </Pressable>
        <Text style={styles.title}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>General</Text>
        <GlassView style={styles.group}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.itemTitle}>Auto-focus en Search</Text>
              <Text style={styles.itemDesc}>
                Al abrir Search, el teclado aparece automáticamente.
              </Text>
            </View>
            <Switch
              value={autoFocusSearch}
              onValueChange={setAutoFocusSearch}
              trackColor={{ false: '#333', true: colors.primaryMuted }}
              thumbColor={autoFocusSearch ? colors.primary : '#888'}
            />
          </View>
        </GlassView>

        <Text style={styles.section}>Funciones experimentales</Text>
        <Text style={styles.sectionHint}>
          Pueden tener bugs. Actívalas bajo tu propio riesgo.
        </Text>

        <GlassView style={styles.group}>
          {EXPERIMENTAL_ITEMS.map((item, idx) => (
            <View
              key={item.key}
              style={[
                styles.row,
                idx < EXPERIMENTAL_ITEMS.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
              <Switch
                value={experimental[item.key]}
                onValueChange={(v) => setExperimental(item.key, v)}
                trackColor={{ false: '#333', true: colors.primaryMuted }}
                thumbColor={experimental[item.key] ? colors.primary : '#888'}
              />
            </View>
          ))}
        </GlassView>
      </ScrollView>
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
    gap: spacing.sm,
  },
  back: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  title: {
    ...typography.displaySmall,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 80,
    gap: spacing.md,
  },
  section: {
    ...typography.titleSmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionHint: {
    ...typography.bodySmall,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  group: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  itemDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
