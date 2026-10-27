import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSettingsStore } from '@/stores/settings';
import { colors, radius } from '@/theme';

type Props = {
  children?: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  strong?: boolean;
  border?: boolean;
};

/**
 * Liquid Glass / Electric Glass surface.
 * Only applies real blur + glass treatment when experimental.liquidGlass is ON.
 * Otherwise falls back to a solid elevated surface (Material 3 style).
 */
export function GlassView({
  children,
  style,
  intensity = 40,
  strong = false,
  border = true,
}: Props) {
  const liquidGlass = useSettingsStore((s) => s.experimental.liquidGlass);

  if (!liquidGlass) {
    return (
      <View
        style={[
          styles.solid,
          strong && styles.solidStrong,
          border && styles.borderSolid,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // Real glass path
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.webGlass,
          strong && styles.webGlassStrong,
          border && styles.borderGlass,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={[
        styles.blur,
        strong && { backgroundColor: colors.glass.backgroundStrong },
        border && styles.borderGlass,
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  solid: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
  },
  solidStrong: {
    backgroundColor: colors.surfaceHigh,
  },
  borderSolid: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  blur: {
    backgroundColor: colors.glass.background,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  borderGlass: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glass.border,
  },
  webGlass: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(24px)',
    // @ts-ignore web only
    WebkitBackdropFilter: 'blur(24px)',
    borderRadius: radius.lg,
  },
  webGlassStrong: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
});
