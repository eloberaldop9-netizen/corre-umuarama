import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, SPRING } from './motion';

/** Palavra/lettering que entra no frame exato da fala: sobe + desfoca → foca (padrão do vídeo "A Causa"). */
export const WordIn: React.FC<{ at: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: SPRING.text, delay: at });
  return (
    <span
      style={{
        display: 'inline-block',
        transform: `translateY(${ci(sp, [0, 1], [40, 0])}px)`,
        filter: `blur(${ci(frame - at, [0, 16], [12, 0])}px)`,
        opacity: ci(frame, [at, at + 14], [0, 1]),
        ...style,
      }}
    >
      {children}
    </span>
  );
};
