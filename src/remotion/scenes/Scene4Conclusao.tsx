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
import {scene4Captions} from '../captions';

const LOCAL_DURATION = 178;
const EXIT_START = 155;

export const Scene4Conclusao: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cardSpring = spring({frame, fps, config: {damping: 13, mass: 0.9}});
  const cardScaleIn = interpolate(cardSpring, [0, 1], [0.7, 1]);
  const cardOpacityIn = interpolate(cardSpring, [0, 1], [0, 1]);
  const cardBlurIn = interpolate(cardSpring, [0, 1], [20, 0]);

  const breathe = frame >= 25 && frame < EXIT_START ? Math.sin((frame - 25) * 0.15) * 5 : 0;
  const glowPulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.15, 0.35]);

  const exitProgress = interpolate(frame, [EXIT_START, LOCAL_DURATION], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitBlur = interpolate(exitProgress, [0, 1], [0, 30]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(230,0,11,0.18), transparent 60%)',
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
            transform: `scale(${exitScale})`,
            opacity: exitOpacity,
            filter: `blur(${exitBlur}px)`,
          }}
        >
          <div style={{width: '82%', minHeight: 140}}>
            <Captions chunks={scene4Captions} frame={frame} fontSize={44} />
          </div>

          <div
            style={{
              transform: `translateY(${breathe}px) scale(${cardScaleIn})`,
              opacity: cardOpacityIn,
              filter: `blur(${cardBlurIn}px)`,
            }}
          >
            <MediaCard
              src={staticFile('video/cliente-familia.mov')}
              glowOpacity={glowPulse}
              loopDurationInFrames={151}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
