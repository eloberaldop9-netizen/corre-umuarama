import React from 'react';
import {interpolate} from 'remotion';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import type {CaptionChunk} from '../captions';

const FADE = 6;

export const Captions: React.FC<{
  chunks: CaptionChunk[];
  frame: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({chunks, frame, fontSize = 46, style}) => {
  const active = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!active) return null;

  const opacity = interpolate(
    frame,
    [active.start, active.start + FADE, active.end - FADE, active.end],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const translateY = interpolate(
    frame,
    [active.start, active.start + FADE],
    [16, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <div
      style={{
        fontFamily: FONT_POPPINS,
        fontWeight: 600,
        fontSize,
        lineHeight: 1.25,
        color: COLORS.textPrimary,
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        textWrap: 'balance' as React.CSSProperties['textWrap'],
        ...style,
      }}
    >
      {active.text}
    </div>
  );
};
