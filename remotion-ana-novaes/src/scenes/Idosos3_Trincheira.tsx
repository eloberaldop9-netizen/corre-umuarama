import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci, handheldShake } from '../lib/motion';
import { PaperPurple } from '../lib/PaperPurple';
import { ED, edIn } from '../lib/editorial';
import { IDOSOS_SCENES, WORD } from '../idosos-timing';
import type { IdososAssets } from '../idosos-timing';

// Cena 3 — A Trincheira | frames locais 0–104
// "combate à violência, ao abandono e à negligência,"
// Papel roxo, câmera na mão. A foto da idosa sozinha (P&B alto contraste,
// tinta roxa) bate na mesa; COMBATE À acende e três fitas amarelas cravam
// VIOLÊNCIA / ABANDONO / NEGLIGÊNCIA no frame exato da fala.
// Saída: WIPE EDITORIAL — bloco off-white varre da direita.
const S = IDOSOS_SCENES.c3;
const L = (f: number) => f - S.from;
const EXIT = 84;

const TapeWord: React.FC<{ frame: number; at: number; rot: number; children: React.ReactNode }> = ({ frame, at, rot, children }) => {
  const w = ci(frame, [at, at + 9], [0, 100]); // wipe L→R rápido (linear)
  return (
    <div style={{ display: 'inline-block', transform: `rotate(${rot}deg)`, filter: 'drop-shadow(20px 20px 30px rgba(0,0,0,0.4))' }}>
      <div
        style={{
          background: ED.yellow, padding: '16px 40px 12px', clipPath: `polygon(0% 6%, 2% 0%, ${w}% 3%, ${w}% 100%, 2% 95%, 0% 100%, 1% 50%)`,
        }}
      >
        <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 104, lineHeight: 1, letterSpacing: -4, color: ED.textDark }}>{children}</span>
      </div>
    </div>
  );
};

export const Idosos3_Trincheira: React.FC<{ assets: IdososAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const shake = handheldShake(frame, 0.6);
  const img = ci(frame, [4, 26], [0, 1], Easing.out(Easing.cubic));
  const wipe = ci(frame, [EXIT, S.duration], [2000, 0], Easing.in(Easing.exp));

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <PaperPurple />
      <AbsoluteFill style={{ transform: shake.transform }}>
        {/* Imagem de tensão */}
        <div
          style={{
            position: 'absolute', top: 170, left: 90, opacity: img,
            transform: `scale(${1.2 - 0.2 * img}) rotate(${4 * img - 1}deg)`, filter: `blur(${20 * (1 - img)}px)`,
          }}
        >
          <div style={{ background: '#FFFFFF', padding: 16, boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ position: 'relative', width: 868, height: 580, overflow: 'hidden' }}>
              <Img src={staticFile(`assets/${assets.solidao}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '55% 50%', filter: 'grayscale(1) contrast(1.35) brightness(0.9)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(58,18,84,0.35)', mixBlendMode: 'multiply' }} />
              <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.2, backgroundImage: 'radial-gradient(rgba(0,0,0,1) 1px, transparent 1.6px)', backgroundSize: '5px 5px' }} />
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 860, left: 90, right: 60 }}>
          <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 64, color: '#FFFFFF', marginBottom: 18, ...edIn(frame, Math.max(3, L(WORD.combate)), { trackFrom: -5, trackTo: -1 }) }}>
            COMBATE À
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22 }}>
            <TapeWord frame={frame} at={L(WORD.violencia)} rot={-2}>VIOLÊNCIA</TapeWord>
            <div style={{ marginLeft: 70 }}><TapeWord frame={frame} at={L(WORD.abandono)} rot={1.5}>ABANDONO</TapeWord></div>
            <TapeWord frame={frame} at={L(WORD.negligencia)} rot={-1}>NEGLIGÊNCIA</TapeWord>
          </div>
        </div>
      </AbsoluteFill>

      <div style={{ position: 'absolute', top: -200, bottom: -200, left: -300, width: 1800, background: ED.paper, transform: `translateX(${wipe}px) rotate(-4deg)`, boxShadow: '-40px 0 80px rgba(0,0,0,0.35)' }} />
    </AbsoluteFill>
  );
};
