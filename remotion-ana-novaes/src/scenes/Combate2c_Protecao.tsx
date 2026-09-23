import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../lib/motion';
import { PaperPurple } from '../lib/PaperPurple';
import { ED, edIn } from '../lib/editorial';
import { COMBATE_SCENES, WORD } from '../combate-timing';

// Cena 2c — A Rede de Proteção | frames locais 0–71
// "para ampliar a rede de proteção às vítimas,"
// Motion que ilustra a frase: um escudo no centro e uma rede de pontos que
// se conecta e se AMPLIA para fora (escala 0.55 → 1, linhas se desenhando
// anel a anel). Lettering REDE DE PROTEÇÃO + ÀS VÍTIMAS logo abaixo; terço
// inferior livre para a legenda. Saída: WIPE EDITORIAL off-white, que vira
// o papel da Cena 3.
const S = COMBATE_SCENES.c2c;
const L = (f: number) => f - S.from;
const EXIT = 55;
const CX = 540;
const CY = 640;

const ring = (n: number, r: number, off: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + off;
    return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r };
  });
const R1 = ring(6, 230, -Math.PI / 2);
const R2 = ring(12, 420, -Math.PI / 2 + Math.PI / 12);

export const Combate2c_Protecao: React.FC = () => {
  const frame = useCurrentFrame();
  const inF = ci(frame, [0, 8], [0, 1]);
  const grow = ci(frame, [0, 45], [0.55, 1], Easing.out(Easing.cubic)); // ampliar
  const d1 = ci(frame, [2, 20], [0, 1], Easing.out(Easing.cubic)); // centro → anel 1
  const d2 = ci(frame, [14, 36], [0, 1], Easing.out(Easing.cubic)); // anel 1 → anel 2
  const d3 = ci(frame, [28, 50], [0, 1], Easing.out(Easing.cubic)); // anel externo fecha
  const wipe = ci(frame, [EXIT, S.duration], [2000, 0], Easing.in(Easing.exp));
  const pulse = ((frame % 36) / 36);

  const line = (x1: number, y1: number, x2: number, y2: number, p: number, key: string, w = 3, o = 0.55) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    return (
      <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFFFFF" strokeOpacity={o} strokeWidth={w}
        strokeDasharray={len} strokeDashoffset={len * (1 - p)} strokeLinecap="round" />
    );
  };

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity: inF }}>
      <PaperPurple shift={ci(frame, [0, S.duration], [-15, 15])} />

      <AbsoluteFill style={{ transform: `scale(${grow})`, transformOrigin: `${CX}px ${CY}px` }}>
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {/* pulso de proteção saindo do centro */}
          <circle cx={CX} cy={CY} r={120 + pulse * 380} fill="none" stroke={ED.yellow} strokeWidth={4} strokeOpacity={0.45 * (1 - pulse) * d1} />
          {R1.map((p, i) => line(CX, CY, p.x, p.y, d1, `c${i}`, 4, 0.7))}
          {R1.map((p, i) => line(p.x, p.y, R1[(i + 1) % 6].x, R1[(i + 1) % 6].y, d2, `r1${i}`))}
          {R2.map((p, i) => {
            const a = R1[Math.floor(i / 2)];
            return line(a.x, a.y, p.x, p.y, d2, `s${i}`, 2.5, 0.5);
          })}
          {R2.map((p, i) => line(p.x, p.y, R2[(i + 1) % 12].x, R2[(i + 1) % 12].y, d3, `r2${i}`, 2, 0.4))}
          {R1.map((p, i) => (
            <circle key={`n1${i}`} cx={p.x} cy={p.y} r={26 * ci(frame, [4 + i * 2, 16 + i * 2], [0, 1], Easing.out(Easing.cubic))} fill="#FFFFFF" stroke={ED.lilac} strokeWidth={6} />
          ))}
          {R2.map((p, i) => (
            <circle key={`n2${i}`} cx={p.x} cy={p.y} r={17 * ci(frame, [18 + i, 30 + i], [0, 1], Easing.out(Easing.cubic))} fill={ED.lilac} />
          ))}
        </svg>

        {/* Escudo no centro */}
        <div
          style={{
            position: 'absolute', left: CX - 95, top: CY - 95, width: 190, height: 190, borderRadius: '50%', background: ED.yellow,
            boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 0 10px rgba(252,227,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: `scale(${ci(frame, [0, 14], [0.6, 1], Easing.out(Easing.cubic))})`,
          }}
        >
          <svg width="104" height="104" viewBox="0 0 24 24" fill="none" stroke={ED.void} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.5l7.5 3v6c0 4.6-3.2 8.6-7.5 10-4.3-1.4-7.5-5.4-7.5-10v-6z" />
            <path d="M8.8 12.2l2.3 2.3 4.3-4.6" />
          </svg>
        </div>
      </AbsoluteFill>

      {/* Lettering */}
      <div style={{ position: 'absolute', top: 1130, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontFamily: ED.sans, fontWeight: 900, fontSize: 92, lineHeight: 1, color: '#FFFFFF', textShadow: '0 16px 50px rgba(0,0,0,0.5)', ...edIn(frame, L(WORD.rede), { trackFrom: -7, trackTo: -3, y: 24 }) }}>
          REDE DE PROTEÇÃO
        </div>
        <div style={{ marginTop: 16, fontFamily: ED.sans, fontWeight: 800, fontSize: 56, color: ED.yellow, ...edIn(frame, L(WORD.vitimas), { trackFrom: -3, trackTo: 1, y: 14 }) }}>
          ÀS VÍTIMAS
        </div>
      </div>

      {/* WIPE EDITORIAL — bloco off-white */}
      <div style={{ position: 'absolute', top: -200, bottom: -200, left: -300, width: 1800, background: ED.paper, transform: `translateX(${wipe}px) rotate(-4deg)`, boxShadow: '-40px 0 80px rgba(0,0,0,0.35)' }} />
    </AbsoluteFill>
  );
};
