import React from 'react';
import {Easing, random} from 'remotion';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {ci} from '../motion';
import type {CaptionChunk} from '../captions';

const EXIT_WINDOW = 18;

// Keywords that stay vividly colored forever once spoken (never fall to trail gray).
const DEFAULT_PERSISTENT: Record<string, string> = {
  iptv: COLORS.brandRed,
  v10: COLORS.brandRed,
  net: COLORS.brandRed,
  internet: COLORS.brandRed,
};

// Keywords that flash their own accent color while active, then fall to trail gray like normal words.
const DEFAULT_FLASH: Record<string, string> = {
  'wi-fi': COLORS.success,
  wifi: COLORS.success,
  youtube: '#FF3B3B',
  instagram: '#C13584',
};

const clean = (word: string) => word.toLowerCase().replace(/[^a-zà-ú0-9-]/gi, '');

/**
 * Karaoke-style dynamic subtitle: the word being spoken pops to scale 1.1 in
 * the active color with a glow; once the next word starts, it snaps
 * instantly to the trail state (smaller, gray). Persistent/flash keyword
 * maps let specific words (IPTV, V10net, Wi-Fi...) override that trail
 * behaviour. Word timing is spread evenly across the chunk's own measured
 * speech window, so pacing tracks the real voiceover.
 */
export const DynamicSubtitle: React.FC<{
  chunks: CaptionChunk[];
  frame: number;
  fontSize?: number;
  style?: React.CSSProperties;
  activeColor?: string;
  trailColor?: string;
  persistentHighlights?: Record<string, string>;
  flashHighlights?: Record<string, string>;
  wordColorOverrides?: Record<string, string>;
  seed?: string;
}> = ({
  chunks,
  frame,
  fontSize = 46,
  style,
  activeColor = COLORS.textPrimary,
  trailColor = COLORS.trailGray,
  persistentHighlights = DEFAULT_PERSISTENT,
  flashHighlights = DEFAULT_FLASH,
  wordColorOverrides,
  seed = 'dsub',
}) => {
  const active = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!active) return null;

  const words = active.text.split(' ');
  const n = words.length;
  const holdEnd = active.end - EXIT_WINDOW;
  const span = Math.max(holdEnd - active.start, n * 4);
  const stagger = span / n;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.3em',
        fontFamily: FONT_POPPINS,
        fontWeight: 600,
        fontSize,
        lineHeight: 1.3,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordStart = active.start + i * stagger;
        const wordEnd = i < n - 1 ? active.start + (i + 1) * stagger : holdEnd;
        const key = clean(word);

        const isPersistent = key in persistentHighlights;
        const isFlash = key in flashHighlights;
        const overrideColor = wordColorOverrides?.[key];

        const isPending = frame < wordStart;
        const isActive = frame >= wordStart && frame < wordEnd;

        // Quick pop on arrival, instant snap to trail once the next word starts.
        const popP = ci(frame, [wordStart, wordStart + 5], [0, 1], Easing.out(Easing.cubic));
        const scale = isPending ? 0.9 : isActive ? 1 + popP * 0.1 : 1;
        const opacity = isPending ? 0 : 1;

        let color: string = trailColor;
        let glow = 'none';
        let weight = 600;

        if (overrideColor) {
          color = overrideColor;
          weight = 800;
          glow = isActive ? `0 0 10px ${overrideColor}aa` : 'none';
        } else if (isPersistent) {
          color = persistentHighlights[key];
          weight = 800;
          glow = isActive ? `0 0 10px ${persistentHighlights[key]}aa` : 'none';
        } else if (isFlash && isActive) {
          color = flashHighlights[key];
          weight = 800;
          glow = `0 0 10px ${flashHighlights[key]}aa`;
        } else if (isActive) {
          color = activeColor;
          weight = 700;
          glow = `0 0 8px ${COLORS.brandRed}88`;
        }

        // Tiny deterministic jitter so the "landing" of each word doesn't feel robotic.
        const jitter = isActive ? (random(`${seed}-${i}`) - 0.5) * 2 : 0;

        // Whole-line exit near the chunk's end (quadruple exit, staggered).
        const exitStart = active.end - EXIT_WINDOW + (i * EXIT_WINDOW) / n;
        const exitP = ci(frame, [exitStart, active.end], [0, 1], Easing.in(Easing.exp));
        const exitY = ci(exitP, [0, 1], [0, -24]);
        const exitBlur = ci(exitP, [0, 1], [0, 14]);
        const exitScale = ci(exitP, [0, 1], [1, 0.94]);
        const exitOpacity = ci(exitP, [0.3, 1], [1, 0]);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: opacity * exitOpacity,
              transform: `translateY(${exitY + jitter}px) scale(${scale * exitScale})`,
              filter: `blur(${exitBlur}px)`,
              color,
              fontWeight: weight,
              textShadow: glow,
              transition: 'none',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
