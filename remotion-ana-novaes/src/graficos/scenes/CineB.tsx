import React, { CSSProperties } from 'react';
import { AbsoluteFill, Easing, useCurrentFrame } from 'remotion';
import { ci } from '../../lib/motion';
import { FONT, P } from '../theme';
import { AppBadge } from '../AppBadge';

// ─────────────────────────────────────────────────────────────────────────
// CENA 2 — A Força do 2D (frames 293–750, local 0–457)
// Blueprint azul, grid ortogonal, design suíço. ZERO sombra, ZERO eixo Z:
// tudo em X/Y, snaps exponenciais, textos saindo de máscaras (clipPath).
// Pan ortográfico: a prancheta inteira dá um solavanco -1080 no frame 150.
// Saída: COLAPSO LATERAL em lâminas que rasgam a tela.
// ─────────────────────────────────────────────────────────────────────────

const W = 1080;
const H = 1920;
const GRID = 40;
const SNAP = Easing.out(Easing.exp);

const T = {
  grid: 0,
  etapa: 15,
  titleA: 20,
  titleB: 25,
  card: 40,
  bar1: [70, 100] as const,
  bar2: [80, 110] as const,
  pan: 150,
  bladeTop: 420,
  bladeMid: 425,
  bladeTicker: 427,
  bladeBg: 430,
} as const;

// ── Lâminas da saída: translateX + skewX + blur + opacity + scale ────────
const blade = (frame: number, start: number, dir: 1 | -1, dur = 20): CSSProperties => {
  const e = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.exp));
  return {
    transform: `translateX(${1200 * dir * e}px) skewX(${10 * dir * e}deg) scale(${1 - 0.04 * e})`,
    filter: e > 0.01 ? `blur(${20 * e}px)` : undefined,
    opacity: ci(e, [0.4, 1], [1, 0]),
  };
};

// ── GRID — linhas se desenhando + cruzes que estalam 90° a cada 90f ──────
const Grid: React.FC<{ frame: number; width: number }> = ({ frame, width }) => {
  const draw = ci(frame, [T.grid, T.grid + 30], [1, 0], SNAP);
  const cycle = frame % 90;
  const crossRot = Math.floor(frame / 90) * 90 + 90 * ci(cycle, [0, 8], [0, 1], SNAP);
  const cols = Math.ceil(width / GRID) + 1;
  const rows = Math.ceil(H / GRID) + 1;
  const line = { stroke: '#FFFFFF', strokeOpacity: 0.15, strokeWidth: 1, pathLength: 1, strokeDasharray: 1, strokeDashoffset: draw };
  return (
    <svg width={width} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
      {Array.from({ length: cols }, (_, i) => (
        <line key={`v${i}`} x1={i * GRID} y1={0} x2={i * GRID} y2={H} {...line} />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * GRID} x2={width} y2={i * GRID} {...line} />
      ))}
      {/* marcadores "+" nos vértices (a cada 2 células) */}
      {Array.from({ length: Math.ceil(cols / 2) }).flatMap((_, ci2) =>
        Array.from({ length: Math.ceil(rows / 2) }).map((__, ri) => {
          const x = ci2 * GRID * 2;
          const y = ri * GRID * 2;
          return (
            <path
              key={`c${ci2}-${ri}`}
              d={`M${x - 6} ${y} H${x + 6} M${x} ${y - 6} V${y + 6}`}
              stroke="#FFFFFF"
              strokeOpacity={0.55 * (1 - draw)}
              strokeWidth={2}
              transform={`rotate(${crossRot} ${x} ${y})`}
            />
          );
        })
      )}
    </svg>
  );
};

/** Texto que corre de trás de uma máscara (clipPath), palavra a palavra. */
const MaskedLine: React.FC<{ text: string; start: number; from: number; style: CSSProperties; frame: number }> = ({
  text,
  start,
  from,
  style,
  frame,
}) => (
  <div style={{ display: 'flex', gap: '0.26em', ...style }}>
    {text.split(' ').map((word, i) => {
      // Cada palavra tem sua própria máscara; o deslocamento é no mínimo a
      // largura da palavra, para ela nascer 100% escondida atrás do recorte.
      const k = ci(frame, [start + i * 2, start + i * 2 + 22], [1, 0], SNAP);
      return (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', clipPath: 'inset(0 0 0 0)' }}>
          <span
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              transform: `translateX(calc(${-k} * max(${Math.abs(from)}px, 105%)))`,
            }}
          >
            {word}
          </span>
        </span>
      );
    })}
  </div>
);

