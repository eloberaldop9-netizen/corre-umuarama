import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { NewsSheet, RoughFilter } from '../lib/Newsprint';
import { TornPhoto } from '../lib/TornPhoto';
import { ED, edIn } from '../lib/editorial';
import { FEMININO_SCENES, WORD } from '../feminino-timing';
import type { FemininoAssets } from '../feminino-timing';

// Cena 1 — O Sonho e o Negócio | frames 0–176
// "Ana Novais quer ampliar as oportunidades para mulheres que sonham em abrir
// ou fazer crescer o próprio negócio!"
// Capa de revista de negócios no papel off-white/lilás, Dolly In lento. A Ana
// é recorte de jornal (P&B + retícula, contorno amarelo rasgado) à esquerda;
// à direita, fotos rasgadas de mulheres empreendendo (dona de padaria em
// "mulheres", empreendedora despachando pedidos em "abrir"). Manchete:
// OPORTUNIDADES / PARA MULHERES, a linha fina "que sonham em abrir ou fazer
// crescer" e O PRÓPRIO NEGÓCIO! cravado na base em amarelo com borda roxa.
// Saída: Z-DIVE em NEGÓCIO (cega em amarelo); colagem rasga para as laterais.
const S = FEMININO_SCENES.c1;
const EXIT = 156; // "negócio!" termina em 160 — já lido

