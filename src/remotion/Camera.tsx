import React from 'react';
import {AbsoluteFill} from 'remotion';

export const CameraStage: React.FC<{
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  rotateX?: number;
  rotateY?: number;
  perspective?: number;
  perspectiveOrigin?: string;
  children: React.ReactNode;
}> = ({
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  perspective = 1400,
  perspectiveOrigin = '50% 50%',
  children,
}) => {
  return (
    <AbsoluteFill style={{perspective, perspectiveOrigin, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}rad) rotateY(${rotateY}rad)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
