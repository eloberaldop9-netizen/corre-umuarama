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
import {JCLogoJ, JCLogoC} from '../icons/JCLogo';
import {FONT_FAMILY} from '../fonts';

export const Scene4Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const jSpring = spring({frame, fps, config: {damping: 14, mass: 0.8}});
  const jY = interpolate(jSpring, [0, 1], [-40, 0]);
  const jBlur = interpolate(frame, [0, 20], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const jOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cSpring = spring({frame: frame - 3, fps, config: {damping: 14, mass: 0.8}});
  const cY = interpolate(cSpring, [0, 1], [40, 0]);
  const cBlur = interpolate(frame, [3, 23], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cOpacity = interpolate(frame, [3, 19], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lineScale = interpolate(frame, [8, 22], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const nameWipe = interpolate(frame, [12, 30], [100, 0], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const nameX = interpolate(frame, [12, 30], [15, 0], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const nameOpacity = interpolate(frame, [12, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subWipe = interpolate(frame, [16, 32], [100, 0], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subY = interpolate(frame, [16, 32], [-10, 0], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subOpacity = interpolate(frame, [16, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sweepX = interpolate(frame, [27, 42], [-100, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dissolve = interpolate(frame, [47, 57], [1, 0], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textBase: React.CSSProperties = {
    fontFamily: FONT_FAMILY,
    color: COLORS.textPrimary,
    whiteSpace: 'nowrap',
  };

  return (
    <AbsoluteFill
      style={{backgroundColor: '#000000', opacity: dissolve}}
    >
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
          <div style={{position: 'relative', width: 140, height: 140}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateY(${jY}px)`,
                filter: `blur(${jBlur}px)`,
                opacity: jOpacity,
              }}
            >
              <JCLogoJ size={140} />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateY(${cY}px)`,
                filter: `blur(${cBlur}px)`,
                opacity: cOpacity,
              }}
            >
              <JCLogoC size={140} />
            </div>
          </div>

          <div
            style={{
              width: 1,
              height: 90,
              background: 'rgba(255,255,255,0.2)',
              transform: `scaleY(${lineScale})`,
            }}
          />

          <div>
            <div style={{position: 'relative', overflow: 'hidden'}}>
              <div
                style={{
                  ...textBase,
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: 1,
                  transform: `translateX(${nameX}px)`,
                  clipPath: `inset(0 0 0 ${nameWipe}%)`,
                  opacity: nameOpacity,
                  position: 'relative',
                }}
              >
                JARBAS CUGULA
              </div>
              <div
                style={{
                  ...textBase,
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: 1,
                  position: 'absolute',
                  inset: 0,
                  clipPath: `inset(0 0 0 ${nameWipe}%)`,
                  opacity: nameOpacity,
                  backgroundImage:
                    'linear-gradient(100deg, transparent 40%, rgba(255,255,255,0.95) 50%, transparent 60%)',
                  backgroundSize: '250% 100%',
                  backgroundPosition: `${sweepX}% 0`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                JARBAS CUGULA
              </div>
            </div>
            <div
              style={{
                width: '100%',
                height: 2,
                background: COLORS.textPrimary,
                margin: '10px 0',
                transform: `scaleX(${lineScale})`,
                transformOrigin: 'left',
              }}
            />
            <div
              style={{
                ...textBase,
                fontSize: 26,
                fontWeight: 400,
                letterSpacing: 6,
                color: COLORS.textSecondary,
                transform: `translateY(${subY}px)`,
                clipPath: `inset(0 0 ${subWipe}% 0)`,
                opacity: subOpacity,
              }}
            >
              ADVOCACIA
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
