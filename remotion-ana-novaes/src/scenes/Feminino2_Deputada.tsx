import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { DustParticles, NoiseOverlay } from '../lib/Background';
import { ED, edIn } from '../lib/editorial';
import { LineIcon } from '../lib/LineIcon';
import { FEMININO_SCENES, WORD } from '../feminino-timing';
import type { FemininoAssets } from '../feminino-timing';

// Cena 2 — A Deputada e o Programa | frames locais 0–157
// "Como deputada federal, pretende defender o fortalecimento de programas de
// empreendedorismo feminino,"
// O clarão amarelo se abre no Roxo Profundo com grid sutil, pan horizontal.
//  A) Retrato institucional da Ana na tribuna (polaroid inteira) entre
//     COMO DEPUTADA FEDERAL, e "pretende defender o".
//  B) O retrato sobe e some; o selo ♀ se desenha e o bloco-herói cresce
//     palavra a palavra: FORTALECIMENTO / DE PROGRAMAS DE /
//     EMPREENDEDORISMO / FEMININO.
// Saída: tudo sobe e desfoca suavemente enquanto a cena 3 assume o mesmo
// fundo (continuidade sem corte).
export const FemininoPurpleBg: React.FC<{ shift?: number }> = ({ shift = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: ED.void }}>
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 42%, rgba(122,75,148,0.45), transparent 70%)' }} />
    <AbsoluteFill
      style={{
        opacity: 0.16, transform: `translateX(${shift}px)`,
        backgroundImage: 'linear-gradient(rgba(176,132,193,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(176,132,193,0.6) 1px, transparent 1px)',
        backgroundSize: '90px 90px', maskImage: 'radial-gradient(ellipse at 50% 45%, black 25%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, black 25%, transparent 78%)',
      }}
    />
    <NoiseOverlay opacity={0.07} />
    <DustParticles count={22} />
  </AbsoluteFill>
);

const S = FEMININO_SCENES.c2;
const L = (f: number) => f - S.from;
const B_AT = L(WORD.fortalecimento) - 8;
const EXIT = L(306); // "feminino" termina em 299 — FEMININO já nítido desde ~292

export const Feminino2_Deputada: React.FC<{ assets: FemininoAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const flash = ci(frame, [0, 12], [1, 0], Easing.out(Easing.cubic));
  const pan = ci(frame, [0, S.duration], [18, -18], Easing.inOut(Easing.sin));
  const photo = ci(frame, [3, 26], [0, 1], Easing.out(Easing.cubic));
  const aOut = ci(frame, [B_AT, B_AT + 18], [0, 1], Easing.inOut(Easing.cubic));
  const out = ci(frame, [EXIT, EXIT + 20], [0, 1], Easing.inOut(Easing.cubic));
  const badge = ci(frame, [L(WORD.fortalecimento) - 6, L(WORD.fortalecimento) + 12], [0, 1], Easing.out(Easing.cubic));
  const word = (at: number, size: number, color: string, track: [number, number] = [-6, -3]) => ({
    fontFamily: ED.sans, fontWeight: 900, fontSize: size, lineHeight: 1.02, color, whiteSpace: 'nowrap' as const,
    textShadow: '0 16px 50px rgba(0,0,0,0.55)', ...edIn(frame, at, { dur: 20, y: 24, blur: 16, trackFrom: track[0], trackTo: track[1] }),
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <FemininoPurpleBg shift={pan} />

      {/* Batida A — retrato institucional */}
      <AbsoluteFill style={{ transform: `translateX(${pan}px) translateY(${-160 * aOut}px)`, opacity: 1 - aOut, filter: `blur(${20 * aOut}px)` }}>
        <div style={{ position: 'absolute', top: 360, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 62, color: '#FFFFFF', ...edIn(frame, 3, { y: 16, trackFrom: -5, trackTo: -2 }) }}>
            COMO DEPUTADA FEDERAL,
          </span>
        </div>
        <div style={{ position: 'absolute', top: 470, left: 90, opacity: photo, filter: `blur(${14 * (1 - photo)}px)`, transform: `translateY(${60 * (1 - photo)}px) scale(${1.06 - 0.06 * photo}) rotate(-1.5deg)` }}>
          <div style={{ background: '#FFFFFF', padding: '16px 16px 60px', boxShadow: '0 40px 80px rgba(0,0,0,0.55)' }}>
            <Img src={staticFile(`assets/${assets.anaTribuna}`)} style={{ display: 'block', width: 868, height: 578, objectFit: 'cover', objectPosition: '30% 40%' }} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: 1200, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 60, color: ED.lilac, ...edIn(frame, L(WORD.pretende), { y: 14, trackFrom: -4, trackTo: -1 }) }}>
            pretende defender o
          </span>
        </div>
      </AbsoluteFill>

      {/* Batida B — bloco-herói */}
      <AbsoluteFill style={{ transform: `translateX(${pan}px) translateY(${-140 * out}px)`, opacity: 1 - out, filter: `blur(${24 * out}px)` }}>
        <div style={{ position: 'absolute', top: 540, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 150, height: 150, borderRadius: '50%', background: ED.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.45)', opacity: badge, transform: `scale(${0.7 + 0.3 * badge})`, marginBottom: 34 }}>
            <LineIcon name="venus" frame={frame} at={L(WORD.fortalecimento) - 2} size={92} color={ED.void} stroke={2} />
          </div>
          <div style={word(L(WORD.fortalecimento), 86, '#FFFFFF')}>FORTALECIMENTO</div>
          <div style={{ marginTop: 14, ...word(L(WORD.programas), 58, ED.lilac, [-4, -1]) }}>DE PROGRAMAS DE</div>
          <div style={{ marginTop: 20, ...word(L(WORD.empreendedorismo), 76, ED.yellow) }}>EMPREENDEDORISMO</div>
          <div style={word(L(WORD.feminino) - 8, 146, ED.yellow, [-10, -5])}>FEMININO</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: flash }} />
    </AbsoluteFill>
  );
};
