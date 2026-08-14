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
import {Noise} from '../components/Noise';
import {MediaCard} from '../components/MediaCard';
import {Captions} from '../components/Captions';
import {scene2Captions} from '../captions';

const LOCAL_DURATION = 388;
const EXIT_START = 368;

export const Scene2Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // ---- ENTRADA (0-32) ----
  const cardSpring = spring({frame, fps, config: {damping: 13, mass: 0.9}});
  const cardScaleIn = interpolate(cardSpring, [0, 1], [0.7, 1]);
  const cardOpacityIn = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardBlurIn = interpolate(cardSpring, [0, 1], [20, 0]);

  // ---- HOLD (32-368): breathing + slow ken-burns zoom + glow pulse ----
  const breathe = frame >= 32 && frame < EXIT_START ? Math.sin((frame - 32) * 0.08) * 6 : 0;
  const glowPulse = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.1, 0.3]);
  const kenBurns = interpolate(frame, [32, LOCAL_DURATION], [1, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---- SAÍDA (368-388): pan left ----
  const exitProgress = interpolate(frame, [EXIT_START, LOCAL_DURATION], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitX = interpolate(exitProgress, [0, 1], [0, -1200]);
  const exitBlur = interpolate(exitProgress, [0, 1], [0, 20]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.94]);

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
            gap: 56,
            width: '100%',
            transform: `translateX(${exitX}px)`,
          }}
        >
          <div style={{width: '82%', minHeight: 160}}>
            <Captions chunks={scene2Captions} frame={frame} fontSize={44} />
          </div>

          <div
            style={{
              transform: `translateY(${breathe}px) scale(${cardScaleIn * kenBurns * exitScale})`,
              opacity: Math.min(cardOpacityIn, exitOpacity),
              filter: `blur(${Math.max(cardBlurIn, exitBlur)}px)`,
            }}
          >
            <MediaCard
              src={staticFile('video/cliente-homem.mov')}
              glowOpacity={glowPulse}
              loopDurationInFrames={151}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
