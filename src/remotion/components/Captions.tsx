import React from 'react';
import {Easing} from 'remotion';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {ci} from '../motion';
import type {CaptionChunk} from '../captions';

const EXIT_WINDOW = 18;
const DEFAULT_HIGHLIGHTS = ['internet', 'iptv', 'v10', 'net', 'wi-fi', 'wifi'];

const isHighlighted = (word: string, highlights: string[]) => {
  const clean = word.toLowerCase().replace(/[^a-zà-ú0-9-]/gi, '');
  return highlights.some((h) => clean.includes(h));
};

/**
 * Word-by-word caption: each word of the active chunk streams in, spread
 * across the chunk's real speech window (so pacing tracks the voiceover),
 * then the whole line exits in a fast staggered sweep right before the
 * chunk's end (which is the measured end of that spoken phrase).
 */
export const Captions: React.FC<{
  chunks: CaptionChunk[];
  frame: number;
  fontSize?: number;
  style?: React.CSSProperties;
  highlightColor?: string;
  highlights?: string[];
}> = ({
  chunks,
  frame,
  fontSize = 46,
  style,
  highlightColor = COLORS.brandRed,
  highlights = DEFAULT_HIGHLIGHTS,
}) => {
  const active = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!active) return null;

  const words = active.text.split(' ');
  const n = words.length;
  const holdEnd = active.end - EXIT_WINDOW;
  const entrySpan = Math.max(holdEnd - active.start, n * 4);
  const entryStagger = entrySpan / n;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.28em',
        fontFamily: FONT_POPPINS,
        fontWeight: 600,
        fontSize,
        lineHeight: 1.25,
        color: COLORS.textPrimary,
        textAlign: 'center',
        ...style,
      }}
    >
      {words.map((word, i) => {
        const appear = active.start + i * entryStagger;
        const wordDur = Math.min(14, Math.max(6, entryStagger * 0.9));
        const entryP = ci(frame, [appear, appear + wordDur], [0, 1], Easing.out(Easing.cubic));
        const entryY = ci(frame, [appear, appear + wordDur], [34, 0], Easing.out(Easing.cubic));
        const entryBlur = ci(frame, [appear, appear + wordDur * 0.6], [12, 0]);

        const exitStart = active.end - EXIT_WINDOW + (i * EXIT_WINDOW) / n;
        const exitP = ci(frame, [exitStart, active.end], [0, 1], Easing.in(Easing.exp));
        const exitY = ci(exitP, [0, 1], [0, -26]);
        const exitBlur = ci(exitP, [0, 1], [0, 16]);
        const exitScale = ci(exitP, [0, 1], [1, 0.94]);
        const exitOpacity = ci(exitP, [0.25, 1], [1, 0]);

        const highlighted = isHighlighted(word, highlights);
        const highlightPop = highlighted
          ? ci(frame, [appear, appear + wordDur + 6], [1.32, 1], Easing.out(Easing.back(1.8)))
          : 1;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${entryY + exitY}px) scale(${exitScale * highlightPop})`,
              opacity: entryP * exitOpacity,
              filter: `blur(${entryBlur + exitBlur}px)`,
              color: highlighted ? highlightColor : 'inherit',
              fontWeight: highlighted ? 800 : 600,
              textShadow: highlighted ? `0 0 24px ${highlightColor}88` : 'none',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
