import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR, FONT } from '../lib/palette';
import type { AnaNovaesAssets } from '../VideoAnaNovaes';

// Cena 5 — A Assinatura (Lockup Final) | frames locais 0–125 (4.2s)
// Transcrição real (forced alignment real): "Ana"@48 "Novais"@49–67 "Umuarama."@68–86
export const Scene5_Assinatura: React.FC<{ assets: AnaNovaesAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const microZoom = ci(frame, [0, 125], [1, 1.02], Easing.inOut(Easing.quad));
  const bgFadeIn = ci(frame, [0, 22], [0, 1], Easing.out(Easing.quad));
  const photoOp = ci(frame, [0, 24], [0, 0.32], Easing.out(Easing.quad));

  const anaOp = ci(frame, [48, 64], [0, 1], Easing.out(Easing.cubic));
  const anaY = ci(frame, [48, 64], [16, 0], Easing.out(Easing.cubic));
  const anaBl = ci(frame, [48, 64], [12, 0], Easing.out(Easing.cubic));

  const novaisOp = ci(frame, [49, 65], [0, 1], Easing.out(Easing.cubic));
  const novaisY = ci(frame, [49, 65], [16, 0], Easing.out(Easing.cubic));
  const novaisBl = ci(frame, [49, 65], [12, 0], Easing.out(Easing.cubic));

  const lineScale = ci(frame, [68, 78], [0, 1], Easing.inOut(Easing.cubic));

  const marcaOp = ci(frame, [70, 82], [0, 1], Easing.out(Easing.cubic));
  const umuaramaOp = ci(frame, [68, 80], [0, 1], Easing.out(Easing.cubic));

  const finalFade = ci(frame, [100, 122], [1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000', opacity: bgFadeIn }}>
      <div style={{ position: 'absolute', inset: 0, opacity: photoOp, filter: 'grayscale(1) blur(3px)' }}>
        <AssetImage file={assets.retratoAna} label="" tone="dark" style={{ width: '100%', height: '100%' }} />
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, #000 85%)' }} />
      </div>
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
              fontSize: 96,
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
              fontSize: 96,
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
            width: 230,
            height: 3,
            backgroundColor: COLOR.accent,
            marginTop: 32,
            marginBottom: 32,
            transform: `scaleX(${lineScale})`,
          }}
        />

        <div style={{ display: 'flex', gap: 18, alignItems: 'baseline' }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 400,
              fontSize: 28,
              letterSpacing: 6,
              color: COLOR.accent,
              opacity: marcaOp,
            }}
          >
            A MARCA
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 4,
              color: COLOR.textLight,
              opacity: umuaramaOp,
            }}
          >
            UMUARAMA
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
