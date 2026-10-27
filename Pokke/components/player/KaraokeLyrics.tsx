import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type Line = {
  time: number; // seconds
  text: string;
};

function parseLyrics(raw?: string | null): Line[] {
  if (!raw) return [];
  const lines: Line[] = [];
  const re = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const min = parseInt(m[1], 10);
    const sec = parseInt(m[2], 10);
    const ms = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) : 0;
    const time = min * 60 + sec + ms / 1000;
    const text = m[4].trim();
    if (text) lines.push({ time, text });
  }
  // fallback: plain text
  if (lines.length === 0) {
    return raw
      .split('\n')
      .map((t, i) => ({ time: i * 4, text: t.trim() }))
      .filter((l) => l.text);
  }
  return lines.sort((a, b) => a.time - b.time);
}

type Props = {
  lyricsText?: string | null;
  position: number; // current seconds
  expanded?: boolean;
};

export function KaraokeLyrics({ lyricsText, position, expanded }: Props) {
  const lines = useMemo(() => parseLyrics(lyricsText), [lyricsText]);
  const scrollRef = useRef<ScrollView>(null);
  const activeIndex = useMemo(() => {
    if (lines.length === 0) return -1;
    let idx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= position) idx = i;
      else break;
    }
    return idx;
  }, [lines, position]);

  useEffect(() => {
    if (!expanded || activeIndex < 0 || !scrollRef.current) return;
    // Auto-scroll so active line stays near center
    scrollRef.current.scrollTo({
      y: Math.max(0, activeIndex * 36 - 80),
      animated: true,
    });
  }, [activeIndex, expanded]);

  if (lines.length === 0) {
    return (
      <Text style={styles.empty}>
        Letras no disponibles{'\n'}Powered by Pokke
      </Text>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={expanded ? styles.expanded : styles.collapsed}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {lines.map((line, i) => {
        const active = i === activeIndex;
        const past = i < activeIndex;
        return (
          <Text
            key={`${line.time}-${i}`}
            style={[
              styles.line,
              active && styles.lineActive,
              past && styles.linePast,
            ]}
          >
            {line.text}
          </Text>
        );
      })}
      <Text style={styles.powered}>Powered by Pokke</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  collapsed: {
    maxHeight: 100,
  },
  expanded: {
    maxHeight: 320,
  },
  line: {
    ...typography.bodyLarge,
    color: colors.textTertiary,
    lineHeight: 36,
    textAlign: 'center',
  },
  lineActive: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 18,
  },
  linePast: {
    color: colors.textSecondary,
  },
  empty: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  powered: {
    ...typography.labelSmall,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
