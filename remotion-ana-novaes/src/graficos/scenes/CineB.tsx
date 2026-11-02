import React, { CSSProperties } from 'react';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../../lib/motion';
import { NV, P, SANS, SERIF, SPRINGS } from '../theme';

// ─────────────────────────────────────────────────────────────────────────
// CENA 2 — A Força do 2D na Informação (frames 293–750, local 0–457)
// Roteiro: "elementos planos, tipografias dinâmicas, cartazes e infográficos
// limpos sendo organizados na tela". Blueprint azul, flat absoluto (zero
// sombra, zero eixo Z). Um cartaz e três infográficos entram de direções
// diferentes e se encaixam num grid; no meio da cena o layout se reorganiza
// (morph de posições) — o 2D organizando a informação. Movimento suave:
// entradas out-cubic/spring, morph in-out-cubic, micro-animações senoidais.
// Saída: COLAPSO LATERAL em lâminas que revelam o void da Cena 3.
// ─────────────────────────────────────────────────────────────────────────

const W = 1080;
const H = 1920;
const ENTRY = Easing.out(Easing.cubic);
const MORPH = Easing.inOut(Easing.cubic);

const T = {
  grid: 0,
  title: [8, 18] as const,
  poster: 40,
  bars: 52,
  donut: 60,
  line: 70,
  reflow: [210, 246] as const, // reorganização do layout
  bladeTop: 420,
  bladeMid: 424,
  bladeLow: 428,
  bladeBg: 430,
  c3Start: 450, // overlap: a Cena 3 (por baixo) começa aqui
} as const;

// ── Grid de layout (margens 80, gutter 24) — duas arrumações ─────────────
export type Box = { x: number; y: number; w: number; h: number };
type SlotKey = 'poster' | 'bars' | 'donut' | 'line';
const COL_L = 80;
const COL_R = 552;
const COL_W = 448;
const ROW_1 = 600;
const LAYOUT_A: Record<SlotKey, Box> = {
  poster: { x: COL_L, y: ROW_1, w: COL_W, h: 640 },
  bars: { x: COL_R, y: ROW_1, w: COL_W, h: 308 },
  donut: { x: COL_R, y: ROW_1 + 332, w: COL_W, h: 308 },
  line: { x: COL_L, y: ROW_1 + 664, w: 920, h: 300 },
};
// Reorganizado: as colunas descem e o gráfico de linha passa para o topo.
const LAYOUT_B: Record<SlotKey, Box> = {
  poster: { x: COL_L, y: ROW_1 + 324, w: COL_W, h: 640 },
  bars: { x: COL_R, y: ROW_1 + 324, w: COL_W, h: 308 },
  donut: { x: COL_R, y: ROW_1 + 656, w: COL_W, h: 308 },
  line: { x: COL_L, y: ROW_1, w: 920, h: 300 },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/**
 * Reorganização sem cruzamentos: o gráfico de linha sai pela esquerda, as
 * colunas descem abrindo espaço e ele volta pela direita já no topo.
 */
const LINE_OUT = [T.reflow[0], T.reflow[0] + 20] as const;
const LINE_IN = [T.reflow[0] + 22, T.reflow[1] + 14] as const;
const boxAt = (key: SlotKey, frame: number): Box => {
  const a = LAYOUT_A[key];
  const b = LAYOUT_B[key];
  if (key === 'line') {
    const out = ci(frame, [LINE_OUT[0], LINE_OUT[1]], [0, 1], Easing.in(Easing.cubic));
    const back = ci(frame, [LINE_IN[0], LINE_IN[1]], [1, 0], ENTRY);
    const home = frame < LINE_IN[0] ? a : b;
    return { ...home, x: home.x - 1100 * out * (frame < LINE_IN[0] ? 1 : 0) + 1100 * back * (frame < LINE_IN[0] ? 0 : 1) };
  }
  const t = ci(frame, [T.reflow[0] + 8, T.reflow[1]], [0, 1], MORPH);
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: a.w, h: a.h };
};

/** Blur de velocidade do gráfico de linha durante a viagem. */
const lineTravelBlur = (frame: number) =>
  frame < LINE_IN[0]
    ? 18 * ci(frame, [LINE_OUT[0], LINE_OUT[1]], [0, 1], Easing.in(Easing.cubic))
    : 18 * ci(frame, [LINE_IN[0], LINE_IN[1]], [1, 0], ENTRY);

