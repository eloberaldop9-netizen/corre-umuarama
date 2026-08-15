import React from 'react';
import {Easing} from 'remotion';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {ci, lerpColor} from '../motion';
import type {CaptionChunk} from '../captions';

const EXIT_WINDOW = 18;
const POP_IN = 11;
const SETTLE = 12;

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
 * Splits words into 1 or 2 visually balanced lines so a caption never ends
 * with a lone orphan word. Short chunks stay on a single line; anything
 * longer than ~5 words (or ~32 characters) is split as evenly as possible.
 */
const splitLines = (words: string[]): string[][] => {
  const totalChars = words.join(' ').length;
  if (words.length <= 5 && totalChars <= 32) return [words];
  const firstLineCount = Math.ceil(words.length / 2);
  return [words.slice(0, firstLineCount), words.slice(firstLineCount)];
};

/**
 * Karaoke-style dynamic subtitle: the word being spoken pops in white with a
 * glow; once it's done, it eases smoothly (not an instant snap) into the
 * trail state — smaller, gray, no glow. Persistent/flash keyword maps let
 * specific words (IPTV, V10net, Wi-Fi...) override that trail behaviour.
 * Word timing is weighted by each word's character length within the
 * chunk's own measured speech window, so pacing tracks the real voiceover
 * better than a flat even split.
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
}) => {
  const active = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!active) return null;

  const words = active.text.split(' ');
  const n = words.length;
  const holdEnd = active.end - EXIT_WINDOW;
  const span = Math.max(holdEnd - active.start, n * 4);

  // Weight each word's on-screen time by its character length, so longer
  // words (which take longer to say) get proportionally more time than a
  // flat per-word split — a closer approximation of real speech pacing.
  const weights = words.map((w) => Math.max(w.length, 2));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const wordStarts: number[] = [];
  let acc = 0;
  for (let i = 0; i < n; i++) {
    wordStarts.push(active.start + (acc / totalWeight) * span);
    acc += weights[i];
  }
  const wordEndOf = (i: number) => (i < n - 1 ? wordStarts[i + 1] : holdEnd);

  const lines = splitLines(words);
  let wordIndex = 0;
  const {justifyContent = 'center', ...restStyle} = style ?? {};

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: justifyContent === 'flex-start' ? 'flex-start' : 'center',
        gap: '0.15em',
        fontFamily: FONT_POPPINS,
        fontWeight: 600,
        fontSize,
        lineHeight: 1.3,
        ...restStyle,
      }}
    >
      {lines.map((line, lineIndex) => (
        <div
          key={lineIndex}
          style={{display: 'flex', flexWrap: 'nowrap', gap: '0.38em', justifyContent}}
        >
          {line.map((word) => {
            const i = wordIndex++;
            const wordStart = wordStarts[i];
            const wordEnd = wordEndOf(i);
            const key = clean(word);

            const isPersistent = key in persistentHighlights;
            const isFlash = key in flashHighlights;
            const overrideColor = wordColorOverrides?.[key];

            // Continuous pop-in (0->1) then a smooth settle (0->1) into the trail state.
            const popIn = ci(frame, [wordStart, wordStart + POP_IN], [0, 1], Easing.out(Easing.cubic));
            const settle = ci(frame, [wordEnd, wordEnd + SETTLE], [0, 1], Easing.inOut(Easing.cubic));

            const activeHue =
              overrideColor ??
              (isPersistent ? persistentHighlights[key] : isFlash ? flashHighlights[key] : activeColor);
            const trailHue = isPersistent ? activeHue : trailColor;
            const color = lerpColor(settle, activeHue, trailHue);

            const scale = 1 + 0.09 * popIn * (1 - settle * 0.85);
            const translateY = ci(frame, [wordStart, wordStart + POP_IN], [14, 0], Easing.out(Easing.cubic));
            const glowAlpha = Math.round((1 - settle) * popIn * 130)
              .toString(16)
              .padStart(2, '0');

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
                  opacity: popIn * exitOpacity,
                  transform: `translateY(${translateY + exitY}px) scale(${scale * exitScale})`,
                  filter: `blur(${exitBlur}px)`,
                  color,
                  fontWeight: isPersistent || isFlash || overrideColor ? 800 : 600,
                  textShadow: glowAlpha === '00' ? 'none' : `0 0 10px ${activeHue}${glowAlpha}`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
