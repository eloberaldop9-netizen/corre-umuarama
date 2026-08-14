import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {Captions} from '../components/Captions';
import {scene5Captions} from '../captions';
import {ci, exitTo} from '../motion';

const EXIT_START = 210;

export const Scene5V10Net: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- ENTRADA CRIATIVA: expande do ponto de colapso da cena anterior ----
  const entryP = ci(frame, [0, 26], [0, 1], Easing.out(Easing.cubic));
  const entryScaleGroup = ci(frame, [0, 26], [0.3, 1], Easing.out(Easing.cubic));
  const entryBlurGroup = ci(frame, [0, 20], [24, 0]);

  // ---- CÂMERA: Orbit 15° -> 0° na logo ----
  const orbitProgress = ci(frame, [0, 40], [0, 1], Easing.out(Easing.cubic));
  const orbitRotateY = ci(orbitProgress, [0, 1], [-15, 0]);
  const float = Math.sin(frame * 0.08) * 8;

  // ---- SAÍDA (Mandamento 6: 5→6 sai por ESQUERDA) ----
  const groupExit = exitTo(frame, EXIT_START, 'left', 500, 22);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(230,0,11,0.15), transparent 55%)',
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
            transform: `${groupExit.transform} scale(${entryScaleGroup})`,
            filter: `blur(${entryBlurGroup}px) ${groupExit.filter}`,
          }}
        >
          <div
            style={{
              transform: `translateY(${float}px) rotateY(${orbitRotateY}deg)`,
            }}
          >
            <Img
              src={staticFile('video/v10net-logo-circle.png')}
              style={{width: 240, height: 'auto'}}
            />
          </div>

          <div style={{width: '84%', minHeight: 180}}>
            <Captions chunks={scene5Captions} frame={frame} fontSize={44} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
