import React from 'react';
import { Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/animation';

interface AnimatedTextProps {
  text: string;
  delay?: number;
  exitStart?: number;
  exitDirection?: 'left' | 'right' | 'top' | 'bottom';
  style?: React.CSSProperties;
  stagger?: number;
  wordDur?: number;
  mode?: 'rise' | 'mask';
  color?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Tipografia cinética palavra por palavra (nunca linha inteira).
 * mode="rise": sobe com blur, entrada padrão de kinetic typography.
 * mode="mask": revelada por máscara horizontal + tracking amplo -> compacto,
 * usada nos momentos de suspense/pincel.
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  exitStart = 999999,
  exitDirection = 'top',
  style,
  stagger = 3,
  wordDur = 24,
  mode = 'rise',
  color,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const axis = exitDirection === 'left' || exitDirection === 'right' ? 'X' : 'Y';
  const sign = exitDirection === 'left' || exitDirection === 'top' ? -1 : 1;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.3em',
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        color,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const ws = delay + i * stagger;
        const entryP = ci(frame, [ws, ws + wordDur], [0, 1], Easing.out(Easing.cubic));

        const es = exitStart + i * 2;
        const exitP = ci(frame, [es, es + 14], [0, 1], Easing.in(Easing.exp));
        const exitPos = exitP * 700 * sign;
        const exitBlur = exitP * 18;
        const exitOpacity = ci(exitP, [0.2, 0.85], [1, 0]);
        const exitScale = 1 - exitP * 0.05;

        if (mode === 'mask') {
          const maskP = ci(frame, [ws, ws + wordDur], [0, 100], Easing.out(Easing.cubic));
          const tracking = ci(frame, [ws, ws + wordDur], [0.18, 0], Easing.out(Easing.cubic));
          const entryBlur = ci(frame, [ws, ws + wordDur * 0.5], [8, 0]);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                overflow: 'visible',
                clipPath: `inset(0 ${100 - maskP}% 0 0)`,
                letterSpacing: `${tracking}em`,
                filter: `blur(${entryBlur + exitBlur}px)`,
                opacity: exitOpacity,
                transform: `translate${axis}(${exitPos}px) scale(${exitScale})`,
              }}
            >
              {word}
            </span>
          );
        }

        const entryY = ci(frame, [ws, ws + wordDur], [42, 0], Easing.out(Easing.cubic));
        const entryBlur = ci(frame, [ws, ws + wordDur * 0.55], [12, 0]);

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: entryP * exitOpacity,
              filter: `blur(${entryBlur + exitBlur}px)`,
              transform: `translateY(${entryY}px) translate${axis}(${exitPos}px) scale(${exitScale})`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
