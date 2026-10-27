import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui',
});

export const typography = {
  // Display (large titles, player song name)
  displayLarge: {
    fontFamily,
    fontSize: 34,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.25,
    lineHeight: 40,
  },
  displayMedium: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: 0.15,
    lineHeight: 34,
  },
  displaySmall: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
    lineHeight: 28,
  },

  // Titles
  titleLarge: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.15,
    lineHeight: 26,
  },
  titleMedium: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
    lineHeight: 22,
  },
  titleSmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
    lineHeight: 20,
  },

  // Body
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0.4,
    lineHeight: 16,
  },

  // Labels / buttons
  labelLarge: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily,
    fontSize: 11,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0.5,
    lineHeight: 14,
  },
} as const;
