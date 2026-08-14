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

const GLITCH_FRAME = 47; // local frame equivalent to absolute 210

export const Scene3Familia: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---- ENTRADA (local 0-32): card slides in from the right ----
  const cardSpring = spring({frame, fps, config: {damping: 13, mass: 0.9}});
  const cardTranslateXIn = interpolate(cardSpring, [0, 1], [500, 0]);
  const cardOpacityIn = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardBlurIn = interpolate(cardSpring, [0, 1], [20, 0]);

  const title1Spring = spring({frame: frame - 12, fps, config: {damping: 14, mass: 0.8}});
  const title2Spring = spring({frame: frame - 17, fps, config: {damping: 14, mass: 0.8}});
  const title1OpacityIn = interpolate(title1Spring, [0, 1], [0, 1]);
  const title1TranslateYIn = interpolate(title1Spring, [0, 1], [40, 0]);
  const title2OpacityIn = interpolate(title2Spring, [0, 1], [0, 1]);
  const title2TranslateYIn = interpolate(title2Spring, [0, 1], [40, 0]);

  // ---- HOLD (local 32-72): breathing + glow pulse + glitch at frame 47 ----
  const breathe = frame >= 32 && frame < 72 ? Math.sin((frame - 32) * 0.2) * 5 : 0;
  const glowPulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.1, 0.3]);

  const glitchDistance = Math.abs(frame - GLITCH_FRAME);
  const isGlitching = glitchDistance < 4;
  const glitchOffsetX = isGlitching ? Math.sin(frame * 9) * 14 : 0;
  const glitchSkew = isGlitching ? Math.sin(frame * 13) * 3 : 0;

  // ---- SAÍDA (local 72-97): colapso / sucção para o centro ----
  const exitBgProgress = interpolate(frame, [72, 97], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitTextProgress = interpolate(frame, [77, 102], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitCardProgress = interpolate(frame, [82, 107], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bgScale = interpolate(exitBgProgress, [0, 1], [1, 0]);
  const bgOpacity = interpolate(exitBgProgress, [0, 1], [1, 0]);
  const textScale = interpolate(exitTextProgress, [0, 1], [1, 0]);
  const textOpacity = interpolate(exitTextProgress, [0, 1], [1, 0]);
  const textBlur = interpolate(exitTextProgress, [0, 1], [0, 30]);
  const cardScaleOut = interpolate(exitCardProgress, [0, 1], [1, 0]);
  const cardOpacityOut = interpolate(exitCardProgress, [0, 1], [1, 0]);
  const cardRotateOut = interpolate(exitCardProgress, [0, 1], [0, -15]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(230,0,11,0.15), transparent 60%)',
          transform: `scale(${bgScale})`,
          opacity: bgOpacity,
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
            transform: `scale(${textScale})`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_POPPINS,
              fontWeight: 600,
              fontSize: 52,
              color: COLORS.textPrimary,
              textAlign: 'center',
              transform: `translateY(${title1TranslateYIn}px)`,
              opacity: Math.min(title1OpacityIn, textOpacity),
              filter: `blur(${textBlur}px)`,
            }}
          >
            A família inteira
          </div>
          <div
            style={{
              fontFamily: FONT_POPPINS,
              fontWeight: 600,
              fontSize: 52,
              color: COLORS.textPrimary,
              textAlign: 'center',
              marginTop: -30,
              transform: `translateY(${title2TranslateYIn}px)`,
              opacity: Math.min(title2OpacityIn, textOpacity),
              filter: `blur(${textBlur}px)`,
            }}
          >
            esperando?
          </div>

          <div
            style={{
              transform: `translateY(${breathe}px) translateX(${cardTranslateXIn + glitchOffsetX}px) scale(${cardScaleOut}) rotateZ(${cardRotateOut + glitchSkew}deg)`,
              opacity: Math.min(cardOpacityIn, cardOpacityOut),
              filter: `blur(${cardBlurIn}px)`,
            }}
          >
            <MediaCard
              src={staticFile('video/cliente-familia.mov')}
              glowOpacity={glowPulse}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