// ── PRANCHETA A — Infográfico suíço ──────────────────────────────────────
const Bar: React.FC<{ frame: number; label: string; range: readonly [number, number]; target: number }> = ({
  frame,
  label,
  range,
  target,
}) => {
  const p = ci(frame, [range[0], range[1]], [0, target], SNAP);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 700, color: P.ink }}>
        <span style={{ letterSpacing: 2, textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(p)}%</span>
      </div>
      <div style={{ height: 46, backgroundColor: P.ink }}>
        <div style={{ width: `${p}%`, height: '100%', backgroundColor: P.neon }} />
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ frame: number }> = ({ frame }) => {
  const open = ci(frame, [T.card, T.card + 20], [0, 1], Easing.inOut(Easing.cubic));
  const boxes = [P.ink, P.blueprint, P.neon];
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        top: 720,
        width: 920,
        height: 760,
        backgroundColor: P.paper,
        transform: `scaleY(${open})`,
        transformOrigin: 'center',
        padding: 56,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 34,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 4, color: P.ink }}>INFOGRÁFICO · 01</span>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2, color: P.ink, backgroundColor: P.neon, padding: '6px 14px' }}>
          2D
        </span>
      </div>
      <MaskedLine
        frame={frame}
        text="O Dinamismo do 2D"
        start={T.card + 14}
        from={-700}
        style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2, color: P.blueprint, lineHeight: 1.1 }}
      />
      <div style={{ height: 4, backgroundColor: P.ink, transform: `scaleX(${ci(frame, [T.card + 18, T.card + 34], [0, 1], SNAP)})`, transformOrigin: 'left' }} />
      <Bar frame={frame} label="Hierarquia" range={T.bar1} target={85} />
      <Bar frame={frame} label="Clareza" range={T.bar2} target={100} />
      {/* Caixas sólidas se expandindo */}
      <div style={{ display: 'flex', gap: 20, marginTop: 6 }}>
        {boxes.map((c, i) => (
          <div key={c} style={{ flex: 1, height: 120, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: c,
                transform: `scaleX(${ci(frame, [96 + i * 4, 114 + i * 4], [0, 1], SNAP)})`,
                transformOrigin: 'left',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: 16,
                bottom: 12,
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: 2,
                color: c === P.neon ? P.ink : P.paper,
                opacity: ci(frame, [108 + i * 4, 114 + i * 4], [0, 1]),
              }}
            >
              {['COR', 'FORMA', 'TIPO'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── PRANCHETA B — Cartaz suíço (revelado pelo pan) ───────────────────────
const SwissPoster: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - T.pan; // tempo desde o solavanco
  const circle = ci(f, [8, 24], [0, 1], SNAP);
  const rule = ci(f, [12, 30], [0, 1], SNAP);
  const block = ci(f, [16, 32], [0, 1], SNAP);
  const orbit = Math.max(0, f) * 0.8;
  return (
    <div
      style={{
        position: 'absolute',
        left: W + 80,
        top: 720,
        width: 920,
        height: 760,
        backgroundColor: P.paper,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -90,
          top: -60,
          width: 460,
          height: 460,
          borderRadius: '50%',
          backgroundColor: P.neon,
          transform: `scale(${circle})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 470,
          width: 920,
          height: 120,
          backgroundColor: P.blueprint,
          transform: `scaleX(${block})`,
          transformOrigin: 'left',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 56,
          top: 40,
          fontSize: 400,
          fontWeight: 900,
          letterSpacing: -28,
          lineHeight: 1,
          color: P.ink,
          transform: `translateY(${ci(f, [0, 22], [420, 0], SNAP)}px)`,
        }}
      >
        2D
      </div>
      <div style={{ position: 'absolute', left: 56, right: 56, top: 440, height: 6, backgroundColor: P.ink, transform: `scaleX(${rule})`, transformOrigin: 'left' }} />
      <div
        style={{
          position: 'absolute',
          left: 56,
          top: 500,
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: -1,
          color: P.paper,
          transform: `translateX(${ci(f, [18, 38], [-700, 0], SNAP)}px)`,
        }}
      >
        CARTAZ · GRID · TIPO
      </div>
      <div style={{ position: 'absolute', left: 56, top: 610, display: 'flex', gap: 48 }}>
        {['Hierarquia', 'Contraste', 'Ritmo'].map((t, i) => (
          <div
            key={t}
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: P.ink,
              transform: `translateY(${ci(f, [22 + i * 3, 40 + i * 3], [80, 0], SNAP)}px)`,
            }}
          >
            {String(i + 1).padStart(2, '0')} {t}
          </div>
        ))}
      </div>
      {/* quadrado orbitando — "vinheta" em loop */}
      <div
        style={{
          position: 'absolute',
          right: 150,
          top: 150,
          width: 70,
          height: 70,
          backgroundColor: P.ink,
          transform: `rotate(${orbit}deg) scale(${circle})`,
        }}
      />
      <div style={{ position: 'absolute', left: 56, bottom: 30, transform: `translateX(${ci(f, [30, 50], [-700, 0], SNAP)}px)` }}>
        <AppBadge app="ae" variant="flat" size={56} kicker="Feito no" />
      </div>
    </div>
  );
};

const TICKER = 'INFORMAÇÃO ✦ HIERARQUIA ✦ CLAREZA ✦ GRID ✦ TIPOGRAFIA ✦ CARTAZ ✦ INFOGRÁFICO ✦ ';

export const CineB: React.FC = () => {
  const frame = useCurrentFrame();

  // Pan ortográfico: solavanco 0 → -1080 no frame 150
  const pan = ci(frame, [T.pan, T.pan + 18], [0, -W], Easing.inOut(Easing.exp));
  const scanX = ((frame * 14) % (W + 200)) - 100; // linha de leitura neon
  const tickerIn = ci(frame, [30, 52], [W, 0], SNAP);

  // Linhas contínuas cruzando a tela
  const crossA = ci(frame, [112, 130], [0, 1], SNAP);
  const crossB = ci(frame, [190, 208], [0, 1], SNAP);

  return (
    <AbsoluteFill style={{ backgroundColor: P.void, overflow: 'hidden', fontFamily: FONT }}>
      {/* LÂMINA BG — azul + grid + linha de leitura */}
      <AbsoluteFill style={blade(frame, T.bladeBg, -1)}>
        <AbsoluteFill style={{ backgroundColor: P.blueprint }} />
        <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateX(${pan}px)` }}>
          <Grid frame={frame} width={W * 2} />
        </div>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: scanX, width: 3, backgroundColor: P.neon }} />
        <div style={{ position: 'absolute', left: 0, top: 690, height: 3, width: W, backgroundColor: P.paper, transform: `scaleX(${crossA})`, transformOrigin: 'left' }} />
        <div style={{ position: 'absolute', left: 0, top: 1510, height: 3, width: W, backgroundColor: P.neon, transform: `scaleX(${crossB})`, transformOrigin: 'right' }} />
      </AbsoluteFill>

      {/* LÂMINA MEIO — prancheta com pan (infográfico → cartaz) */}
      <AbsoluteFill style={blade(frame, T.bladeMid, 1)}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: W * 2, height: H, transform: `translateX(${pan}px)` }}>
          {/* a prancheta A sai de cena no solavanco; não volta na saída em lâminas */}
          {frame < T.pan + 20 ? <InfoCard frame={frame} /> : null}
          <SwissPoster frame={frame} />
        </div>
      </AbsoluteFill>

      {/* LÂMINA TOPO — textos mascarados */}
      <AbsoluteFill style={blade(frame, T.bladeTop, -1)}>
        <div style={{ position: 'absolute', left: 80, right: 40, top: 160, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <MaskedLine frame={frame} text="Etapa 1:" start={T.etapa} from={-400} style={{ fontSize: 48, fontWeight: 500, letterSpacing: 2, color: P.neon }} />
          <MaskedLine
            frame={frame}
            text="A Força do 2D"
            start={T.titleA}
            from={-600}
            style={{ fontSize: 110, fontWeight: 900, letterSpacing: -4, color: P.paper, lineHeight: 1.08 }}
          />
          <MaskedLine
            frame={frame}
            text="na Informação"
            start={T.titleB}
            from={-600}
            style={{ fontSize: 110, fontWeight: 900, letterSpacing: -4, color: P.paper, lineHeight: 1.08 }}
          />
        </div>
      </AbsoluteFill>

      {/* LÂMINA BASE — ticker */}
      <AbsoluteFill style={blade(frame, T.bladeTicker, -1)}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 1600,
            height: 96,
            backgroundColor: P.ink,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            transform: `translateX(${tickerIn}px)`,
          }}
        >
          <div
            style={{
              whiteSpace: 'nowrap',
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: 3,
              color: P.neon,
              transform: `translateX(${-((frame * 5) % 1700)}px)`,
            }}
          >
            {TICKER.repeat(5)}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