// ── Lâminas da saída: translateX + skewX + blur + opacity + scale ────────
const blade = (frame: number, start: number, dir: 1 | -1, dur = 20): CSSProperties => {
  const e = ci(frame, [start, start + dur], [0, 1], Easing.in(Easing.exp));
  return {
    transform: `translateX(${1200 * dir * e}px) skewX(${10 * dir * e}deg) scale(${1 - 0.04 * e})`,
    filter: e > 0.01 ? `blur(${20 * e}px)` : undefined,
    opacity: ci(e, [0.4, 1], [1, 0]),
  };
};

// ── Entrada direcional suave (skill: entryFrom — posição + blur + opacity) ─
const entryFrom = (frame: number, start: number, dx: number, dy: number, dur = 26): CSSProperties => {
  const p = ci(frame, [start, start + dur], [0, 1], ENTRY);
  const bl = 14 * ci(frame, [start, start + dur * 0.7], [1, 0]);
  return {
    opacity: ci(frame, [start, start + dur * 0.5], [0, 1]),
    transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px)`,
    filter: bl > 0.05 ? `blur(${bl}px)` : undefined,
  };
};

/** Flutuação flat (só Y), defasada por elemento — o 2D respira sem profundidade. */
const hover = (frame: number, phase: number) => Math.sin(frame * 0.03 + phase) * 4 * ci(frame, [90, 120], [0, 1]);

// ── BACKGROUND — azul em corte seco + glow radial + grid fino ────────────
const Background: React.FC<{ frame: number }> = ({ frame }) => {
  const gridIn = ci(frame, [T.grid, T.grid + 24], [0, 1], ENTRY);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: NV.midnight }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(79,124,255,0.16) 0%, transparent 62%)' }} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: gridIn }}>
        <defs>
          <pattern id="c2-grid" width={40} height={40} patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeOpacity={0.05} strokeWidth={1} />
          </pattern>
          <pattern id="c2-cross" width={160} height={160} patternUnits="userSpaceOnUse">
            <path d="M-6 0 H6 M0 -6 V6 M154 160 H166 M160 154 V166" stroke={NV.sky} strokeOpacity={0.3} strokeWidth={1.2} />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#c2-grid)" />
        <rect width={W} height={H} fill="url(#c2-cross)" />
      </svg>
    </AbsoluteFill>
  );
};

// ── TIPOGRAFIA DINÂMICA — título palavra por palavra (máscara + blur) ────
const TitleLine: React.FC<{ words: string[]; start: number; frame: number; accent?: number }> = ({
  words,
  start,
  frame,
  accent,
}) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.26em', fontSize: 104 }}>
    {words.map((w, i) => {
      const s = start + i * 3;
      const p = ci(frame, [s, s + 22], [0, 1], ENTRY);
      const bl = 12 * ci(frame, [s, s + 13], [1, 0]);
      return (
        // A máscara ganha folga à direita (compensada na margem): com tracking
        // negativo / itálico o último glifo passava da caixa e era cortado.
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: 14, paddingRight: '0.18em', marginRight: '-0.18em' }}
        >
          <span
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              fontFamily: i === accent ? SERIF : SANS,
              fontStyle: i === accent ? 'italic' : 'normal',
              fontWeight: i === accent ? 500 : 700,
              letterSpacing: i === accent ? -1 : -3.5,
              lineHeight: 1.06,
              color: i === accent ? NV.sky : NV.ice,
              opacity: ci(frame, [s, s + 12], [0, 1]),
              transform: `translateY(${(1 - p) * 70}px)`,
              filter: bl > 0.05 ? `blur(${bl}px)` : undefined,
            }}
          >
            {w}
          </span>
        </span>
      );
    })}
  </div>
);

// ── CARTAZ — composição geométrica: dois círculos que se desenham e se
// sobrepõem, um ponto em órbita, filetes finos e "2D" em serifa itálica ────
export const Poster: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const f = frame - T.poster;
  const ringA = ci(f, [20, 62], [0, 1], MORPH);
  const fillA = ci(f, [44, 76], [0, 1], ENTRY);
  const ringB = ci(f, [30, 72], [0, 1], MORPH);
  const rules = [0, 1, 2].map((i) => ci(f, [48 + i * 4, 72 + i * 4], [0, 1], ENTRY));
  const type = ci(f, [40, 64], [0, 1], ENTRY);
  const dotIn = f < 70 ? 0 : spring({ frame: f - 70, fps, config: SPRINGS.badge });
  const orbit = -Math.PI / 2 + Math.max(0, f - 70) * 0.018;
  const drift = Math.sin(frame * 0.02) * 6 * ci(frame, [100, 130], [0, 1]);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={448} height={640} viewBox="0 0 448 640" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="c2-orb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={NV.sky} />
            <stop offset="100%" stopColor={NV.azure} />
          </linearGradient>
        </defs>
        {/* círculo principal: contorno desenha, depois preenche em gradiente */}
        <circle cx={196} cy={230 + drift} r={140} fill="url(#c2-orb)" opacity={0.92 * fillA} />
        <circle
          cx={196}
          cy={230 + drift}
          r={140}
          fill="none"
          stroke={NV.sky}
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - ringA}
          transform={`rotate(-90 196 ${230 + drift})`}
        />
        {/* círculo secundário só em contorno, sobreposto */}
        <circle
          cx={290}
          cy={318 - drift}
          r={104}
          fill="none"
          stroke={NV.ice}
          strokeOpacity={0.45}
          strokeWidth={1.5}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - ringB}
          transform={`rotate(90 290 ${318 - drift})`}
        />
        {/* ponto em órbita do círculo principal */}
        <circle
          cx={196 + Math.cos(orbit) * 140}
          cy={230 + drift + Math.sin(orbit) * 140}
          r={9 * dotIn}
          fill={NV.ice}
        />
        {/* filetes — "linhas de texto" */}
        {rules.map((p, i) => (
          <rect
            key={i}
            x={36}
            y={470 + i * 22}
            width={[220, 300, 160][i] * p}
            height={3}
            fill={NV.ice}
            opacity={0.28}
          />
        ))}
      </svg>
      {/* "2D" — serifa itálica saindo da máscara (folga lateral evita corte) */}
      <div style={{ position: 'absolute', right: 30, bottom: 10, overflow: 'hidden', padding: '0 24px 10px 24px' }}>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 150,
            lineHeight: 1,
            letterSpacing: -2,
            color: NV.ice,
            transform: `translateY(${(1 - type) * 170}px)`,
          }}
        >
          2D
        </div>
      </div>
    </div>
  );
};

// ── INFOGRÁFICO 1 — barras crescendo ─────────────────────────────────────
const BARS = [0.45, 0.7, 0.55, 0.88, 1];
export const BarChart: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - T.bars;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 40, top: 40, display: 'flex', alignItems: 'flex-end', gap: 20 }}>
        {BARS.map((b, i) => {
          const grow = ci(f, [24 + i * 4, 52 + i * 4], [0, 1], ENTRY);
          const breathe = 1 + 0.04 * Math.sin(frame * 0.05 + i) * ci(frame, [130, 160], [0, 1]);
          return (
            <div
              key={i}
              style={{ flex: 1, height: `${b * grow * breathe * 100}%`, backgroundColor: i === BARS.length - 1 ? NV.sky : NV.steel, borderRadius: '6px 6px 0 0' }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          bottom: 38,
          height: 3,
          backgroundColor: NV.line,
          transform: `scaleX(${ci(f, [18, 42], [0, 1], ENTRY)})`,
          transformOrigin: 'left',
        }}
      />
    </div>
  );
};

// ── INFOGRÁFICO 2 — rosca preenchendo + contador ─────────────────────────
export const Donut: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - T.donut;
  const fill = ci(f, [26, 70], [0, 0.72], ENTRY);
  const R = 82;
  const C = 2 * Math.PI * R;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '0 40px',
        boxSizing: 'border-box',
      }}
    >
      <svg width={200} height={200} viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
        <circle cx={100} cy={100} r={R} fill="none" stroke={NV.track} strokeWidth={28} />
        <circle
          cx={100}
          cy={100}
          r={R}
          fill="none"
          stroke={NV.sky}
          strokeLinecap="round"
          strokeWidth={28}
          strokeDasharray={`${C * fill} ${C}`}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div style={{ fontFamily: SANS, fontSize: 76, fontWeight: 700, letterSpacing: -3, color: NV.ice, fontVariantNumeric: 'tabular-nums' }}>
        {Math.round(fill * 100)}%
      </div>
    </div>
  );
};

// ── INFOGRÁFICO 3 — linha se desenhando + ponto que percorre ─────────────
const LINE_PTS = [0.72, 0.58, 0.64, 0.4, 0.46, 0.26, 0.32, 0.12];
export const LineChart: React.FC<{ frame: number; box: Box }> = ({ frame, box }) => {
  const f = frame - T.line;
  const draw = ci(f, [24, 80], [0, 1], MORPH);
  const iw = box.w - 80;
  const ih = box.h - 80;
  const pts = LINE_PTS.map((v, i) => [(i / (LINE_PTS.length - 1)) * iw, v * ih] as const);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const area = `${d} L${iw} ${ih} L0 ${ih} Z`;
  const run = (Math.max(0, frame - 150) * 0.004) % 1;
  const k = run * (LINE_PTS.length - 1);
  const i0 = Math.min(LINE_PTS.length - 2, Math.floor(k));
  const fr = k - i0;
  const dot = [lerp(pts[i0][0], pts[i0 + 1][0], fr), lerp(pts[i0][1], pts[i0 + 1][1], fr)];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width={iw} height={ih} style={{ position: 'absolute', left: 40, top: 40, overflow: 'visible' }}>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={0} x2={iw} y1={g * ih} y2={g * ih} stroke="#FFFFFF" strokeOpacity={0.06} />
        ))}
        <path d={area} fill={NV.sky} opacity={0.12 * ci(f, [60, 90], [0, 1])} />
        <path
          d={d}
          fill="none"
          stroke={NV.sky}
          strokeWidth={5}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
        <circle cx={dot[0]} cy={dot[1]} r={10} fill={NV.ice} opacity={ci(frame, [150, 162], [0, 1])} />
      </svg>
    </div>
  );
};

// ── Card posicionado no grid (abre do centro em scaleY, flat) ────────────
const Slot: React.FC<{
  box: Box;
  frame: number;
  enter: CSSProperties;
  open: number;
  phase: number;
  children: React.ReactNode;
}> = ({ box, frame, enter, open, phase, children }) => (
  <div style={{ position: 'absolute', left: box.x, top: box.y + hover(frame, phase), width: box.w, height: box.h, ...enter }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scaleY(${open})`,
        overflow: 'hidden',
        borderRadius: 20,
        background: `linear-gradient(160deg, ${NV.cardHi} 0%, ${NV.card} 100%)`,
        border: `1px solid ${NV.line}`,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  </div>
);

