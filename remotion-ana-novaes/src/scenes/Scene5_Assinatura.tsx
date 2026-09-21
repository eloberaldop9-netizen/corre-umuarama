import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { COLOR, FONT } from '../lib/palette';

// Cena 5 — A Assinatura (Lockup Final) | frames locais 0–132 (4.4s)
// Timing real: "Ana"@79 "Novais"@88 | "Umuarama."@104 (fim da narração)
// Câmera: estática, micro-zoom de respiro
export const Scene5_Assinatura: React.FC = () => {
  const frame = useCurrentFrame();

  const microZoom = ci(frame, [0, 132], [1, 1.025], Easing.inOut(Easing.quad));

  const anaOp = ci(frame, [79, 97], [0, 1], Easing.out(Easing.cubic));
  const anaY = ci(frame, [79, 97], [18, 0], Easing.out(Easing.cubic));
  const anaBl = ci(frame, [79, 97], [14, 0], Easing.out(Easing.cubic));

  const novaisOp = ci(frame, [88, 106], [0, 1], Easing.out(Easing.cubic));
  const novaisY = ci(frame, [88, 106], [18, 0], Easing.out(Easing.cubic));
  const novaisBl = ci(frame, [88, 106], [14, 0], Easing.out(Easing.cubic));

  const lineScale = ci(frame, [96, 108], [0, 1], Easing.inOut(Easing.cubic));

  const marcaOp = ci(frame, [100, 114], [0, 1], Easing.out(Easing.cubic));
  const marcaY = ci(frame, [100, 114], [-12, 0], Easing.out(Easing.cubic));

  const umuaramaOp = ci(frame, [104, 118], [0, 1], Easing.out(Easing.cubic));
  const umuaramaY = ci(frame, [104, 118], [-12, 0], Easing.out(Easing.cubic));

  // Fade final — começa assim que a narração termina de falar "Umuarama"
  const finalFade = ci(frame, [112, 132], [1, 0]);

  // Entrada suave do fundo — deixa a saída "queima" da Cena 4 visível por baixo
  // em vez de cobri-la com um corte seco para preto.
  const bgFadeIn = ci(frame, [0, 24], [0, 1], Easing.out(Easing.quad));

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', opacity: bgFadeIn }}>
      <NoiseOverlay opacity={0.03} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${microZoom})`,
          opacity: finalFade,
        }}
      >
        <div style={{ display: 'flex', gap: 22 }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: 100,
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
              fontWeight: 800,
              fontSize: 100,
              letterSpacing: -1,
              color: COLOR.textLight,
              opacity: novaisOp,
              transform: `translateY(${novaisY}px)`,
              filter: `blur(${novaisBl}px)`,
            }}
          >
            NOVAIS
          </div>
        </div>

        <div
          style={{
            width: 240,
            height: 3,
            backgroundColor: COLOR.accent,
            marginTop: 34,
            marginBottom: 34,
            transform: `scaleX(${lineScale})`,
          }}
        />

        <div style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 400,
              fontSize: 30,
              letterSpacing: 6,
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
              fontSize: 30,
              letterSpacing: 4,
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
