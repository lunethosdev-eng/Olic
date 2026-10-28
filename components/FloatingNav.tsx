import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, router } from 'expo-router';
import { GlassView } from './GlassView';
import { colors, nav, spacing, typography } from '@/theme';
import { useSettingsStore } from '@/stores/settings';
import { useScrollStore } from '@/stores/scroll';
import { NAV_ICON_MAP } from './NavIcons';

type Tab = {
  key: string;
  label: string;
  route: string;
  icon: string;
};

const BASE_TABS: Tab[] = [
  { key: 'home', label: 'Home', route: '/', icon: '⌂' },
  { key: 'browse', label: 'Browse', route: '/browse', icon: '◎' },
  { key: 'search', label: 'Search', route: '/search', icon: '⌕' },
  { key: 'library', label: 'Library', route: '/library', icon: '☰' },
];

export function FloatingNav() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const chatsEnabled = useSettingsStore((s) => s.experimental.chats);
  const compactProgress = useScrollStore((s) => s.compactProgress);

  const compact = useSharedValue(0);
  const searchDetach = useSharedValue(0); // 0 = attached, 1 = water-drop detached

  useEffect(() => {
    compact.value = withSpring(compactProgress, {
      damping: 18,
      stiffness: 160,
    });
    // Search detaches a bit earlier for the “gota de agua” feel
    searchDetach.value = withSpring(
      compactProgress > 0.35 ? Math.min(1, (compactProgress - 0.35) / 0.4) : 0,
      { damping: 16, stiffness: 140 }
    );
  }, [compactProgress]);

  const tabs = React.useMemo(() => {
    const list = [...BASE_TABS];
    if (chatsEnabled) {
      list.splice(3, 0, {
        key: 'chats',
        label: 'Chats',
        route: '/chats',
        icon: '💬',
      });
    }
    // When compact, hide Browse (4 → 3)
    if (compactProgress > 0.6) {
      return list.filter((t) => t.key !== 'browse');
    }
    return list;
  }, [chatsEnabled, compactProgress]);

  const animatedShell = useAnimatedStyle(() => {
    const height = interpolate(
      compact.value,
      [0, 1],
      [nav.height, nav.heightCompact],
      Extrapolation.CLAMP
    );
    return {
      height,
      borderRadius: interpolate(compact.value, [0, 1], [nav.floatingRadius, 22]),
      transform: [
        {
          scale: interpolate(compact.value, [0, 1], [1, 0.96]),
        },
      ],
    };
  });

  // Water-drop effect: Search tab lifts and separates slightly
  const searchStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(searchDetach.value, [0, 1], [0, -10]),
        },
        {
          scale: interpolate(searchDetach.value, [0, 1], [1, 1.08]),
        },
      ],
      opacity: interpolate(searchDetach.value, [0, 0.5, 1], [1, 0.95, 1]),
    };
  });

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: insets.bottom + (Platform.OS === 'web' ? 16 : 8),
          paddingHorizontal: nav.floatingMargin,
        },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View style={[styles.shell, animatedShell]}>
        <GlassView strong style={styles.glass} intensity={55}>
          <View style={styles.row}>
            {tabs.map((tab) => {
              const active =
                pathname === tab.route ||
                (tab.route !== '/' && pathname.startsWith(tab.route));
              const isSearch = tab.key === 'search';
              const content = (
                <Pressable
                  key={tab.key}
                  onPress={() => router.push(tab.route as any)}
                  style={styles.tab}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <View style={[styles.icon, active && styles.iconActive]}>
                    {(() => { const I = NAV_ICON_MAP[tab.key as keyof typeof NAV_ICON_MAP]; return I ? <I size={22} color={active ? '#fff' : '#888'} /> : null; })()}
                  </View>
                  <Text
                    style={[styles.label, active && styles.labelActive]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
              if (isSearch) {
                return (
                  <Animated.View key={tab.key} style={[{ flex: 1 }, searchStyle]}>
                    {content}
                  </Animated.View>
                );
              }
              return content;
            })}
          </View>
        </GlassView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: 'center',
  },
  shell: {
    width: '100%',
    maxWidth: 420,
    overflow: 'hidden',
  },
  glass: {
    flex: 1,
    borderRadius: nav.floatingRadius,
    paddingHorizontal: spacing.sm,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: 2,
  },
  icon: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  iconActive: {
    color: colors.textPrimary,
  },
  label: {
    ...typography.labelSmall,
    color: colors.textTertiary,
  },
  labelActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
