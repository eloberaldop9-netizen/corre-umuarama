import React from 'react';
import {AbsoluteFill} from 'remotion';

export const CameraStage: React.FC<{
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotateX?: number;
  perspective?: number;
  children: React.ReactNode;
}> = ({
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  perspective = 1400,
  children,
}) => {
  return (
    <AbsoluteFill
      style={{perspective, perspectiveOrigin: '50% 50%', overflow: 'hidden'}}
    >
      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}rad)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
