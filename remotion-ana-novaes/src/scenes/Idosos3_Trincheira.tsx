import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci, handheldShake } from '../lib/motion';
import { PaperPurple } from '../lib/PaperPurple';
import { ED, edIn } from '../lib/editorial';
import { IDOSOS_SCENES, WORD } from '../idosos-timing';
import type { IdososAssets } from '../idosos-timing';

// Cena 3 — A Trincheira | frames locais 0–104
// "combate à violência, ao abandono e à negligência,"
// Papel roxo, câmera na mão, COMBATE À no topo. Cada palavra ganha a SUA
// foto (polaroid inteira, P&B com tinta roxa) caindo na mesa no frame
// exato da fala, com a fita amarela revelando o texto:
// VIOLÊNCIA (idoso cobrindo o rosto) · ABANDONO (idosa sozinha na janela)
// · NEGLIGÊNCIA (mãos enrugadas). Terço inferior livre para a legenda.
// Saída: WIPE EDITORIAL off-white.
const S = IDOSOS_SCENES.c3;
const L = (f: number) => f - S.from;
const EXIT = 84;

const Card: React.FC<{ frame: number; at: number; file: string; w: number; ratio: number; pos: string; rot: number; label: string }> = ({
  frame, at, file, w, ratio, pos, rot, label,
}) => {
  const p = ci(frame, [at - 6, at + 18], [0, 1], Easing.out(Easing.cubic));
  const tape = ci(frame, [at + 2, at + 12], [0, 100], Easing.out(Easing.cubic)); // fita abre L→R
  return (
    <div style={{ opacity: p, transform: `translateY(${60 * (1 - p)}px) rotate(${rot}deg)`, filter: `blur(${12 * (1 - p)}px)` }}>
      <div style={{ position: 'relative', background: '#FFFFFF', padding: '14px 14px 64px', boxShadow: '0 30px 60px rgba(0,0,0,0.55)' }}>
        <div style={{ position: 'relative', width: w, height: w / ratio, overflow: 'hidden' }}>
          <Img src={staticFile(`assets/${file}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'grayscale(1) contrast(1.25)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(58,18,84,0.28)', mixBlendMode: 'multiply' }} />
        </div>
        {/* Fita: nada aparece antes da palavra — só o retângulo revelado pelo wipe */}
        <div
          style={{
            position: 'absolute', left: 30, bottom: 12, opacity: tape > 0 ? 1 : 0,
            clipPath: `inset(0 ${100 - tape}% 0 0)`, background: ED.yellow, padding: '10px 26px 6px', boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
            transform: `rotate(${-rot * 0.6}deg)`,
          }}
        >
          <span style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 64, lineHeight: 1, letterSpacing: -2, color: ED.textDark, whiteSpace: 'nowrap' }}>{label}</span>
        </div>
      </div>
    </div>
  );
};

export const Idosos3_Trincheira: React.FC<{ assets: IdososAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const shake = handheldShake(frame, 0.6);
  const wipe = ci(frame, [EXIT, S.duration], [2000, 0], Easing.in(Easing.exp));

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <PaperPurple />
      <AbsoluteFill style={{ transform: shake.transform }}>
        <div style={{ position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 72, color: '#FFFFFF', ...edIn(frame, Math.max(3, L(WORD.combate)), { trackFrom: -5, trackTo: -1 }) }}>
            COMBATE À
          </span>
        </div>
        <div style={{ position: 'absolute', top: 230, left: 40 }}>
          <Card frame={frame} at={L(WORD.violencia)} file={assets.violencia} w={520} ratio={1600 / 983} pos="50% 40%" rot={-4} label="VIOLÊNCIA" />
        </div>
        <div style={{ position: 'absolute', top: 530, left: 490 }}>
          <Card frame={frame} at={L(WORD.abandono)} file={assets.solidao} w={520} ratio={1600 / 1067} pos="50% 50%" rot={3} label="ABANDONO" />
        </div>
        <div style={{ position: 'absolute', top: 990, left: 70 }}>
          <Card frame={frame} at={L(WORD.negligencia)} file={assets.maos} w={520} ratio={1600 / 1067} pos="50% 50%" rot={-2} label="NEGLIGÊNCIA" />
        </div>
      </AbsoluteFill>

      <div style={{ position: 'absolute', top: -200, bottom: -200, left: -300, width: 1800, background: ED.paper, transform: `translateX(${wipe}px) rotate(-4deg)`, boxShadow: '-40px 0 80px rgba(0,0,0,0.35)' }} />
    </AbsoluteFill>
  );
};
