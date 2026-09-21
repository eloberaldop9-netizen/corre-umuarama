import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Easing } from 'remotion';
import { ci } from './motion';
import type { Direction } from './motion';

interface AnimatedTextProps {
  text: string;
  delay?: number;
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
  exitStart = 999999,
  exitDirection = 'left',
  style,
  wordStyle,
  highlightWords = [],
  highlightColor = '#D92D20',
  stagger = 3,
  wordDur = 22,
  exitDistance = 1200,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const axis = exitDirection === 'left' || exitDirection === 'right' ? 'X' : 'Y';
  const sign = exitDirection === 'left' || exitDirection === 'top' ? -1 : 1;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', ...style }}>
      {words.map((word, i) => {
        const ws = delay + i * stagger;
        const entryP = ci(frame, [ws, ws + wordDur], [0, 1], Easing.out(Easing.cubic));
        const entryY = ci(frame, [ws, ws + wordDur], [40, 0], Easing.out(Easing.cubic));
        const entryBl = ci(frame, [ws, ws + wordDur * 0.55], [12, 0]);

        const es = exitStart + i * 2;
        const exitP = ci(frame, [es, es + 14], [0, 1], Easing.in(Easing.exp));
        const exitPos = ci(exitP, [0, 1], [0, exitDistance * sign]);
        const exitBl = ci(exitP, [0, 1], [0, 20]);
        const exitOp = ci(exitP, [0.2, 0.8], [1, 0]);
        const exitSc = ci(exitP, [0, 1], [1, 0.95]);

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
