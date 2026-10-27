// Pokke Design System — Material 3 Expressive base + Liquid Glass tokens
// Liquid Glass / Electric Glass only active when experimental flag is on

export const colors = {
  // Core dark (default)
  background: '#0A0A0A',
  surface: '#141414',
  surfaceElevated: '#1C1C1E',
  surfaceHigh: '#2C2C2E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.72)',
  textTertiary: 'rgba(255,255,255,0.48)',
  textDisabled: 'rgba(255,255,255,0.28)',

  // Accent (subtle, no neon)
  primary: '#E8E8E8',
  primaryMuted: 'rgba(232,232,232,0.18)',
  accent: '#A0A0A0',

  // Semantic
  success: '#34C759',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#64D2FF',

  // Glass (used only when experimental Liquid Glass is enabled)
  glass: {
    background: 'rgba(255,255,255,0.08)',
    backgroundStrong: 'rgba(255,255,255,0.14)',
    border: 'rgba(255,255,255,0.12)',
    borderStrong: 'rgba(255,255,255,0.22)',
    highlight: 'rgba(255,255,255,0.28)',
    shadow: 'rgba(0,0,0,0.45)',
  },

  // Player specific
  player: {
    progressTrack: 'rgba(255,255,255,0.18)',
    progressFill: '#FFFFFF',
    controlBg: 'rgba(255,255,255,0.12)',
  },

  // Stories ring (Instagram-like)
  storyRing: ['#FF7A00', '#FF2D55', '#AF52DE'] as const,

  // TV focus
  tvFocus: 'rgba(255,255,255,0.22)',
  tvFocusBorder: '#FFFFFF',
} as const;

export type ColorToken = typeof colors;
