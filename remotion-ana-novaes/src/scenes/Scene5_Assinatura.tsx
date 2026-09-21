import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { COLOR, FONT } from '../lib/palette';

// Cena 5 — A Assinatura (Lockup Final) | frames locais 0–145 (4.8s, ajustado à narração)
// Câmera: estática, micro-zoom de respiro (scale sutil ao longo de toda a cena)
export const Scene5_Assinatura: React.FC = () => {
  const frame = useCurrentFrame();

  const microZoom = ci(frame, [0, 145], [1, 1.03], Easing.inOut(Easing.quad));

  const anaOp = ci(frame, [10, 32], [0, 1], Easing.out(Easing.cubic));
  const anaY = ci(frame, [10, 32], [20, 0], Easing.out(Easing.cubic));
  const anaBl = ci(frame, [10, 32], [20, 0], Easing.out(Easing.cubic));

  const novaesOp = ci(frame, [15, 37], [0, 1], Easing.out(Easing.cubic));
  const novaesY = ci(frame, [15, 37], [20, 0], Easing.out(Easing.cubic));
  const novaesBl = ci(frame, [15, 37], [20, 0], Easing.out(Easing.cubic));

  const lineScale = ci(frame, [35, 60], [0, 1], Easing.inOut(Easing.cubic));

  const marcaOp = ci(frame, [50, 68], [0, 1], Easing.out(Easing.cubic));
  const marcaY = ci(frame, [50, 68], [-15, 0], Easing.out(Easing.cubic));

  const umuaramaOp = ci(frame, [55, 73], [0, 1], Easing.out(Easing.cubic));
  const umuaramaY = ci(frame, [55, 73], [-15, 0], Easing.out(Easing.cubic));

  // Fade cinematográfico final (123–145)
  const finalFade = ci(frame, [123, 145], [1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <NoiseOverlay opacity={0.03} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${microZoom})`,
          opacity: finalFade,
        }}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 110,
              letterSpacing: -1,
              color: COLOR.textLight,
              opacity: anaOp,
              transform: `translateY(${anaY}px)`,
              filter: `blur(${anaBl}px)`,
            }}
          >
            ANA
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 110,
              letterSpacing: -1,
              color: COLOR.textLight,
              opacity: novaesOp,
              transform: `translateY(${novaesY}px)`,
              filter: `blur(${novaesBl}px)`,
            }}
          >
            NOVAIS
          </div>
        </div>

        <div
          style={{
            width: 260,
            height: 3,
            backgroundColor: COLOR.accent,
            marginTop: 36,
            marginBottom: 36,
            transform: `scaleX(${lineScale})`,
          }}
        />

        <div style={{ display: 'flex', gap: 20, alignItems: 'baseline' }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 400,
              fontSize: 34,
              letterSpacing: 10,
              color: COLOR.accent,
              opacity: marcaOp,
              transform: `translateY(${marcaY}px)`,
            }}
          >
            A MARCA
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: 8,
              color: COLOR.textLight,
              opacity: umuaramaOp,
              transform: `translateY(${umuaramaY}px)`,
            }}
          >
            UMUARAMA
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
