export * from './colors';
export * from './typography';
export * from './spacing';

import { colors } from './colors';
import { typography } from './typography';
import { spacing, radius, nav } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  nav,
} as const;

export type Theme = typeof theme;
