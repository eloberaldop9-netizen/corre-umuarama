import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Easing } from 'remotion';
import { ci } from './motion';
import type { Direction } from './motion';

interface AnimatedTextProps {
  text: string;
  /** Frame global de início da entrada (ignorado se wordDelays for passado). */
  delay?: number;
  /** Delay individual por palavra (frames locais da cena) — usado para sincronia real com o áudio. Tem prioridade sobre `delay`/`stagger`. */
  wordDelays?: number[];
  exitStart?: number;
  exitDirection?: Direction;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
  highlightWords?: number[];
  highlightColor?: string;
  stagger?: number;
  wordDur?: number;
  exitDistance?: number;
}

/** Mandamento 2: PALAVRA POR PALAVRA, nunca linha por linha. */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  wordDelays,
  exitStart = 999999,
  exitDirection = 'left',
  style,
  wordStyle,
  highlightWords = [],
  highlightColor,
  stagger = 3,
  wordDur = 18,
  exitDistance = 1200,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const axis = exitDirection === 'left' || exitDirection === 'right' ? 'X' : 'Y';
  const sign = exitDirection === 'left' || exitDirection === 'top' ? -1 : 1;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', ...style }}>
      {words.map((word, i) => {
        const ws = wordDelays ? wordDelays[i] ?? delay : delay + i * stagger;
        const entryP = ci(frame, [ws, ws + wordDur], [0, 1], Easing.out(Easing.cubic));
        const entryY = ci(frame, [ws, ws + wordDur], [26, 0], Easing.out(Easing.cubic));
        const entryBl = ci(frame, [ws, ws + wordDur * 0.55], [10, 0]);

        const es = exitStart + i * 2;
        const exitP = ci(frame, [es, es + 14], [0, 1], Easing.in(Easing.exp));
        const exitPos = ci(exitP, [0, 1], [0, exitDistance * sign]);
        const exitBl = ci(exitP, [0, 1], [0, 16]);
        const exitOp = ci(exitP, [0.2, 0.8], [1, 0]);
        const exitSc = ci(exitP, [0, 1], [1, 0.96]);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              transform: `translateY(${entryY}px) translate${axis}(${exitPos}px) scale(${exitSc})`,
              opacity: entryP * exitOp,
              filter: `blur(${entryBl + exitBl}px)`,
              color: highlightWords.includes(i) ? highlightColor : undefined,
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
