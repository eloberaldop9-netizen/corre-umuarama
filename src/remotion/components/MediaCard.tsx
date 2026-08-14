import React from 'react';
import {OffthreadVideo} from 'remotion';
import {COLORS} from '../constants';

export const MediaCard: React.FC<{
  src: string;
  startFrom?: number;
  glowOpacity: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({src, startFrom = 0, glowOpacity, size = 800, style}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: 40,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 80px rgba(230,0,11,${glowOpacity})`,
        backgroundColor: COLORS.surfaceDark,
        ...style,
      }}
    >
      <OffthreadVideo
        src={src}
        startFrom={startFrom}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};
