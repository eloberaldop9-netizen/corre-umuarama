import React from 'react';
import { AbsoluteFill, Easing, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, handheldShake } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 2 — A Mesa de Soluções | frames locais 0–262
// Papel off-white lilás, vinheta roxa, câmera handheld nervosa. As provas
// batem na mesa no frame em que são faladas: fita RECURSOS E POLÍTICAS
// PÚBLICAS, bloco ATENDIMENTO ESPECIALIZADO, polaroid ACOLHIMENTO SEGURO e
// polaroid PATRULHAS MARIA DA PENHA. Sombra dura 20/20/60 em tudo.
// Saída: WIPE EDITORIAL — tarja roxa arrasta tudo pra esquerda (stagger).
const S = COMBATE_SCENES.c2;
const L = (f: number) => f - S.from;
const EXIT = 238;
const SHADOW = '20px 20px 60px rgba(0,0,0,0.4)';
const PHOTO_SPRING = { damping: 13, mass: 0.9 };

export const Combate2_Rede: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = ci(frame, [0, 12], [1, 0], Easing.out(Easing.cubic));
  const shake = handheldShake(frame, 0.65);

  const sweep = (d: number): React.CSSProperties => {
    const p = outP(frame, EXIT + d, 20);
    return {
      transform: `translateX(${-1500 * p}px) rotate(${-10 * p}deg) scale(${1 - 0.05 * p})`,
      filter: `blur(${20 * p}px)`,
      opacity: 1 - ci(p, [0.5, 1], [0, 1]),
    };
  };
  const wipe = ci(frame, [EXIT + 2, S.duration], [1500, 0], Easing.in(Easing.exp));

  // 1) Fita RECURSOS — wipe scaleX
  const aR = L(WORD.recursos) - 4;
  const tapeW = ci(frame, [aR, aR + 18], [0, 1], Easing.out(Easing.cubic));
  // 2) Bloco ATENDIMENTO
  const aT = L(WORD.atendimento);
  const tP = ci(frame, [aT, aT + 24], [0, 1], Easing.out(Easing.cubic));
  // 3/4) Fotos — batida pesada
  const photo = (at: number, rotFrom: number, rotTo: number) => {
    const sp = spring({ frame, fps, config: PHOTO_SPRING, delay: at });
    return {
      opacity: ci(frame, [at, at + 6], [0, 1]),
      transform: `scale(${1.5 - 0.5 * sp}) rotate(${rotFrom + (rotTo - rotFrom) * sp}deg)`,
      filter: `blur(${ci(frame, [at, at + 14], [20, 0])}px)`,
    };
  };
  const aA = L(WORD.acolhimento) - 4;
  const aP = L(WORD.patrulhas) - 4;

  const polaroid = (file: string, w: number, h: number, pos: string) => (
    <div style={{ width: w, height: h, background: '#FFFFFF', padding: 16, paddingBottom: 70, boxSizing: 'border-box', boxShadow: SHADOW }}>
      <Img src={staticFile(`assets/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos }} />
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: ED.paper, overflow: 'hidden' }}>
      {/* Papel amassado */}
      <AbsoluteFill
        style={{
          mixBlendMode: 'multiply', opacity: 0.6,
          backgroundImage: `radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.8), transparent 35%),
            radial-gradient(ellipse at 70% 65%, rgba(90,60,110,0.18), transparent 40%),
            repeating-linear-gradient(118deg, rgba(60,30,80,0.06) 0 2px, transparent 2px 46px),
            repeating-linear-gradient(32deg, rgba(60,30,80,0.05) 0 1px, transparent 1px 64px)`,
        }}
      />
      <NoiseOverlay opacity={0.05} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 48%, transparent 55%, rgba(45,22,67,0.45) 100%)' }} />

      <AbsoluteFill style={{ transform: shake.transform }}>
        {/* 1 — Fita amarela rasgada */}
        <div style={{ position: 'absolute', top: 190, left: 60, ...sweep(0) }}>
          <div
            style={{
              background: ED.yellow, padding: '26px 44px 22px', boxShadow: SHADOW, transform: `rotate(-2deg) scaleX(${tapeW})`, transformOrigin: 'left',
              clipPath: 'polygon(0% 6%, 2% 0%, 98% 4%, 100% 0%, 99% 50%, 100% 96%, 97% 100%, 2% 95%, 0% 100%, 1% 50%)',
            }}
          >
            <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 58, lineHeight: 1.02, color: ED.textDark, ...edIn(frame, aR + 6, { y: 6, blur: 10, trackFrom: -3, trackTo: -1 }) }}>
              RECURSOS E<br />POLÍTICAS PÚBLICAS
            </div>
          </div>
        </div>

        {/* 2 — Bloco branco recortado */}
        <div
          style={{
            position: 'absolute', top: 440, right: 60, ...sweep(3),
            opacity: tP * (sweep(3).opacity as number),
            transform: `translateY(${50 * (1 - tP)}px) rotate(${-2 * (1 - tP)}deg) ${sweep(3).transform}`,
          }}
        >
          <div style={{ background: '#FFFFFF', padding: '24px 36px', boxShadow: SHADOW, borderLeft: `10px solid ${ED.brandCore}` }}>
            <div style={{ fontFamily: ED.sans, fontWeight: 800, fontSize: 46, lineHeight: 1.05, letterSpacing: -1, color: ED.textDark }}>
              ATENDIMENTO<br />ESPECIALIZADO
            </div>
          </div>
        </div>

        {/* 3 — Polaroid ACOLHIMENTO SEGURO */}
        <div style={{ position: 'absolute', top: 700, left: 70, ...sweep(8) }}>
          <div style={photo(aA, 15, -4)}>
            {polaroid(assets.fotoAcolhimento, 540, 660, '50% 55%')}
            <div style={{ position: 'absolute', bottom: 22, left: 40, background: ED.brandCore, padding: '12px 26px 8px', transform: 'rotate(2deg)', boxShadow: '0 6px 14px rgba(0,0,0,0.3)' }}>
              <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 800, fontSize: 34, color: '#FFFFFF', ...edIn(frame, aA + 10, { y: 4, blur: 8, trackFrom: -3, trackTo: -1 }) }}>
                ACOLHIMENTO SEGURO
              </span>
            </div>
          </div>
        </div>

        {/* 4 — Polaroid PATRULHAS */}
        <div style={{ position: 'absolute', top: 1060, right: 60, ...sweep(11) }}>
          <div style={photo(aP, -15, 6)}>
            {polaroid(assets.fotoPatrulha, 500, 640, '55% 40%')}
            <div style={{ position: 'absolute', bottom: 22, right: -20, background: ED.yellow, padding: '12px 24px 8px', transform: 'rotate(-3deg)', boxShadow: '0 6px 14px rgba(0,0,0,0.3)', whiteSpace: 'nowrap' }}>
              <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 32, color: ED.textDark, ...edIn(frame, aP + 10, { y: 4, blur: 8, trackFrom: -3, trackTo: -1 }) }}>
                PATRULHAS MARIA DA PENHA
              </span>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* WIPE EDITORIAL — tarja roxa */}
      <div style={{ position: 'absolute', top: -200, bottom: -200, left: -300, width: 1700, background: ED.void, transform: `translateX(${wipe}px) rotate(-6deg)`, boxShadow: '-30px 0 60px rgba(0,0,0,0.4)' }} />

      <AbsoluteFill style={{ backgroundColor: ED.yellow, opacity: flash }} />
    </AbsoluteFill>
  );
};
