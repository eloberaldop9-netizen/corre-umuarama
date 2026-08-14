import React from 'react';
import {AbsoluteFill, Easing, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {Noise} from '../components/Noise';
import {MediaCard} from '../components/MediaCard';
import {Captions} from '../components/Captions';
import {scene4Captions} from '../captions';
import {ci} from '../motion';

const LOCAL_DURATION = 178;
const EXIT_START = 155;

export const Scene4Conclusao: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- ENTRADA: grupo inteiro desliza da ESQUERDA (Mandamento 6: 3→4) ----
  const entryP = ci(frame, [0, 26], [0, 1], Easing.out(Easing.cubic));
  const entryX = ci(frame, [0, 26], [-360, 0], Easing.out(Easing.cubic));
  const entryBlur = ci(frame, [0, 18], [16, 0]);

  const breathe = frame >= 30 && frame < EXIT_START ? Math.sin((frame - 30) * 0.15) * 5 : 0;
  const glowPulse = ci(Math.sin(frame * 0.15), [-1, 1], [0.15, 0.35]);

  // ---- SAÍDA CRIATIVA: Scale Collapse (Mandamento 8.3 / transição 4→5) ----
  const exitP = ci(frame, [EXIT_START, LOCAL_DURATION], [0, 1], Easing.in(Easing.cubic));
  const exitScale = ci(exitP, [0, 1], [1, 0.3]);
  const exitBlur = ci(exitP, [0, 1], [0, 30]);
  const exitOpacity = ci(exitP, [0, 1], [1, 0]);

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
            alignItems: 'center',
            justifyContent: 'center',
            gap: 44,
            width: '90%',
            opacity: entryP * exitOpacity,
            transform: `translateX(${entryX}px) scale(${exitScale})`,
            filter: `blur(${entryBlur + exitBlur}px)`,
          }}
        >
          <div style={{flex: 1, textAlign: 'left'}}>
            <Captions
              chunks={scene4Captions}
              frame={frame}
              fontSize={38}
              style={{justifyContent: 'flex-start', textAlign: 'left'}}
            />
          </div>

          <div style={{transform: `translateY(${breathe}px)`, flexShrink: 0}}>
            <MediaCard
              src={staticFile('video/cliente-familia.mov')}
              glowOpacity={glowPulse}
              loopDurationInFrames={151}
              size={420}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
