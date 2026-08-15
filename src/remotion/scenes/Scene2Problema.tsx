import React from 'react';
import {AbsoluteFill, Easing, random, staticFile, useCurrentFrame} from 'remotion';
import {WifiOff} from 'lucide-react';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {Noise} from '../components/Noise';
import {MediaCard} from '../components/MediaCard';
import {DynamicSubtitle} from '../components/DynamicSubtitle';
import {scene2Captions} from '../captions';
import {ci, entry3D, exitTo, mergeStyles} from '../motion';

const LOCAL_DURATION = 388;
const EXIT_START = 370;

// Janelas derivadas da distribuição de palavras em captions.ts (scene2Captions).
const GLITCH_IN = 122;
const GLITCH_OUT = 142;
const STAMP_IN = 221;
const STAMP_OUT = 250;
const FLICKER_IN = 233;
const FLICKER_OUT = 274;

const RGBGlitch: React.FC<{frame: number; children: React.ReactNode}> = ({frame, children}) => {
  const active = frame >= GLITCH_IN && frame <= GLITCH_OUT;
  if (!active) return <>{children}</>;

  const shiftX = (random(`glitch-${frame}`) - 0.5) * 18;
  const flicker = random(`glitch-op-${Math.floor(frame / 2)}`) > 0.25;

  return (
    <div style={{position: 'relative'}}>
      <div style={{opacity: flicker ? 1 : 0.35, transform: `translateX(${shiftX * 0.2}px)`}}>
        {children}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${shiftX}px)`,
          mixBlendMode: 'screen',
          backgroundColor: 'rgba(255,0,60,0.28)',
          borderRadius: 40,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${-shiftX}px)`,
          mixBlendMode: 'screen',
          backgroundColor: 'rgba(0,220,255,0.22)',
          borderRadius: 40,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

const BloqueiosStamp: React.FC<{frame: number}> = ({frame}) => {
  const p = ci(frame, [STAMP_IN, STAMP_IN + 10], [0, 1], Easing.out(Easing.back(1.4)));
  const scale = ci(frame, [STAMP_IN, STAMP_IN + 10], [1.6, 1], Easing.out(Easing.back(1.4)));
  const outP = ci(frame, [STAMP_OUT, STAMP_OUT + 12], [0, 1], Easing.in(Easing.exp));

  if (frame < STAMP_IN || frame > STAMP_OUT + 12) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 50,
        transform: `translate(-50%, -50%) rotate(-5deg) scale(${scale * (1 - outP * 0.3)})`,
        opacity: p * (1 - outP),
        backgroundColor: COLORS.brandRed,
        border: `4px solid ${COLORS.white}`,
        padding: '18px 36px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
      }}
    >
      <span
        style={{
          fontFamily: FONT_POPPINS,
          fontWeight: 900,
          fontSize: 100,
          color: COLORS.white,
          letterSpacing: '-2px',
          textShadow: '4px 4px 0 rgba(0,0,0,0.4)',
        }}
      >
        BLOQUEIOS
      </span>
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

  // Flicker determinístico simulando queda de sinal em "ficar fora do ar".
  const isFlickering = frame >= FLICKER_IN && frame < FLICKER_OUT;
  const flickerOpacity = isFlickering
    ? random(`signal-${Math.floor(frame / 3)}`) > 0.5
      ? 1
      : 0.25
    : 1;

  // ---- SAÍDA: varredura lateral brusca (Mandamento: pan esquerda) ----
  const cardExit = exitTo(frame, EXIT_START, 'left', 1200, 18);
  const captionExit = exitTo(frame, EXIT_START - 6, 'left', 1200, 18);

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
            <DynamicSubtitle
              chunks={scene2Captions}
              frame={frame}
              fontSize={44}
              trailColor="#444444"
              style={{justifyContent: 'center', textAlign: 'center'}}
            />
          </div>

          <div
            style={{
              ...cardStyle,
              position: 'relative',
              transform: `${cardStyle.transform} translateY(${breathe}px) scale(${kenBurns})`,
              opacity: (cardStyle.opacity as number) * flickerOpacity,
            }}
          >
            <RGBGlitch frame={frame}>
              <MediaCard
                src={staticFile('video/cliente-homem.mov')}
                glowOpacity={glowPulse}
                loopDurationInFrames={151}
              />
            </RGBGlitch>
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
                opacity: isFlickering ? 1 : 0,
                boxShadow: '0 8px 24px rgba(230,0,11,0.6)',
              }}
            >
              <WifiOff size={34} color={COLORS.textPrimary} />
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <BloqueiosStamp frame={frame} />
    </AbsoluteFill>
  );
};
