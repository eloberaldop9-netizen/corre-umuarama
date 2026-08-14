import React from 'react';
import {AbsoluteFill, Easing, staticFile, useCurrentFrame} from 'remotion';
import {WifiOff} from 'lucide-react';
import {COLORS} from '../constants';
import {Noise} from '../components/Noise';
import {MediaCard} from '../components/MediaCard';
import {Captions} from '../components/Captions';
import {scene2Captions} from '../captions';
import {ci, entry3D, exitTo, mergeStyles} from '../motion';

const LOCAL_DURATION = 388;
const EXIT_START = 368;

// Janela da frase "sofrer bloqueios e ficar fora do ar," (ver captions.ts)
const BADGE_IN = 215;
const BADGE_OUT = 278;

const SignalLostBadge: React.FC<{frame: number}> = ({frame}) => {
  const p = ci(frame, [BADGE_IN, BADGE_IN + 16], [0, 1]);
  const scale = ci(frame, [BADGE_IN, BADGE_IN + 16], [0.4, 1], Easing.out(Easing.back(2)));
  const outP = ci(frame, [BADGE_OUT, BADGE_OUT + 14], [0, 1], Easing.in(Easing.exp));
  const outScale = ci(outP, [0, 1], [1, 0.5]);
  const shake = frame > BADGE_IN + 16 && frame < BADGE_OUT ? Math.sin(frame * 1.4) * 2 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: -18,
        right: -18,
        width: 76,
        height: 76,
        borderRadius: '50%',
        backgroundColor: COLORS.brandRed,
        border: `3px solid ${COLORS.black}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: p * (1 - outP),
        transform: `scale(${scale * outScale}) rotate(${shake}deg)`,
        boxShadow: '0 8px 24px rgba(230,0,11,0.6)',
      }}
    >
      <WifiOff size={34} color={COLORS.textPrimary} />
    </div>
  );
};

export const Scene2Problema: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- ENTRADA: card 3D vindo da direita ----
  const cardEntry = entry3D(frame, 0, 'right', 30);

  // ---- HOLD: breathing + slow ken-burns zoom + glow pulse ----
  const breathe = frame >= 30 && frame < EXIT_START ? Math.sin((frame - 30) * 0.08) * 6 : 0;
  const glowPulse = ci(Math.sin(frame * 0.12), [-1, 1], [0.1, 0.3]);
  const kenBurns = ci(frame, [30, LOCAL_DURATION], [1, 1.08]);

  // ---- SAÍDA (368-388): sobe (Mandamento 6: 2→3 sai por CIMA) ----
  const cardExit = exitTo(frame, EXIT_START, 'top', 460, 20);
  const captionExit = exitTo(frame, EXIT_START - 6, 'top', 460, 20);

  const cardStyle = mergeStyles(cardEntry, cardExit);

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
          }}
        >
          <div style={{width: '82%', minHeight: 160, ...captionExit}}>
            <Captions chunks={scene2Captions} frame={frame} fontSize={44} />
          </div>

          <div
            style={{
              ...cardStyle,
              position: 'relative',
              transform: `${cardStyle.transform} translateY(${breathe}px) scale(${kenBurns})`,
            }}
          >
            <MediaCard
              src={staticFile('video/cliente-homem.mov')}
              glowOpacity={glowPulse}
              loopDurationInFrames={151}
            />
            <SignalLostBadge frame={frame} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
