import React, { CSSProperties } from 'react';
import { Easing } from 'remotion';
import { ci } from '../lib/motion';
import { FONT, NV } from './theme';

// ─────────────────────────────────────────────────────────────────────────
// O FIO CONDUTOR do vídeo: a arte 2D do rótulo da lata. Na Cena 2 ela é
// montada como um cartaz plano; na Cena 3 voa e embrulha a lata 3D; na Cena 4
// reaparece na peça final. As cores e a composição espelham o rótulo
// desenhado em canvas em three/Can.tsx (frente = "2D / 3D" + círculo).
// ─────────────────────────────────────────────────────────────────────────

export const LABEL_W = 448;
export const LABEL_H = 640;
export const LABEL_BG = '#27498F';

const ENTRY = Easing.out(Easing.cubic);

/**
 * Arte do rótulo em 448×640. `build` é o frame local da montagem (0 = início);
 * passe um valor alto (ex.: 999) para a arte já pronta.
 */
export const LabelArt: React.FC<{ build: number; style?: CSSProperties }> = ({ build, style }) => {
  const bg = ci(build, [0, 18], [0, 1], ENTRY);
  const rules = ci(build, [10, 34], [0, 1], ENTRY);
  const circle = ci(build, [16, 40], [0, 1], Easing.out(Easing.back(1.4)));
  const stripe = ci(build, [26, 52], [0, 1], ENTRY);
  const t2 = ci(build, [22, 46], [0, 1], ENTRY);
  const t3 = ci(build, [28, 52], [0, 1], ENTRY);
  return (
    <div style={{ position: 'relative', width: LABEL_W, height: LABEL_H, overflow: 'hidden', ...style }}>
      <svg width={LABEL_W} height={LABEL_H} viewBox={`0 0 ${LABEL_W} ${LABEL_H}`} style={{ position: 'absolute', inset: 0 }}>
        <rect width={LABEL_W} height={LABEL_H} fill={LABEL_BG} opacity={bg} />
        {/* círculo marinho atrás da tipografia */}
        <circle cx={300} cy={215} r={118 * circle} fill={NV.navy} />
        {/* faixa diagonal azul-céu */}
        <polygon points="0,548 448,470 448,508 0,586" fill={NV.sky} transform={`translate(${-448 * (1 - stripe)} 0)`} />
        {/* filetes */}
        <rect x={0} y={26} width={LABEL_W * rules} height={6} fill={NV.sky} />
        <rect x={LABEL_W * (1 - rules)} y={608} width={LABEL_W * rules} height={6} fill={NV.sky} />
      </svg>
      {/* tipografia saindo da máscara (folga lateral evita corte) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 172,
          lineHeight: 0.98,
          letterSpacing: -6,
        }}
      >
        {[
          { t: '2D', p: t2, c: NV.ice },
          { t: '3D', p: t3, c: NV.sky },
        ].map(({ t, p, c }) => (
          <div key={t} style={{ overflow: 'hidden', padding: '0 24px' }}>
            <div style={{ color: c, transform: `translateY(${(1 - p) * 180}px)` }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Linha de apoio: palavras-chave que entram cada uma no seu "momento" da cena
 * (posição + blur + opacidade, out-cubic), separadas por pontos.
 */
export const Beats: React.FC<{ frame: number; items: { text: string; at: number }[]; style?: CSSProperties }> = ({
  frame,
  items,
  style,
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 18, fontFamily: FONT, ...style }}>
    {items.map(({ text, at }, i) => {
      const p = ci(frame, [at, at + 20], [0, 1], ENTRY);
      const bl = 10 * ci(frame, [at, at + 12], [1, 0]);
      return (
        <React.Fragment key={text}>
          {i > 0 ? (
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: NV.sky, opacity: 0.7 * p }} />
          ) : null}
          <span
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              opacity: ci(frame, [at, at + 10], [0, 1]),
              transform: `translateY(${(1 - p) * 26}px)`,
              filter: bl > 0.05 ? `blur(${bl}px)` : undefined,
            }}
          >
            {text}
          </span>
        </React.Fragment>
      );
    })}
  </div>
);
