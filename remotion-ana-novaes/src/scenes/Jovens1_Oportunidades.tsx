import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { DustParticles, NoiseOverlay } from '../lib/Background';
import { NewsSheet, RoughFilter } from '../lib/Newsprint';
import { ED, edIn } from '../lib/editorial';
import { JOVENS_SCENES, WORD } from '../jovens-timing';
import type { JovensAssets } from '../jovens-timing';

// Cena 1 — As Oportunidades | frames 0–160
// "Ana Novais quer ampliar as oportunidades para os jovens entrarem
// preparados no mercado de trabalho!"
// Roxo profundo, Dolly In. A Ana é recorte de jornal (P&B + halftone,
// contorno amarelo rasgado). Atrás dela, duas fotos rasgadas P&B a 40%:
// jovens (em "jovens") e ambiente de trabalho moderno (em "mercado").
// OPORTUNIDADES nasce atrás da Ana e cruza para a frente dela.
// MERCADO DE TRABALHO! crava num bloco branco. Saída Z-DIVE em
// OPORTUNIDADES com cortina amarela; Ana e colagem deslizam pra esquerda.
const S = JOVENS_SCENES.c1;
const EXIT = 138; // "trabalho!" termina em 137 — sai só depois de lido

/** Polígono de borda rasgada irregular (determinístico por seed). */
const torn = (seed: number) => {
  const r = (n: number) => {
    const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const N = 16;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) pts.push(`${(i / N) * 100}% ${r(i) * 5}%`);
  for (let i = 1; i <= N; i++) pts.push(`${100 - r(i + 30) * 4}% ${(i / N) * 100}%`);
  for (let i = 1; i <= N; i++) pts.push(`${100 - (i / N) * 100}% ${100 - r(i + 60) * 5}%`);
  for (let i = 1; i < N; i++) pts.push(`${r(i + 90) * 4}% ${100 - (i / N) * 100}%`);
  return `polygon(${pts.join(',')})`;
};