export const CineB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = (start: number) => ci(frame, [start, start + 24], [0, 1], MORPH);
  const line = boxAt('line', frame);

  return (
    <AbsoluteFill
      style={{
        // O "abismo" revelado pelas lâminas é o mesmo #05050A da Cena 3. Antes dela
        // existir, a Cena 2 o pinta; a partir do overlap, deixa a Cena 3 aparecer.
        backgroundColor: frame < T.c3Start ? P.void : 'transparent',
        overflow: 'hidden',
        fontFamily: SANS,
      }}
    >
      {/* LÂMINA BG */}
      <AbsoluteFill style={blade(frame, T.bladeBg, -1)}>
        <Background frame={frame} />
      </AbsoluteFill>

      {/* LÂMINA — gráfico de linha (no topo do grid após a reorganização) */}
      <AbsoluteFill style={{ ...blade(frame, T.bladeLow, -1), ...(lineTravelBlur(frame) > 0.05 && frame < T.bladeLow ? { filter: `blur(${lineTravelBlur(frame)}px)` } : {}) }}>
        <Slot box={line} frame={frame} enter={entryFrom(frame, T.line, 0, 260)} open={open(T.line)} phase={2.4}>
          <LineChart frame={frame} box={line} />
        </Slot>
      </AbsoluteFill>

      {/* LÂMINA — cartaz + infográficos */}
      <AbsoluteFill style={blade(frame, T.bladeMid, 1)}>
        <Slot box={boxAt('poster', frame)} frame={frame} enter={entryFrom(frame, T.poster, -360, 0)} open={open(T.poster)} phase={0}>
          <Poster frame={frame} fps={fps} />
        </Slot>
        <Slot box={boxAt('bars', frame)} frame={frame} enter={entryFrom(frame, T.bars, 360, 0)} open={open(T.bars)} phase={0.8}>
          <BarChart frame={frame} />
        </Slot>
        <Slot box={boxAt('donut', frame)} frame={frame} enter={entryFrom(frame, T.donut, 360, 0)} open={open(T.donut)} phase={1.6}>
          <Donut frame={frame} />
        </Slot>
      </AbsoluteFill>

      {/* LÂMINA TOPO — título */}
      <AbsoluteFill style={blade(frame, T.bladeTop, -1)}>
        <div style={{ position: 'absolute', left: 80, right: 60, top: 190 }}>
          <TitleLine words={['A', 'Força', 'do', '2D']} start={T.title[0]} frame={frame} />
          <TitleLine words={['na', 'Informação']} start={T.title[1]} frame={frame} accent={1} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