export const Feminino1_Sonho: React.FC<{ assets: FemininoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const dolly = ci(frame, [0, S.duration], [1, 1.05], Easing.out(Easing.cubic));
  const pIn = ci(frame, [0, 30], [0, 1], Easing.out(Easing.cubic));
  const anaIn = ci(frame, [10, 40], [0, 1], Easing.out(Easing.cubic));
  const cut = staticFile(`assets/${assets.anaCutout}`);

  const tear = (dir: number, d = 0) => {
    const p = ci(frame, [EXIT + d, EXIT + d + 20], [0, 1], Easing.inOut(Easing.cubic));
    return { transform: `translateX(${1200 * dir * p}px) rotate(${8 * dir * p}deg)`, filter: `blur(${20 * p}px)`, opacity: 1 - ci(p, [0.4, 1], [0, 1]) };
  };
  const dive = ci(frame, [EXIT + 2, S.duration], [0, 1], Easing.in(Easing.cubic));
  const blind = ci(frame, [EXIT + 10, S.duration], [0, 1], Easing.in(Easing.cubic));
  const diving = frame >= EXIT + 2;
  const block = (at: number, rot: number) => {
    const p = ci(frame, [at - 4, at + 18], [0, 1], Easing.out(Easing.cubic));
    return { opacity: p, filter: `blur(${12 * (1 - p)}px)`, transform: `translateY(${40 * (1 - p)}px) rotate(${rot}deg)` };
  };

  const negocio = (
    <div style={{ position: 'absolute', top: 1282, left: 0, right: 0, textAlign: 'center' }}>
      <span
        style={{
          display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 130, lineHeight: 1, color: ED.yellow, whiteSpace: 'nowrap',
          WebkitTextStroke: `12px ${ED.void}`, paintOrder: 'stroke fill', filter: 'drop-shadow(0 24px 30px rgba(45,22,67,0.55))',
          ...edIn(frame, WORD.proprio + 2, { dur: 18, y: 0, blur: 20, trackFrom: -8, trackTo: -3 }),
        }}
      >
        NEGÓCIO!
      </span>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: ED.paper, overflow: 'hidden' }}>
      <AbsoluteFill style={{ mixBlendMode: 'multiply', opacity: 0.6, backgroundImage: 'repeating-linear-gradient(115deg, rgba(60,30,80,0.05) 0 2px, transparent 2px 7px), repeating-linear-gradient(25deg, rgba(60,30,80,0.035) 0 3px, transparent 3px 10px)' }} />
      <NoiseOverlay opacity={0.04} />
      <RoughFilter id="rough-ana-f" />

      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {/* ANA NOVAIS / quer ampliar as */}
        <div style={{ position: 'absolute', top: 240, left: 0, right: 0, textAlign: 'center', ...tear(-1, 2) }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 300, fontSize: 60, color: ED.void, ...edIn(frame, WORD.ana, { trackFrom: 0, trackTo: 6, y: 20, blur: 8 }) }}>
            ANA NOVAIS
          </span>
          <div style={{ marginTop: 6 }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 54, color: ED.brandCore, ...edIn(frame, WORD.ampliar - 8, { y: 14, trackFrom: -4, trackTo: -1 }) }}>
              quer ampliar as
            </span>
          </div>
        </div>

        {/* Colagem: folhas de jornal + mulheres empreendendo */}
        <div style={{ ...tear(1), opacity: pIn * (tear(1).opacity as number) }}>
          <NewsSheet w={520} h={420} seed={11} style={{ top: 440, left: 470, transform: 'rotate(-4deg)' }} />
          <NewsSheet w={380} h={300} seed={4} tone="#D9D4CB" style={{ top: 420, left: 30, transform: 'rotate(5deg)' }} />
        </div>
        <div style={{ position: 'absolute', top: 430, left: 490, ...tear(1, 1) }}>
          <TornPhoto frame={frame} at={WORD.mulheres - 8} file={assets.padaria} w={520} h={350} pos="65% 30%" seed={3} rot={4} />
        </div>
        <div style={{ position: 'absolute', top: 740, left: 500, ...tear(1, 2) }}>
          <TornPhoto frame={frame} at={WORD.abrir - 8} file={assets.laptop} w={500} h={330} pos="55% 50%" seed={8} rot={-3} />
        </div>

        {/* Ana — recorte de jornal à esquerda */}
        <div style={{ position: 'absolute', top: 390, left: 90, width: 400, ...tear(-1) }}>
          <div style={{ opacity: anaIn, transform: `translateY(${60 * (1 - anaIn)}px) rotate(-2deg)`, filter: `blur(${16 * (1 - anaIn)}px)`, position: 'relative' }}>
            <div
              style={{
                position: 'absolute', inset: 0, background: ED.yellow, transform: 'scale(1.07) translate(4px, 6px)', transformOrigin: '50% 60%',
                maskImage: `url(${cut})`, WebkitMaskImage: `url(${cut})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
                filter: 'url(#rough-ana-f) drop-shadow(18px 30px 30px rgba(45,22,67,0.45))',
              }}
            />
            <div style={{ position: 'relative' }}>
              <Img src={cut} style={{ display: 'block', width: 400, filter: 'grayscale(1) contrast(1.2) brightness(1.03)' }} />
              <div
                style={{
                  position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.26,
                  backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1.1px, transparent 1.7px)', backgroundSize: '6px 6px',
                  maskImage: `url(${cut})`, WebkitMaskImage: `url(${cut})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Manchete */}
        <div style={{ position: 'absolute', top: 950, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', ...tear(1, 3) }}>
          <div style={{ background: ED.void, padding: '14px 34px 8px', boxShadow: '0 24px 50px rgba(45,22,67,0.4)', ...block(WORD.oportunidades, -1.5) }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 82, lineHeight: 1, color: '#FFFFFF', whiteSpace: 'nowrap', ...edIn(frame, WORD.oportunidades, { y: 0, blur: 0, trackFrom: -6, trackTo: -3 }) }}>
              OPORTUNIDADES
            </span>
          </div>
          <div style={{ marginTop: 12, background: ED.yellow, padding: '12px 30px 6px', boxShadow: '0 20px 40px rgba(45,22,67,0.3)', ...block(WORD.mulheres - 6, 1.5) }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 72, lineHeight: 1, color: ED.void, whiteSpace: 'nowrap', ...edIn(frame, WORD.mulheres - 6, { y: 0, blur: 0, trackFrom: -6, trackTo: -3 }) }}>
              PARA MULHERES
            </span>
          </div>
          <div style={{ marginTop: 18, background: ED.paper, padding: '6px 20px', borderRadius: 999, ...edIn(frame, WORD.sonham - 4, { y: 12, trackFrom: -3, trackTo: -1 }) }}>
            <span style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 38, color: ED.brandCore, whiteSpace: 'nowrap' }}>que sonham em abrir ou fazer crescer</span>
          </div>
          <div style={{ marginTop: 8, background: ED.paper, padding: '4px 22px', borderRadius: 999, ...edIn(frame, WORD.proprio - 6, { dur: 18, y: 12, trackFrom: -4, trackTo: -1 }) }}>
            <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 58, color: ED.void, whiteSpace: 'nowrap' }}>O PRÓPRIO</span>
          </div>
        </div>
        {!diving && negocio}
      </AbsoluteFill>

      {/* Z-DIVE em NEGÓCIO */}
      {diving && (
        <AbsoluteFill style={{ transform: `scale(${dolly * (1 + 29 * dive)})`, transformOrigin: '50% 70%', opacity: 1 - ci(dive, [0.6, 1], [0, 1]) }}>
          {negocio}
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: blind }} />
    </AbsoluteFill>
  );
};
