import React from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci, handheldShake } from '../lib/motion';
import { Dust, Grain, HalftoneDots, NewsprintTexture, tornPolygon } from '../lib/collage';
import { KineticCaption } from '../lib/KineticCaption';
import { COLOR_PROTECAO as C, FONT_PROTECAO as F, TRACK } from '../lib/palette-protecao';
import { CAPTION_PAGES, PROTECAO_SCENES, wf } from '../protecao-timing';

// Cena 3 — O Peso da Lei | frames locais 0–148
// "Também quer trabalhar pelo fortalecimento das leis, dos canais de denúncia"
// Sem fotos: a força é a palavra. FORTALECIMENTO entra letra a letra em
// contorno, LEIS cai como bloco 3D (carimbo pesado + tremor de impacto),
// CANAIS DE DENÚNCIA vira tarja de alerta — amarela, nunca vermelha.
// Saída: SUCÇÃO — tudo colapsa girando para o centro.
const S = PROTECAO_SCENES.c3;
const L = (i: number) => wf(i) - S.from;
const EXIT = 132;

const EXTRUDE = Array.from({ length: 22 }, (_, i) => `${i + 1}px ${i + 1}px 0 ${i < 11 ? '#C9A800' : '#8C7500'}`).join(', ');

export const Protecao3_Leis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leisF = L(37);
  const impact = ci(frame, [leisF + 6, leisF + 20], [3.2, 1], Easing.out(Easing.cubic));
  const shake = handheldShake(frame, frame > leisF + 4 ? impact : 1);

  // Saída — SUCÇÃO
  const sp = ci(frame, [EXIT, S.duration], [0, 1], Easing.in(Easing.exp));
  const suck = (delay = 0) => {
    const p = ci(frame, [EXIT + delay, S.duration], [0, 1], Easing.in(Easing.exp));
    return {
      transform: `scale(${1 - 0.95 * p}) rotate(${45 * p}deg)`,
      filter: `blur(${50 * p}px)`,
      opacity: ci(p, [0.4, 1], [1, 0]),
    };
  };

  const leisSp = spring({ frame, fps, config: { damping: 8, mass: 1.8 }, delay: leisF });
  const letters = 'FORTALECIMENTO'.split('');
  const canaisSp = spring({ frame, fps, config: { damping: 12, mass: 0.9 }, delay: L(39) });
  const denSp = spring({ frame, fps, config: { damping: 9, mass: 1, stiffness: 150 }, delay: L(41) });

  return (
    <AbsoluteFill style={{ backgroundColor: C.voidDeep, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 42%, rgba(122,75,148,0.5), transparent 65%)' }} />

      {/* Radar — anéis pulsando do centro */}
      <AbsoluteFill style={{ ...suck(6), opacity: ci(frame, [0, 12], [0, 1]) * ci(sp, [0, 1], [1, 0]) }}>
        {[0, 1, 2, 3].map((k) => {
          const t = ((frame + k * 14) % 56) / 56;
          return (
            <div
              key={k}
              style={{
                position: 'absolute', top: 820, left: 540, width: 1400, height: 1400, marginLeft: -700, marginTop: -700,
                borderRadius: '50%', border: `4px solid ${k % 2 ? C.yellow : C.lilac}`,
                transform: `scale(${0.1 + t})`, opacity: 0.28 * (1 - t),
              }}
            />
          );
        })}
      </AbsoluteFill>

      <HalftoneDots size={9} opacity={0.2} color="rgba(0,0,0,1)" />
      <Grain opacity={0.18} />
      <Dust frame={frame} />

      <AbsoluteFill style={shake}>
        {/* "TAMBÉM" — etiqueta de máquina de escrever */}
        <div style={{ position: 'absolute', top: 250, left: 90, ...suck(0) }}>
          <div
            style={{
              background: C.paper, padding: '8px 22px 4px', transform: `rotate(-4deg) scale(${ci(frame, [L(31), L(31) + 10], [0.6, 1], Easing.out(Easing.back(1.6)))})`,
              opacity: ci(frame, [L(31), L(31) + 4], [0, 1]), boxShadow: '8px 8px 0 rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ fontFamily: F.type, fontSize: 52, letterSpacing: TRACK, color: C.ink }}>também quer trabalhar…</span>
          </div>
        </div>

        {/* FORTALECIMENTO — contorno, letra a letra */}
        <div style={{ position: 'absolute', top: 420, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...suck(2) }}>
          {letters.map((ch, i) => {
            const d = L(35) + i;
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block', fontFamily: F.sans, fontWeight: 900, fontSize: 104, letterSpacing: TRACK,
                  color: 'transparent', WebkitTextStroke: `3px ${C.yellow}`,
                  opacity: ci(frame, [d, d + 4], [0, 1]),
                  transform: `translateY(${ci(frame, [d, d + 10], [-80, 0], Easing.out(Easing.back(1.4)))}px)`,
                  filter: `blur(${ci(frame, [d, d + 6], [8, 0])}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* LEIS — bloco 3D */}
        <div style={{ position: 'absolute', top: 530, left: 0, right: 0, textAlign: 'center', ...suck(4) }}>
          <span
            style={{
              display: 'inline-block', fontFamily: F.sans, fontWeight: 900, fontSize: 400, letterSpacing: -12, lineHeight: 1,
              color: C.yellow, textShadow: `${EXTRUDE}, 30px 40px 60px rgba(0,0,0,0.7)`,
              opacity: ci(frame, [leisF, leisF + 5], [0, 1]),
              transform: `scale(${ci(leisSp, [0, 1], [4, 1])}) rotate(${ci(leisSp, [0, 1], [-15, 0])}deg)`,
              filter: `blur(${ci(frame, [leisF, leisF + 14], [30, 0])}px)`,
            }}
          >
            LEIS
          </span>
        </div>

        {/* Onda de choque do impacto */}
        <div
          style={{
            position: 'absolute', top: 730, left: 540, width: 900, height: 900, marginLeft: -450, marginTop: -450, borderRadius: '50%',
            border: `10px solid ${C.textLight}`,
            transform: `scale(${ci(frame, [leisF + 8, leisF + 26], [0.3, 1.5], Easing.out(Easing.cubic))})`,
            opacity: ci(frame, [leisF + 8, leisF + 26], [0.5, 0]),
          }}
        />

        {/* CANAIS DE DENÚNCIA — tarja de alerta */}
        <div style={{ position: 'absolute', top: 1040, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, ...suck(0) }}>
          <div
            style={{
              background: C.ink, padding: '8px 26px 4px', transform: `translateX(${ci(canaisSp, [0, 1], [-800, 0])}px) skewX(${ci(canaisSp, [0, 1], [-20, 0])}deg) rotate(-2deg)`,
              opacity: ci(frame, [L(39), L(39) + 4], [0, 1]),
            }}
          >
            <span style={{ fontFamily: F.type, fontSize: 60, letterSpacing: TRACK, color: C.textLight }}>CANAIS DE</span>
          </div>
          <div
            style={{
              position: 'relative', padding: '16px 40px 10px', background: C.yellow, clipPath: tornPolygon(13, 3),
              transform: `scale(${ci(denSp, [0, 1], [0.4, 1])}) rotate(2deg)`,
              opacity: ci(frame, [L(41), L(41) + 3], [0, 1]),
            }}
          >
            <NewsprintTexture opacity={0.1} />
            <span style={{ position: 'relative', fontFamily: F.sans, fontWeight: 900, fontSize: 124, letterSpacing: -3, color: C.voidDeep }}>DENÚNCIA</span>
          </div>
        </div>
      </AbsoluteFill>

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 70%, rgba(20,8,32,0.85) 92%)' }} />
      <KineticCaption
        pages={CAPTION_PAGES.c3}
        sceneFrom={S.from}
        variant="void"
        exitAt={EXIT}
        top={1560}
        emphasis={{ 35: 'yellow', 37: 'box', 39: 'yellow', 41: 'yellow' }}
      />
    </AbsoluteFill>
  );
};
