import React from 'react';
import { Easing, Img, staticFile } from 'remotion';
import { ci } from '../lib/animation';

interface SakuraBranchProps {
  frame: number;
  start: number;
  corner: 'top-left' | 'top-right';
  width?: number;
  dur?: number;
  opacity?: number;
}

/** Galho de sakura oficial (asset do manual), revelado por máscara diagonal. */
export const SakuraBranch: React.FC<SakuraBranchProps> = ({
  frame,
  start,
  corner,
  width = 340,
  dur = 34,
  opacity = 1,
}) => {
  const p = ci(frame, [start, start + dur], [0, 1], Easing.out(Easing.cubic));
  const isLeft = corner === 'top-left';
  const src = isLeft ? 'sakura/branch-01.png' : 'sakura/branch-02.png';

  return (
    <div
      style={{
        position: 'absolute',
        top: -width * 0.06,
        [isLeft ? 'left' : 'right']: -width * 0.08,
        width,
        opacity: opacity * ci(frame, [start, start + 10], [0, 1]),
        clipPath: isLeft
          ? `polygon(0 0, ${p * 100}% 0, 0 ${p * 100}%)`
          : `polygon(100% 0, ${100 - p * 100}% 0, 100% ${p * 100}%)`,
        filter: `blur(${ci(frame, [start, start + dur * 0.6], [4, 0])}px)`,
      }}
    >
      <Img src={staticFile(src)} style={{ width: '100%', display: 'block' }} />
    </div>
  );
};
