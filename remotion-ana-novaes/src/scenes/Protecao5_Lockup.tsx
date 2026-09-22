import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../lib/motion';
import { Grain, HalftoneDots, NewsprintTexture } from '../lib/collage';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_PROTECAO as C, FONT_PROTECAO as F, TRACK } from '../lib/palette-protecao';
import { PROTECAO_SCENES } from '../protecao-timing';
import type { ProtecaoAssets } from '../VideoAnaNovaisProtecao';

// Cena 5 — Lockup Institucional | frames locais 0–120
// Silêncio e autoridade: gradiente radial roxo limpo, retrato institucional
// sob scrim, pill DEPUTADA FEDERAL → Ana Novais → base curva com 2010.
// A borda da base é rasgada (última assinatura da estética de colagem).
// Micro-zoom contínuo e fade cinematográfico nos últimos 20 frames.
const S = PROTECAO_SCENES.c5;

export const Protecao5_Lockup: React.FC<{ assets: ProtecaoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = ci(frame, [0, S.duration], [1, 1.035], Easing.inOut(Easing.quad));
  const bgOp = ci(frame, [0, 12], [0, 1]);

  const pillSc = ci(frame, [10, 28], [0, 1], Easing.out(Easing.cubic));
  const nameP = ci(frame, [20, 40], [0, 1], Easing.out(Easing.cubic));
  const baseY = ci(frame, [35, 58], [260, 0], Easing.out(Easing.cubic));
  const numSp = spring({ frame, fps, config: { damping: 12, mass: 1 }, delay: 45 });
  const fade = ci(frame, [S.duration - 20, S.duration], [1, 0]);

  return (
    <AbsoluteFill style={{ opacity: bgOp * fade, backgroundColor: C.voidDeep }}>
      <AbsoluteFill style={{ transform: `scale(${zoom * 1.04})` }}>
        <AssetImage file={assets.retratoOficial} label="RETRATO INSTITUCIONAL" style={{ width: '100%', height: '100%', objectPosition: '50% 22%' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${C.brandCore}E0 0%, ${C.voidDeep}F5 78%)` }} />
      <HalftoneDots size={8} opacity={0.12} color="rgba(0,0,0,1)" />
      <Grain opacity={0.12} />

      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div style={{ position: 'absolute', top: 560, left: 0, right: 0, textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block', backgroundColor: C.yellow, borderRadius: 999, padding: '16px 46px',
              opacity: ci(frame, [10, 18], [0, 1]), transform: `scaleX(${pillSc})`, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 36, letterSpacing: TRACK, color: C.voidDeep }}>DEPUTADA FEDERAL</span>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 660, left: 0, right: 0, textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block', fontFamily: F.sans, fontWeight: 800, fontSize: 116, letterSpacing: TRACK, color: C.lilac,
              opacity: nameP, transform: `translateY(${20 * (1 - nameP)}px)`, filter: `blur(${15 * (1 - nameP)}px)`,
              textShadow: '0 10px 40px rgba(0,0,0,0.45)',
            }}
          >
            Ana Novais
          </span>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 640, transform: `translateY(${baseY}px)`, opacity: ci(frame, [35, 45], [0, 1]) }}>
          {/* borda de papel rasgado por trás da curva */}
          <div
            style={{
              position: 'absolute', inset: '-26px 0 0 0', background: C.paper,
              borderTopLeftRadius: '52% 100px', borderTopRightRadius: '52% 100px',
              clipPath: 'polygon(0% 6%, 8% 3%, 16% 7%, 25% 2%, 34% 5%, 43% 1%, 52% 4%, 61% 0%, 70% 4%, 79% 1%, 88% 6%, 100% 3%, 100% 100%, 0% 100%)',
            }}
          >
            <NewsprintTexture opacity={0.2} />
          </div>
          <div
            style={{
              position: 'absolute', inset: 0, backgroundColor: C.brandCore,
              borderTopLeftRadius: '52% 90px', borderTopRightRadius: '52% 90px', boxShadow: '0 -30px 80px rgba(0,0,0,0.35)',
            }}
          />
          <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block', fontFamily: F.sans, fontWeight: 900, fontSize: 230, letterSpacing: -4, color: C.textLight,
                opacity: ci(frame, [45, 55], [0, 1]), transform: `scale(${ci(numSp, [0, 1], [0.8, 1])})`,
                filter: `blur(${ci(frame, [45, 62], [20, 0])}px)`,
              }}
            >
              2010
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