const TornPhoto: React.FC<{ frame: number; at: number; file: string; w: number; h: number; pos: string; seed: number; rot: number }> = ({
  frame, at, file, w, h, pos, seed, rot,
}) => {
  const p = ci(frame, [at, at + 24], [0, 1], Easing.out(Easing.cubic));
  return (
    <div style={{ opacity: 0.4 * p, transform: `translateY(${50 * (1 - p)}px) rotate(${rot}deg)`, filter: `blur(${12 * (1 - p)}px)` }}>
      <div style={{ position: 'relative', width: w, height: h, clipPath: torn(seed), background: '#E6E2DA', padding: 12 }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <Img src={staticFile(`assets/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1) contrast(1.3)' }} />
          <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.35, backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1.2px, transparent 1.8px)', backgroundSize: '6px 6px' }} />
        </div>
      </div>
    </div>
  );
};

export const Jovens1_Oportunidades: React.FC<{ assets: JovensAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const dolly = ci(frame, [0, S.duration], [1, 1.05], Easing.out(Easing.cubic));
  const pIn = ci(frame, [0, 30], [0, 1], Easing.out(Easing.cubic));
  const cut = staticFile(`assets/${assets.anaCutout}`);

  const tear = (dir: number, d = 0) => {
    const p = ci(frame, [EXIT + d, EXIT + d + 22], [0, 1], Easing.inOut(Easing.cubic));
    return { transform: `translateX(${1200 * dir * p}px) rotate(${8 * dir * p}deg)`, filter: `blur(${20 * p}px)`, opacity: 1 - ci(p, [0.4, 1], [0, 1]) };
  };
  const dive = ci(frame, [EXIT + 2, EXIT + 22], [0, 1], Easing.in(Easing.cubic));
  const blind = ci(frame, [EXIT + 12, S.duration], [0, 1], Easing.in(Easing.cubic));
  const diving = frame >= EXIT + 2;

  const opStyle = { ...edIn(frame, WORD.oportunidades, { y: 0, trackFrom: -10, trackTo: -4 }) };
  const opWord = (clip?: string) => (
    <div style={{ position: 'absolute', top: 1000, left: 0, right: 0, textAlign: 'center', clipPath: clip }}>
      <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 92, lineHeight: 1, color: ED.yellow, whiteSpace: 'nowrap', textShadow: '0 16px 50px rgba(0,0,0,0.6)', ...opStyle }}>
        OPORTUNIDADES
      </span>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: ED.void, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(122,75,148,0.4), transparent 70%)' }} />
      <NoiseOverlay opacity={0.09} />
      <DustParticles count={30} />
      <RoughFilter id="rough-ana-j" />

      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {/* ANA NOVAIS / quer ampliar as */}
        <div style={{ position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', ...tear(-1, 2) }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 300, fontSize: 58, color: '#FFFFFF', ...edIn(frame, WORD.ana, { trackFrom: 0, trackTo: 5, y: 20, blur: 8 }) }}>
            ANA NOVAIS
          </span>
          <div style={{ marginTop: 10 }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 54, color: ED.lilac, ...edIn(frame, WORD.ampliar - 8, { y: 14, trackFrom: -4, trackTo: -1 }) }}>
              quer ampliar as
            </span>
          </div>
        </div>

        {/* Colagem atrás: folhas de jornal + fotos rasgadas a 40% */}
        <div style={{ ...tear(-1), opacity: pIn * (tear(-1).opacity as number) }}>
          <NewsSheet w={520} h={480} seed={5} style={{ top: 420, left: 520, transform: 'rotate(5deg)' }} />
          <NewsSheet w={440} h={320} seed={9} tone="#D9D4CB" style={{ top: 900, left: 20, transform: 'rotate(-4deg)' }} />
        </div>
        <div style={{ position: 'absolute', top: 420, left: 20, ...tear(-1, 1) }}>
          <TornPhoto frame={frame} at={WORD.jovens - 10} file={assets.grupo} w={600} h={390} pos="50% 40%" seed={2} rot={-5} />
        </div>
        <div style={{ position: 'absolute', top: 800, left: 460, ...tear(-1, 1) }}>
          <TornPhoto frame={frame} at={WORD.mercado - 12} file={assets.escritorio} w={590} h={350} pos="55% 60%" seed={6} rot={4} />
        </div>

        {/* OPORTUNIDADES — camada de trás (inteira) */}
        {!diving && <div style={{ ...tear(-1, 3) }}>{opWord()}</div>}

        {/* Ana — recorte de jornal */}
        <div style={{ position: 'absolute', top: 410, left: 265, width: 550, ...tear(-1) }}>
          <div style={{ opacity: pIn, filter: `brightness(${pIn}) blur(${20 * (1 - pIn)}px)`, transform: 'rotate(2deg)', position: 'relative' }}>
            <div
              style={{
                position: 'absolute', inset: 0, background: ED.yellow, transform: 'scale(1.08) translate(4px, 6px)', transformOrigin: '50% 60%',
                maskImage: `url(${cut})`, WebkitMaskImage: `url(${cut})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
                filter: 'url(#rough-ana-j) drop-shadow(0 40px 60px rgba(0,0,0,0.6))',
              }}
            />
            <div style={{ position: 'relative' }}>
              <Img src={cut} style={{ display: 'block', width: 550, filter: 'grayscale(1) contrast(1.2) brightness(1.02)' }} />
              <div
                style={{
                  position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.28,
                  backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1.1px, transparent 1.7px)', backgroundSize: '6px 6px',
                  maskImage: `url(${cut})`, WebkitMaskImage: `url(${cut})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
                }}
              />
            </div>
          </div>
        </div>

        {/* OPORTUNIDADES — camada da frente: entra por TRÁS da Ana (a camada de
            trás aparece primeiro) e em seguida cruza para a frente dela, inteira
            e legível */}
        {!diving && <div style={{ ...tear(-1, 3), opacity: ci(frame, [WORD.oportunidades + 10, WORD.oportunidades + 18], [0, 1]) * (tear(-1, 3).opacity as number) }}>{opWord()}</div>}

        {/* PARA OS JOVENS */}
        <div style={{ position: 'absolute', top: 1102, left: 0, right: 0, textAlign: 'center', ...tear(1, 3) }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 72, lineHeight: 1, color: ED.yellow, whiteSpace: 'nowrap', textShadow: '0 12px 40px rgba(0,0,0,0.7)', ...edIn(frame, WORD.jovens - 6, { y: 14, trackFrom: -6, trackTo: -2 }) }}>
            PARA OS JOVENS
          </span>
        </div>

        {/* entrarem preparados no / MERCADO DE / TRABALHO! — em três linhas,
            dentro da margem de segurança do Reels */}
        <div style={{ position: 'absolute', top: 1192, left: 0, right: 0, textAlign: 'center', ...tear(1, 5) }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 42, color: '#FFFFFF', textShadow: '0 8px 30px rgba(0,0,0,0.8)', ...edIn(frame, WORD.entrarem, { y: 12, trackFrom: -3, trackTo: 0 }) }}>
            ENTRAREM PREPARADOS NO
          </span>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#FFFFFF', padding: '12px 30px 6px', transform: 'rotate(-2deg)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', ...edIn(frame, WORD.mercado, { y: 30, blur: 12, trackFrom: 0, trackTo: 0 }), letterSpacing: undefined }}>
              <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 70, lineHeight: 1, color: ED.void, whiteSpace: 'nowrap', ...edIn(frame, WORD.mercado, { y: 0, blur: 0, trackFrom: -6, trackTo: -2 }) }}>
                MERCADO DE
              </span>
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: '#FFFFFF', padding: '12px 30px 6px', transform: 'rotate(1.5deg)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', ...edIn(frame, WORD.mercado + 8, { y: 30, blur: 12, trackFrom: 0, trackTo: 0 }), letterSpacing: undefined }}>
              <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 70, lineHeight: 1, color: ED.void, whiteSpace: 'nowrap', ...edIn(frame, WORD.mercado + 8, { y: 0, blur: 0, trackFrom: -6, trackTo: -2 }) }}>
                TRABALHO!
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Z-DIVE em OPORTUNIDADES */}
      {diving && (
        <AbsoluteFill style={{ transform: `scale(${dolly * (1 + 29 * dive)})`, transformOrigin: '50% 54%', opacity: 1 - ci(dive, [0.6, 1], [0, 1]) }}>
          {opWord()}
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: blind }} />
    </AbsoluteFill>
  );
};
