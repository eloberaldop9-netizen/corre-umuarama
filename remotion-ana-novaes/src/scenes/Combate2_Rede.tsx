import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { AssetImage } from '../lib/AssetImage';
import { COLOR_COMBATE } from '../lib/palette-combate';
import { FONT } from '../lib/palette';
import type { CombateAssets } from '../VideoAnaNovaisCombate';

// Cena 2 — A Rede (Colagem Editorial) | frames locais 0–324 (10.8s)
// Corte Editorial — VERBO Motion O.S. v5.0. Apenas 3 cards, espaçados como
// fotos reveladas sobre a mesa: "MAIS RECURSOS" (tape), "ACOLHIMENTO" e
// "PATRULHA" (fotos, borda branca). Sem texto flutuante, sem stagger
// nervoso — pan horizontal suave, entrada translateY+blur (sem spring).
// Transcrição real (offset from=115): "recursos"@83 "acolhimento"@184
// "Patrulhas"@202 (oração termina ~323).
export const Combate2_Rede: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();

  const bgOp = ci(frame, [0, 15], [0, 1], Easing.out(Easing.quad));
  const panX = ci(frame, [0, 324], [-90, 90], Easing.inOut(Easing.quad));

  // Luz ambiente — respiração lenta, sem flicker nervoso
  const lampGlow = 0.32 + Math.sin(frame * 0.025) * 0.05;

  const recursosP = ci(frame, [83, 117], [0, 1], Easing.out(Easing.cubic));
  const acolhimentoP = ci(frame, [184, 218], [0, 1], Easing.out(Easing.cubic));
  const patrulhaP = ci(frame, [202, 236], [0, 1], Easing.out(Easing.cubic));

  // Saída (290–318) — WIPE VARRE: bloco roxo atropela os cards pra esquerda,
  // varrendo até o handoff com a Cena 3 (overlap de 7 frames, local 317).
  const wipeP = ci(frame, [292, 318], [0, 1], Easing.in(Easing.exp));
  const wipeX = interp(wipeP, -1400, 1400);
  const exitP = ci(frame, [290, 316], [0, 1], Easing.in(Easing.exp));

  const photoCard = (
    file: string | null | undefined,
    label: string,
    p: number,
    rotate: number,
    left: number,
    top: number,
    size: number
  ) => (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        opacity: ci(p, [0, 0.3], [0, 1]),
        transform: `translateY(${ci(p, [0, 1], [100, 0])}px) rotateZ(${rotate}deg) translateX(${exitP * -1500}px)`,
        filter: `blur(${ci(p, [0, 1], [10, 0]) + exitP * 20}px)`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          border: '16px solid #fff',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        <AssetImage file={file} label={label} tone="light" style={{ width: '100%', height: '100%', filter: 'contrast(1.05)' }} />
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ opacity: bgOp }}>
      <AbsoluteFill style={{ backgroundColor: '#3A1254' }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(115deg, rgba(0,0,0,0.09) 0px, transparent 2px, transparent 5px),
            repeating-linear-gradient(25deg, rgba(0,0,0,0.07) 0px, transparent 3px, transparent 8px)`,
          mixBlendMode: 'multiply',
          opacity: 0.55,
        }}
      />
      {/* Luz ambiente — respiração lenta, sempre viva sem ser nervosa */}
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          width: 900,
          height: 900,
          marginLeft: -450,
          marginTop: -450,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,235,180,${lampGlow}) 0%, transparent 65%)`,
        }}
      />
      <NoiseOverlay opacity={0.06} />

      <AbsoluteFill style={{ transform: `translateX(${panX}px)` }}>
        {/* Card 1 — "MAIS RECURSOS", fundo neutro + tape amarelo, sem foto */}
        <div
          style={{
            position: 'absolute',
            left: 110,
            top: 460,
            width: 420,
            height: 420,
            opacity: ci(recursosP, [0, 0.3], [0, 1]),
            transform: `translateY(${ci(recursosP, [0, 1], [100, 0])}px) rotateZ(-4deg) translateX(${exitP * -1500}px)`,
            filter: `blur(${ci(recursosP, [0, 1], [10, 0]) + exitP * 20}px)`,
            backgroundColor: COLOR_COMBATE.paperLight,
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: COLOR_COMBATE.yellow,
              padding: '14px 30px',
              transform: 'rotate(-2deg)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontFamily: FONT.sans, fontWeight: 800, fontSize: 40, letterSpacing: -0.5, color: COLOR_COMBATE.voidDeep, whiteSpace: 'nowrap' }}>
              MAIS RECURSOS
            </span>
          </div>
        </div>

        {/* Card 2 — Acolhimento (foto) */}
        {photoCard(assets.fotoAcolhimento, 'ACOLHIMENTO SEGURO', acolhimentoP, 3, 560, 860, 440)}

        {/* Card 3 — Patrulha (foto) */}
        {photoCard(assets.fotoPatrulha, 'PATRULHA MARIA DA PENHA', patrulhaP, -6, 120, 1360, 440)}
      </AbsoluteFill>

      {/* Bloco roxo diagonal — WIPE VARRE pra Cena 3 */}
      <AbsoluteFill
        style={{
          opacity: wipeP > 0 ? 1 : 0,
          transform: `translateX(${wipeX}px) skewX(-20deg)`,
          backgroundColor: COLOR_COMBATE.voidDeep,
        }}
      />
    </AbsoluteFill>
  );
};

const interp = (v: number, from: number, to: number) => from + (to - from) * v;
