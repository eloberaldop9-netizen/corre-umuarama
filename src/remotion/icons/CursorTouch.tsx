import React from 'react';

export const CursorTouch: React.FC<{
  size?: number;
  scale?: number;
  opacity?: number;
}> = ({size = 60, scale = 1, opacity = 0.6}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: '#FFFFFF',
      opacity,
      transform: `scale(${scale})`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    }}
  />
);

export const CursorRipple: React.FC<{
  size?: number;
  scale: number;
  opacity: number;
}> = ({size = 60, scale, opacity}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      width: size,
      height: size,
      borderRadius: '50%',
      border: '2px solid #FFFFFF',
      opacity,
      transform: `scale(${scale})`,
    }}
  />
);
