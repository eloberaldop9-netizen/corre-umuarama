import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS} from '../colors';
import {Noise} from '../Noise';
import {CameraStage} from '../Camera';
import {Shield} from '../icons/Shield';
import {FONT_FAMILY} from '../fonts';

export const Scene2Seguranca: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camY = interpolate(frame, [0, 60], [300, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camRotX = interpolate(frame, [0, 60], [-0.15, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZDive = interpolate(frame, [62, 87], [0, 1000], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bgOpacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textSpring = spring({
    frame: frame - 5,
    fps,
    config: {damping: 14, mass: 0.9},
  });
  const textX = interpolate(textSpring, [0, 1], [800, 0]);
  const textBlurIn = interpolate(frame, [5, 28], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textOpacityIn = interpolate(frame, [5, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shieldBorder = interpolate(frame, [12, 37], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shieldCoreSpring = spring({
    frame: frame - 16,
    fps,
    config: {damping: 16, mass: 0.8, stiffness: 120},
  });
  const shieldCoreOpacity = interpolate(frame, [16, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const holdWindow = interpolate(frame, [57, 62], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shieldFloatY = Math.sin(frame * 0.04) * 4 * holdWindow;
  const shadowBlur = 40 + Math.sin(frame * 0.04) * 15;
  const shadowDist = 40 - Math.sin(frame * 0.04) * 10;

  const gridOffset = (frame * 1) % 80;

  const textExit = interpolate(frame, [65, 87], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textExitScale = interpolate(textExit, [0, 1], [1, 3]);
  const textExitOpacity = 1 - textExit;
  const textExitBlur = textExit * 15;

  const shieldExit = interpolate(frame, [67, 87], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shieldExitScale = interpolate(shieldExit, [0, 1], [1, 5]);
  const shieldExitOpacity = 1 - shieldExit;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.surface1, opacity: bgOpacity}}>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
        }}
      />
      <Noise opacity={0.05} />
      <svg
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
      >
        <defs>
          <pattern
            id="grid2"
            width={80}
            height={80}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(0, ${gridOffset})`}
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth={1}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid2)" />
      </svg>

      <CameraStage translateY={camY} rotateX={camRotX} translateZ={camZDive}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_FAMILY,
          }}
        >
          <div
            style={{
              transform: `translateZ(80px) translateY(-90px) translateX(${textX}px) scale(${textExitScale})`,
              filter: `blur(${textBlurIn + textExitBlur}px)`,
              opacity: textOpacityIn * textExitOpacity,
              fontSize: 110,
              fontWeight: 800,
              color: COLORS.textPrimary,
              letterSpacing: -2,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            SEGURAN&Ccedil;A,
          </div>

          <div
            style={{
              position: 'absolute',
              transform: `translateY(${100 + shieldFloatY}px) scale(${shieldExitScale})`,
              opacity: shieldExitOpacity,
              filter: `drop-shadow(0 ${shadowDist}px ${shadowBlur}px rgba(0,0,0,0.6))`,
            }}
          >
            <Shield
              size={240}
              borderDraw={shieldBorder}
              coreScale={shieldCoreSpring}
              coreOpacity={shieldCoreOpacity}
            />
          </div>
        </AbsoluteFill>
      </CameraStage>
    </AbsoluteFill>
  );
};
