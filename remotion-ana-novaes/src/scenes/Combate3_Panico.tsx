import React from 'react';
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from 'remotion';
import { ci, handheldShake } from '../lib/motion';
import { NoiseOverlay } from '../lib/Background';
import { ED, edIn, outP } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';
import type { CombateAssets } from '../combate-timing';

// Cena 3 — A Colagem (As 4 Ações) | frames locais 0–300
// "com atendimento especializado, acolhimento seguro, Patrulhas Maria da
// Penha e maior acesso a mecanismos de proteção, como o botão do pânico!"
// Papel off-white, câmera na mão. Três polaroids INTEIRAS (moldura no
// formato exato de cada foto, nada cortado) caem na mesa no frame em que
// são faladas. No clímax o botão do pânico explode em vermelho por cima de
// tudo. Saída: SUCÇÃO para o centro.
const S = COMBATE_SCENES.c3;
const L = (f: number) => f - S.from;
const EXIT = 278;
const BTN_AT = L(WORD.botao) - 16; // "como o botão..."

const Polaroid: React.FC<{ file: string; w: number; ratio: number; tape: string; tapeBg: string; tapeColor: string; tapeRot: number; frame: number; at: number }> = ({
  file, w, ratio, tape, tapeBg, tapeColor, tapeRot, frame, at,
}) => (
  <div style={{ position: 'relative', background: '#FFFFFF', padding: '18px 18px 74px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
    <Img src={staticFile(`assets/${file}`)} style={{ display: 'block', width: w, height: w / ratio }} />
    <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: `translateX(-50%) rotate(${tapeRot}deg)`, background: tapeBg, padding: '12px 26px 8px', whiteSpace: 'nowrap', boxShadow: '0 8px 16px rgba(0,0,0,0.25)' }}>
      <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 40, color: tapeColor, ...edIn(frame, at + 8, { y: 4, blur: 8, trackFrom: -4, trackTo: -1 }) }}>
        {tape}
      </span>
    </div>
  </div>
);

export const Combate3_Panico: React.FC<{ assets: CombateAssets }> = ({ assets }) => {
  const frame = useCurrentFrame();
  const shake = handheldShake(frame, 0.6);
  const sp = outP(frame, EXIT, 22);

  const drop = (at: number, rot: number): React.CSSProperties => {
    const p = ci(frame, [at, at + 24], [0, 1], Easing.out(Easing.cubic));
    return { opacity: ci(frame, [at, at + 10], [0, 1]), transform: `translateY(${60 * (1 - p)}px) rotate(${rot}deg)` };
  };

  // Botão — scale 0 → 1.1 → 1 com Easing.out(back(1.5))
  const bp = ci(frame, [BTN_AT, BTN_AT + 20], [0, 1], Easing.out(Easing.back(1.5)));
  const glow = 0.55 + 0.25 * Math.sin(frame * 0.22);
  const dim = ci(frame, [BTN_AT, BTN_AT + 16], [0, 0.55], Easing.out(Easing.cubic));

  const aT = Math.max(4, L(WORD.atendimento));
  const aA = L(WORD.acolhimento) - 4;
  const aP = L(WORD.patrulhas) - 4;

  return (
    <AbsoluteFill style={{ backgroundColor: ED.paper, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          mixBlendMode: 'multiply', opacity: 0.6,
          backgroundImage: `radial-gradient(ellipse at 25% 20%, rgba(255,255,255,0.8), transparent 35%),
            radial-gradient(ellipse at 70% 65%, rgba(90,60,110,0.16), transparent 40%),
            repeating-linear-gradient(118deg, rgba(60,30,80,0.05) 0 2px, transparent 2px 46px)`,
        }}
      />
      <NoiseOverlay opacity={0.05} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 48%, transparent 58%, rgba(45,22,67,0.35) 100%)' }} />

      <AbsoluteFill
        style={{
          transform: `${shake.transform} scale(${1 - sp}) rotate(${-15 * sp}deg)`, filter: `blur(${30 * sp}px)`,
          opacity: 1 - ci(sp, [0.6, 1], [0, 1]),
        }}
      >
        <div style={{ position: 'absolute', top: 120, left: 40, ...drop(aT, -5) }}>
          <Polaroid file={assets.fotoAcolhimento} w={430} ratio={941 / 1672} tape="ATENDIMENTO" tapeBg={ED.yellow} tapeColor={ED.textDark} tapeRot={-2} frame={frame} at={aT} />
        </div>
        <div style={{ position: 'absolute', top: 1150, left: 110, ...drop(aA, 3) }}>
          <Polaroid file={assets.fotoAbraco} w={640} ratio={1400 / 1094} tape="ACOLHIMENTO" tapeBg={ED.brandCore} tapeColor="#FFFFFF" tapeRot={2} frame={frame} at={aA} />
        </div>
        <div style={{ position: 'absolute', top: 300, left: 580, ...drop(aP, 6) }}>
          <Polaroid file={assets.fotoPatrulha} w={430} ratio={941 / 1672} tape="PATRULHAS" tapeBg={ED.yellow} tapeColor={ED.textDark} tapeRot={3} frame={frame} at={aP} />
        </div>

        {/* escurece a mesa quando o botão surge */}
        <AbsoluteFill style={{ backgroundColor: ED.void, opacity: dim }} />

        {/* Botão do pânico — por cima de tudo */}
        <div style={{ position: 'absolute', left: 540, top: 900, opacity: ci(frame, [BTN_AT, BTN_AT + 6], [0, 1]) }}>
          {[0, 1, 2].map((k) => {
            const t = ((Math.max(0, frame - BTN_AT - 8) / 42 + k / 3) % 1);
            return (
              <div
                key={k}
                style={{
                  position: 'absolute', width: 420, height: 420, marginLeft: -210, marginTop: -210, borderRadius: '50%',
                  border: `4px solid ${ED.alert}`, transform: `scale(${1 + t * 1.5})`, opacity: frame < BTN_AT + 8 ? 0 : 0.7 * (1 - t),
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute', width: 420, height: 420, marginLeft: -210, marginTop: -210, borderRadius: '50%',
              background: `radial-gradient(circle at 38% 32%, #FF7A84 0%, ${ED.alert} 45%, #9E1E2A 100%)`,
              boxShadow: `0 0 ${40 + 50 * glow}px rgba(230,57,70,${glow}), inset 0 -18px 40px rgba(0,0,0,0.35), inset 0 12px 30px rgba(255,255,255,0.25)`,
              transform: `scale(${bp})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16z" />
              <path d="M10 20a2 2 0 0 0 4 0" />
              <path d="M12 2v1.5M4.2 5.2l1.1 1.1M19.8 5.2l-1.1 1.1" />
            </svg>
          </div>
        </div>

        {/* Lettering */}
        <div style={{ position: 'absolute', top: 1190, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: ED.void, padding: '18px 40px 14px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', opacity: ci(frame, [L(WORD.botao), L(WORD.botao) + 10], [0, 1]) }}>
            <span style={{ display: 'inline-block', fontFamily: ED.sans, fontWeight: 900, fontSize: 80, lineHeight: 1, color: ED.yellow, ...edIn(frame, L(WORD.botao), { trackFrom: 0, trackTo: -2, blur: 10, y: 0 }) }}>
              BOTÃO DO PÂNICO
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
