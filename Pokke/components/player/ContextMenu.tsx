import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { GlassView } from '@/components/GlassView';
import { colors, spacing, typography, radius } from '@/theme';

export type ContextAction =
  | 'share'
  | 'download'
  | 'download-app'
  | 'download-device'
  | 'cast'
  | 'add-queue'
  | 'go-artist'
  | 'go-album'
  | 'close';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAction: (action: ContextAction) => void;
  showDownloadSubmenu?: boolean;
  hasAnimatedCover?: boolean;
  onToggleAnimated?: () => void;
  showAnimated?: boolean;
};

const MAIN_ACTIONS: { key: ContextAction; label: string; icon: string }[] = [
  { key: 'cast', label: 'Transmitir', icon: '📺' },
  { key: 'share', label: 'Compartir', icon: '↗' },
  { key: 'download', label: 'Descargar', icon: '↓' },
  { key: 'add-queue', label: 'Añadir a cola', icon: '+' },
  { key: 'go-artist', label: 'Ir al artista', icon: '♪' },
  { key: 'go-album', label: 'Ir al álbum', icon: '◎' },
];

const DOWNLOAD_ACTIONS: { key: ContextAction; label: string; desc: string }[] = [
  {
    key: 'download-app',
    label: 'Dentro de la app',
    desc: 'Lyrics + cover + animated cover (si existe)',
  },
  {
    key: 'download-device',
    label: 'Almacenamiento interno',
    desc: 'Carpeta Pokke (se crea si no existe)',
  },
];

export function ContextMenu({
  visible,
  onClose,
  onAction,
  showDownloadSubmenu = false,
  hasAnimatedCover,
  onToggleAnimated,
  showAnimated,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <GlassView strong style={styles.glass} intensity={60}>
                {!showDownloadSubmenu ? (
                  <>
                    {MAIN_ACTIONS.map((item) => (
                      <Pressable
                        key={item.key}
                        style={styles.row}
                        onPress={() => onAction(item.key)}
                      >
                        <Text style={styles.icon}>{item.icon}</Text>
                        <Text style={styles.label}>{item.label}</Text>
                      </Pressable>
                    ))}
                    {hasAnimatedCover && (
                      <Pressable style={styles.row} onPress={onToggleAnimated}>
                        <Text style={styles.icon}>🎞</Text>
                        <Text style={styles.label}>
                          {showAnimated ? 'Usar cover estático' : 'Usar cover animado'}
                        </Text>
                      </Pressable>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={styles.submenuTitle}>¿Dónde descargar?</Text>
                    {DOWNLOAD_ACTIONS.map((item) => (
                      <Pressable
                        key={item.key}
                        style={styles.row}
                        onPress={() => onAction(item.key)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.label}>{item.label}</Text>
                          <Text style={styles.desc}>{item.desc}</Text>
                        </View>
                      </Pressable>
                    ))}
                    <Pressable style={styles.row} onPress={() => onAction('close')}>
                      <Text style={[styles.label, { color: colors.textTertiary }]}>
                        Cancelar
                      </Text>
                    </Pressable>
                  </>
                )}
              </GlassView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  glass: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  icon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  label: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  desc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  submenuTitle: {
    ...typography.labelMedium,
    color: colors.textTertiary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
