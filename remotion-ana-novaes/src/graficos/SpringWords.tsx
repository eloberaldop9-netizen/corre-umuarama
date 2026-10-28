import React, { CSSProperties } from 'react';
import { Easing, interpolate, spring, SpringConfig, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../lib/motion';

export interface WordMotion {
  x?: number;
  y?: number;
  z?: number;
  /** Escala absoluta no início da entrada / no fim da saída. */
  scale?: number;
  blur?: number;
}

interface SpringWordsProps {
  text: string;
  /** Frame local (da Sequence) em que a primeira palavra começa. */
  start: number;
  /** Frames entre palavras — regra 5: `frame - index * 4`. */
  stagger?: number;
  config?: Partial<SpringConfig>;
  /** Quando o roteiro pede uma curva bezier em vez de spring. */
  ease?: { dur: number; fn: (t: number) => number };
  from?: WordMotion;
  exit?: WordMotion & { start: number; stagger?: number; dur?: number };
  style?: CSSProperties;
  wordStyle?: CSSProperties;
}

/**
 * Texto palavra por palavra. Cada palavra é uma folha 3D (translate3d), então o
 * componente funciona tanto em layout flat quanto dentro de um pai com
 * `perspective` + `preserve-3d`.
 */
export const SpringWords: React.FC<SpringWordsProps> = ({
  text,
  start,
  stagger = 4,
  config = { damping: 14, mass: 0.8 },
  ease,
  from = {},
  exit,
  style,
  wordStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: '0.28em',
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {words.map((word, i) => {
        const local = frame - start - i * stagger;
        const p = ease
          ? ci(local, [0, ease.dur], [0, 1], ease.fn)
          : local < 0
            ? 0
            : spring({ frame: local, fps, config });
        const inv = 1 - p;

        let x = (from.x ?? 0) * inv;
        let y = (from.y ?? 0) * inv;
        let z = (from.z ?? 0) * inv;
        let scale = interpolate(p, [0, 1], [from.scale ?? 1, 1]);
        let blur = Math.max(0, (from.blur ?? 0) * inv);
        let opacity = ci(local, [0, ease ? ease.dur * 0.5 : 10], [0, 1]);

        if (exit) {
          const es = exit.start + i * (exit.stagger ?? 2);
          const e = ci(frame, [es, es + (exit.dur ?? 16)], [0, 1], Easing.in(Easing.exp));
          x += (exit.x ?? 0) * e;
          y += (exit.y ?? 0) * e;
          z += (exit.z ?? 0) * e;
          scale *= interpolate(e, [0, 1], [1, exit.scale ?? 1]);
          blur += (exit.blur ?? 0) * e;
          opacity *= ci(e, [0.35, 1], [1, 0]);
        }

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
              filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
              opacity,
              ...wordStyle,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
