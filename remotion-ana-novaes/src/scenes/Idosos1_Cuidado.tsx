import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { DustParticles, NoiseOverlay } from '../lib/Background';
import { NewsSheet, RoughFilter } from '../lib/Newsprint';
import { ED, edIn, outP } from '../lib/editorial';
import { IDOSOS_SCENES, WORD } from '../idosos-timing';
import type { IdososAssets } from '../idosos-timing';

// Cena 1 — A Postura e o Cuidado | frames 0–125
// "Ana Novais quer fortalecer a proteção e o cuidado com as pessoas idosas!"
// Roxo profundo com grão e folhas de jornal rasgadas. A Ana é um recorte de
// jornal cinematográfico (P&B + halftone, contorno amarelo rasgado
// seguindo a silhueta, como na referência) e emerge da sombra; ANA NOVAIS acende no topo e QUER FORTALECER A
// entra na fala. A polaroid do casal de idosos desliza ao lado e PROTEÇÃO E
// CUIDADO abraça a imagem. Saída Z-DIVE: CUIDADO explode e cega de amarelo,
// fotos rasgam para as laterais.
const S = IDOSOS_SCENES.c1;
const L = (f: number) => f - S.from;
const EXIT = 104;

export const Idosos1_Cuidado: React.FC<{ assets: IdososAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const dolly = ci(frame, [0, S.duration], [1, 1.08], Easing.out(Easing.cubic));
  const pIn = ci(frame, [0, 30], [0, 1], Easing.out(Easing.cubic));
  const polA = L(WORD.protecao) - 8;
  const polP = ci(frame, [polA, polA + 26], [0, 1], Easing.out(Easing.cubic));

  const tear = (dir: number, d = 0) => {
    const p = outP(frame, EXIT + d, 18);
    return { transform: `translateX(${1200 * dir * p}px) rotate(${8 * dir * p}deg)`, filter: `blur(${20 * p}px)`, opacity: 1 - ci(p, [0.4, 1], [0, 1]) };
  };
  const dive = outP(frame, EXIT + 6, 15);
  const blind = ci(frame, [EXIT + 12, S.duration], [0, 1], Easing.in(Easing.cubic));

  return (
    <AbsoluteFill style={{ backgroundColor: ED.void, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 45% 35%, rgba(122,75,148,0.4), transparent 70%)' }} />
      <NoiseOverlay opacity={0.09} />
      <DustParticles count={30} />
      <RoughFilter id="rough-ana" />

      <AbsoluteFill style={{ transform: `scale(${dolly})` }}>
        {/* ANA NOVAIS */}
        <div style={{ position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', ...tear(-1, 2) }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 300, fontSize: 54, color: '#FFFFFF', ...edIn(frame, WORD.ana, { trackFrom: 0, trackTo: 5, y: 20, blur: 8 }) }}>
            ANA NOVAIS
          </span>
        </div>

        {/* Folhas de jornal rasgadas atrás do recorte */}
        <div style={{ ...tear(-1), opacity: pIn * (tear(-1).opacity as number) }}>
          <NewsSheet w={620} h={560} seed={3} style={{ top: 230, left: -60, transform: 'rotate(-6deg)' }} />
          <NewsSheet w={420} h={300} seed={7} tone="#D9D4CB" style={{ top: 700, left: 360, transform: 'rotate(4deg)' }} />
        </div>

        {/* Ana — recorte de jornal: contorno amarelo rasgado + P&B halftone */}
        <div style={{ position: 'absolute', top: 250, left: 90, width: 600, ...tear(-1) }}>
          <div style={{ opacity: pIn, filter: `brightness(${pIn}) blur(${20 * (1 - pIn)}px)`, transform: 'rotate(-3deg)', position: 'relative' }}>
            <div
              style={{
                position: 'absolute', inset: 0, background: ED.yellow, transform: 'scale(1.1) translate(6px, 4px)', transformOrigin: '50% 60%',
                maskImage: `url(${staticFile(`assets/${assets.anaCutout}`)})`, WebkitMaskImage: `url(${staticFile(`assets/${assets.anaCutout}`)})`,
                maskSize: '100% 100%', WebkitMaskSize: '100% 100%', filter: 'url(#rough-ana) drop-shadow(0 40px 60px rgba(0,0,0,0.6))',
              }}
            />
            <div style={{ position: 'relative' }}>
              <Img src={staticFile(`assets/${assets.anaCutout}`)} style={{ display: 'block', width: 600, filter: 'grayscale(1) contrast(1.2) brightness(1.05)' }} />
              <div
                style={{
                  position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.28,
                  backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1.1px, transparent 1.7px)', backgroundSize: '6px 6px',
                  maskImage: `url(${staticFile(`assets/${assets.anaCutout}`)})`, WebkitMaskImage: `url(${staticFile(`assets/${assets.anaCutout}`)})`,
                  maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
                }}
              />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 10, top: 640, ...edIn(frame, L(WORD.fortalecer), { y: 14, blur: 10, trackFrom: -4, trackTo: -1 }) }}>
            <span style={{ display: 'inline-block', background: ED.yellow, padding: '10px 22px 6px', fontFamily: ED.sans, fontWeight: 900, fontSize: 44, color: ED.void, transform: 'rotate(-2deg)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
              QUER FORTALECER A
            </span>
          </div>
        </div>

        {/* Polaroid — casal de idosos */}
        <div
          style={{
            position: 'absolute', top: 470, left: 530, ...tear(1, 1),
          }}
        >
          <div
            style={{
              background: '#FFFFFF', padding: '14px 14px 52px', boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
              opacity: polP, filter: `blur(${15 * (1 - polP)}px)`, transform: `translateY(${80 * (1 - polP)}px) rotate(${-3 * polP + 4}deg)`,
            }}
          >
            <Img src={staticFile(`assets/${assets.casalIdosos}`)} style={{ display: 'block', width: 480, height: 320, objectFit: 'cover', objectPosition: '50% 40%' }} />
          </div>
        </div>

        {/* PROTEÇÃO E CUIDADO */}
        <div style={{ position: 'absolute', top: 1060, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ ...tear(-1, 3) }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 96, lineHeight: 1, color: '#FFFFFF', textShadow: '0 12px 40px rgba(0,0,0,0.6)', ...edIn(frame, L(WORD.protecao), { y: 0, trackFrom: -8, trackTo: -3 }) }}>
              PROTEÇÃO E
            </span>
          </div>
          <div style={{ transform: `scale(${1 + 29 * dive})`, opacity: 1 - ci(dive, [0.6, 1], [0, 1]) }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 176, lineHeight: 1, color: ED.yellow, textShadow: '0 16px 50px rgba(0,0,0,0.6)', ...edIn(frame, L(WORD.cuidado), { y: 0, trackFrom: -12, trackTo: -6 }) }}>
              CUIDADO
            </span>
          </div>
          <div style={{ marginTop: 12, ...tear(1, 4) }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 50, color: ED.lilac, ...edIn(frame, L(WORD.pessoas), { y: 14, trackFrom: -4, trackTo: 0 }) }}>
              COM AS PESSOAS IDOSAS
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: blind }} />
    </AbsoluteFill>
  );
};
