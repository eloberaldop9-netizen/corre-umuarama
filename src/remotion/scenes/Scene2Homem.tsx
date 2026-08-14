import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {Noise} from '../components/Noise';
import {MediaCard} from '../components/MediaCard';

export const Scene2Homem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---- ENTRADA (local 0-32) ----
  const cardSpring = spring({frame, fps, config: {damping: 13, mass: 0.9}});
  const cardScaleIn = interpolate(cardSpring, [0, 1], [0.7, 1]);
  const cardOpacityIn = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardBlurIn = interpolate(cardSpring, [0, 1], [20, 0]);

  const title1Spring = spring({frame: frame - 12, fps, config: {damping: 14, mass: 0.8}});
  const title2Spring = spring({frame: frame - 17, fps, config: {damping: 14, mass: 0.8}});
  const title1OpacityIn = interpolate(title1Spring, [0, 1], [0, 1]);
  const title1TranslateYIn = interpolate(title1Spring, [0, 1], [40, 0]);
  const title2OpacityIn = interpolate(title2Spring, [0, 1], [0, 1]);
  const title2TranslateYIn = interpolate(title2Spring, [0, 1], [40, 0]);

  // ---- HOLD (local 32-67): breathing + glow pulse ----
  const breathe = frame >= 32 && frame < 67 ? Math.sin((frame - 32) * 0.2) * 5 : 0;
  const glowPulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.1, 0.3]);

  // ---- SAÍDA (local 67-87): pan left ----
  const exitCardProgress = interpolate(frame, [67, 87], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitCardX = interpolate(exitCardProgress, [0, 1], [0, -1200]);
  const exitCardBlur = interpolate(exitCardProgress, [0, 1], [0, 20]);
  const exitCardOpacity = interpolate(exitCardProgress, [0, 1], [1, 0]);
  const exitCardScale = interpolate(exitCardProgress, [0, 1], [1, 0.94]);

  const exitText1Progress = interpolate(frame, [72, 92], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitText2Progress = interpolate(frame, [77, 97], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(230,0,11,0.15), transparent 60%)',
        }}
      />
      <Noise opacity={0.04} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 48,
          }}
        >
          <div
            style={{
              fontFamily: FONT_POPPINS,
              fontWeight: 600,
              fontSize: 52,
              color: COLORS.textPrimary,
              textAlign: 'center',
              transform: `translateY(${title1TranslateYIn}px) translateX(${interpolate(exitText1Progress, [0, 1], [0, -1200])}px)`,
              opacity: Math.min(title1OpacityIn, interpolate(exitText1Progress, [0, 1], [1, 0])),
              filter: `blur(${interpolate(exitText1Progress, [0, 1], [0, 20])}px)`,
            }}
          >
            A culpa não é
          </div>
          <div
            style={{
              fontFamily: FONT_POPPINS,
              fontWeight: 600,
              fontSize: 52,
              color: COLORS.textPrimary,
              textAlign: 'center',
              marginTop: -30,
              transform: `translateY(${title2TranslateYIn}px) translateX(${interpolate(exitText2Progress, [0, 1], [0, -1200])}px)`,
              opacity: Math.min(title2OpacityIn, interpolate(exitText2Progress, [0, 1], [1, 0])),
              filter: `blur(${interpolate(exitText2Progress, [0, 1], [0, 20])}px)`,
            }}
          >
            da sua TV...
          </div>

          <div
            style={{
              transform: `translateY(${breathe}px) translateX(${exitCardX}px) scale(${cardScaleIn * exitCardScale})`,
              opacity: Math.min(cardOpacityIn, exitCardOpacity),
              filter: `blur(${Math.max(cardBlurIn, exitCardBlur)}px)`,
            }}
          >
            <MediaCard
              src={staticFile('video/cliente-homem.mov')}
              glowOpacity={glowPulse}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
