import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay, DustParticles } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_CAUSA } from '../lib/palette-causa';
import { FONT } from '../lib/palette';
import type { CausaAssets } from '../VideoAnaNovaisCausa';

// Cena 4 — Lockup Final (Os 3 Eixos) | frames locais 0–200 (6.7s)
// Transcrição real (forced alignment real): "saúde"@63 "educação"@81 "assistência"@117
// "social."@144 (fala termina ~157)
export const Causa4_Lockup: React.FC<{ assets: CausaAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 20], [0, 1], Easing.out(Easing.quad));
  const microZoom = ci(frame, [0, 200], [1, 1.035], Easing.inOut(Easing.quad)); // FOV 60->58 aprox.

  const finalFade = ci(frame, [180, 200], [1, 0]);

  const pill = (label: string, delay: number) => {
    const op = ci(frame, [delay, delay + 18], [0, 1], Easing.out(Easing.cubic));
    const scale = ci(frame, [delay, delay + 18], [0.8, 1], Easing.out(Easing.cubic));
    const blur = ci(frame, [delay, delay + 14], [10, 0], Easing.out(Easing.cubic));
    return (
      <div
        style={{
          opacity: op,
          transform: `scale(${scale})`,
          filter: `blur(${blur}px)`,
          border: `2px solid ${COLOR_CAUSA.gold}`,
          borderRadius: 999,
          padding: '14px 34px',
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
      >
        <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 38, letterSpacing: 1, color: COLOR_CAUSA.textLight }}>
          {label}
        </span>
      </div>
    );
  };

  const fotoOp = ci(frame, [163, 183], [0, 1], Easing.out(Easing.cubic));
  const fotoY = ci(frame, [163, 183], [40, 0], Easing.out(Easing.cubic));

  const nomeOp = ci(frame, [170, 186], [0, 1], Easing.out(Easing.cubic));
  const nomeY = ci(frame, [170, 186], [20, 0], Easing.out(Easing.cubic));

  const cargoOp = ci(frame, [175, 191], [0, 1], Easing.out(Easing.cubic));
  const cargoY = ci(frame, [175, 191], [20, 0], Easing.out(Easing.cubic));

  return (
    <AbsoluteFill style={{ opacity: bgOp * finalFade, backgroundColor: COLOR_CAUSA.cinematic }}>
      <NoiseOverlay opacity={0.04} />
      <DustParticles count={20} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${microZoom})` }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', marginBottom: 56 }}>
          {pill('SAÚDE', 63)}
          {pill('EDUCAÇÃO', 81)}
          {pill('ASSISTÊNCIA SOCIAL', 117)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              width: 208,
              height: 208,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${COLOR_CAUSA.gold}`,
              boxShadow: `0 0 40px rgba(52,131,250,0.3)`,
              opacity: fotoOp,
              transform: `translateY(${fotoY}px)`,
              marginBottom: 24,
            }}
          >
            <AssetImage file={assets.avatarPerfil} label="ANA NOVAIS" style={{ width: '100%', height: '100%' }} />
          </div>

          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 78,
              letterSpacing: -1,
              color: COLOR_CAUSA.textLight,
              opacity: nomeOp,
              transform: `translateY(${nomeY}px)`,
            }}
          >
            ANA NOVAIS
          </div>
          <div
            style={{
              fontFamily: FONT.sans,
              fontWeight: 400,
              fontSize: 28,
              letterSpacing: 8,
              color: COLOR_CAUSA.accent,
              marginTop: 10,
              opacity: cargoOp,
              transform: `translateY(${cargoY}px)`,
            }}
          >
            DEPUTADA FEDERAL
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
