import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {DynamicSubtitle} from '../components/DynamicSubtitle';
import {scene5Captions} from '../captions';
import {ci, exitTo} from '../motion';
import {Sfx} from '../components/Sfx';

const EXIT_START = 210;
const RING_END = 88; // fim de "continua entregando a sua conexão normalmente,"
const SHIELD_IN = 94; // início de "mas não possui controle sobre servidores,"

const PulseRings: React.FC<{frame: number}> = ({frame}) => {
  if (frame > RING_END + 20) return null;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {[0, 1, 2].map((i) => {
        const cycle = 40;
        const local = (frame - i * 13) % cycle;
        const p = Math.max(0, local) / cycle;
        const scale = ci(p, [0, 1], [0.3, 3.2]);
        const opacity = frame < 6 ? 0 : ci(p, [0, 1], [0.5, 0], Easing.out(Easing.cubic));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 260,
              height: 260,
              borderRadius: '50%',
              border: `2px solid ${COLORS.brandRed}`,
              opacity,
              transform: `scale(${scale})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Shield: React.FC<{frame: number}> = ({frame}) => {
  const p = ci(frame, [SHIELD_IN, SHIELD_IN + 24], [0, 1], Easing.out(Easing.cubic));
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 340,
        height: 340,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(120,128,140,0.16)',
        border: '2px solid rgba(120,128,140,0.3)',
        opacity: p,
      }}
    />
  );
};

export const Scene5V10Net: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- ENTRADA: revelada pelo wipe da cena anterior, só assenta suave ----
  const entryP = ci(frame, [0, 20], [0, 1], Easing.out(Easing.cubic));
  const entryScale = ci(frame, [0, 24], [0.85, 1], Easing.out(Easing.cubic));

  const float = Math.sin(frame * 0.08) * 3;

  // ---- SAÍDA (Mandamento 6: 5→6 sai por ESQUERDA) ----
  const groupExit = exitTo(frame, EXIT_START, 'left', 500, 22);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ice}}>
      <Sfx name="chime" from={0} volume={0.3} />
      <Sfx name="whoosh-down" from={EXIT_START} volume={0.35} />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, #FFFFFF 0%, #E4E6EA 100%)',
        }}
      />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 64,
            opacity: entryP * (groupExit.opacity as number),
            transform: `${groupExit.transform} scale(${entryScale})`,
            filter: groupExit.filter,
          }}
        >
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <PulseRings frame={frame} />
            <Shield frame={frame} />
            <div style={{transform: `translateY(${float}px)`, position: 'relative', zIndex: 2}}>
              <Img
                src={staticFile('video/v10net-logo-circle.png')}
                style={{width: 240, height: 'auto'}}
              />
            </div>
          </div>

          <div style={{width: '84%', minHeight: 180}}>
            <DynamicSubtitle
              chunks={scene5Captions}
              frame={frame}
              fontSize={44}
              activeColor={COLORS.brandRed}
              trailColor={COLORS.trailGrayLight}
              style={{justifyContent: 'center', textAlign: 'center'}}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
