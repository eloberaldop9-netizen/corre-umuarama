import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {COLORS} from '../constants';
import {Captions} from '../components/Captions';
import {scene5Captions} from '../captions';

const LOCAL_DURATION = 232;
const EXIT_START = 210;

export const Scene5V10Net: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---- CÂMERA: Orbit 15° -> 0° ----
  const orbitProgress = interpolate(frame, [0, 40], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const orbitRotateY = interpolate(orbitProgress, [0, 1], [-15, 0]);

  const logoSpring = spring({frame, fps, config: {damping: 13, mass: 0.9}});
  const logoScale = interpolate(logoSpring, [0, 1], [0.8, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const textSpring = spring({frame: frame - 8, fps, config: {damping: 15, mass: 1}});
  const textTranslateY = interpolate(textSpring, [0, 1], [30, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  const float = Math.sin(frame * 0.08) * 8;

  const exitProgress = interpolate(frame, [EXIT_START, LOCAL_DURATION], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitTranslateY = interpolate(exitProgress, [0, 1], [0, -80]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(230,0,11,0.15), transparent 55%)',
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: exitOpacity,
          transform: `translateY(${exitTranslateY}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 64,
          }}
        >
          <div
            style={{
              transform: `scale(${logoScale}) translateY(${float}px) rotateY(${orbitRotateY}deg)`,
              opacity: logoOpacity,
            }}
          >
            <Img
              src={staticFile('video/v10net-logo-circle.png')}
              style={{width: 240, height: 'auto'}}
            />
          </div>

          <div
            style={{
              width: '84%',
              minHeight: 180,
              transform: `translateY(${textTranslateY}px)`,
              opacity: textOpacity,
            }}
          >
            <Captions chunks={scene5Captions} frame={frame} fontSize={44} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
