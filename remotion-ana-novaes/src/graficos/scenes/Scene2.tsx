import React, { CSSProperties } from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../../lib/motion';
import { FONT, G, SPRINGS } from '../theme';
import { SpringWords } from '../SpringWords';

// ─────────────────────────────────────────────────────────────────────────
// CENA 2 — O Dinamismo do 2D (frames 293–750, local 0–457)
// Colagem brutalista: três cards jogados na mesa com overshoot pesado,
// física só em X/Y. Saída: COLAPSO Z-DIVE num buraco negro central.
// ─────────────────────────────────────────────────────────────────────────

const SCREEN = { w: 1080, h: 1920 };
const CARD_X = 80;
const CARD_W = 920;
const CARDS = {
  top: { y: 130, h: 440 },
  center: { y: 640, h: 560 },
  base: { y: 1270, h: 500 },
} as const;

const T = {
  textsExit: 410,
  cardsExit: 415,
  holeStart: 418,
  bgFade: 435,
} as const;

const brutalCard: CSSProperties = {
  position: 'absolute',
  left: CARD_X,
  width: CARD_W,
  backgroundColor: G.white,
  border: `4px solid ${G.black}`,
  boxShadow: `12px 12px 0 0 ${G.black}`,
  overflow: 'hidden',
  fontFamily: FONT,
  color: G.ink,
};

/** Saída quádrupla rumo ao centro da tela (buraco negro). */
const collapse = (frame: number, start: number, cardCenterY: number) => {
  const e = ci(frame, [start, start + 22], [0, 1], Easing.in(Easing.exp));
  return {
    x: (SCREEN.w / 2 - (CARD_X + CARD_W / 2)) * e,
    y: (SCREEN.h / 2 - cardCenterY) * e,
    scale: interpolate(e, [0, 1], [1, 0.1]),
    rot: 45 * e,
    blur: 30 * e,
    opacity: ci(e, [0.3, 1], [1, 0]),
  };
};

/** Todos os textos dos cards somem antes dos cards (scale 1→0). */
const useTextsExit = (frame: number): CSSProperties => {
  const e = ci(frame, [T.textsExit, T.textsExit + 14], [0, 1], Easing.in(Easing.exp));
  return { transform: `scale(${1 - e})`, opacity: 1 - e };
};

const Caption: React.FC<{ children: React.ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', ...style }}>{children}</div>
);

// ── CARD 1 — Tipografia cinética + marquee ───────────────────────────────
const KINETIC_WORDS = ['FORMA', 'COR', 'RITMO', 'VETOR', 'GRID'];
const KINETIC_START = 40;
const KINETIC_PERIOD = 48;

const KineticWord: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - KINETIC_START;
  if (local < 0) return null;
  const idx = Math.floor(local / KINETIC_PERIOD) % KINETIC_WORDS.length;
  const t = local % KINETIC_PERIOD;
  const s = spring({ frame: t, fps, config: SPRINGS.impact });
  const out = ci(t, [KINETIC_PERIOD - 10, KINETIC_PERIOD], [0, 1], Easing.in(Easing.exp));
  // Stretch effect: entra esmagado e largo, estica até o lugar; sai esticando.
  const scaleY = s * (1 - out);
  const scaleX = interpolate(s, [0, 1], [1.6, 1]) * (1 + 0.6 * out);
  return (
    <div
      style={{
        fontSize: 128,
        fontWeight: 900,
        letterSpacing: -5,
        lineHeight: 1,
        color: idx % 2 === 0 ? G.indigo : G.ink,
        transform: `scale(${scaleX}, ${scaleY})`,
      }}
    >
      {KINETIC_WORDS[idx]}
    </div>
  );
};

const MARQUEE_TEXT = 'AFTER EFFECTS ✦ MOTION GRAPHICS ✦ VINHETAS ✦ TIPOGRAFIA ✦ VETOR ✦ ';

const Marquee: React.FC<{ frame: number }> = ({ frame }) => {
  const shift = -((frame * 4) % 1600);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 64,
        backgroundColor: G.indigo,
        borderTop: `4px solid ${G.black}`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          whiteSpace: 'nowrap',
          transform: `translateX(${shift}px)`,
          color: G.white,
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        {MARQUEE_TEXT.repeat(6)}
      </div>
    </div>
  );
};

// ── CARD 2 — Título GIGANTE ──────────────────────────────────────────────
const LETTERS_START = 39;
const DINAMISMO = 'DINAMISMO'.split('');

const TitleBlock: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const underline = ci(frame, [62, 80], [0, 1], Easing.out(Easing.cubic));
  const titleStyle: CSSProperties = { fontSize: 90, fontWeight: 900, letterSpacing: -5, color: G.indigo, lineHeight: 1 };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
      <SpringWords
        text="Etapa 1:"
        start={35}
        config={SPRINGS.text}
        from={{ y: 40, blur: 10 }}
        style={{ fontSize: 40, fontWeight: 600, letterSpacing: 2, color: G.ink, justifyContent: 'flex-start' }}
      />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.28em', ...titleStyle }}>
        <SpringWords text="O" start={35} config={SPRINGS.impact} from={{ x: 100 }} />
        <div style={{ display: 'flex' }}>
          {DINAMISMO.map((letter, i) => {
            const local = frame - LETTERS_START - i * 2; // letra a letra, stagger 2f
            const s = local < 0 ? 0 : spring({ frame: local, fps, config: SPRINGS.letters });
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  transform: `translateX(${100 * (1 - s)}px)`,
                  opacity: ci(local, [0, 6], [0, 1]),
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </div>
      <SpringWords
        text="DO 2D"
        start={LETTERS_START + DINAMISMO.length * 2}
        config={SPRINGS.impact}
        from={{ x: 100 }}
        style={{ ...titleStyle, justifyContent: 'flex-start' }}
      />
      <div
        style={{
          width: 360,
          height: 14,
          backgroundColor: G.ink,
          transform: `scaleX(${underline})`,
          transformOrigin: 'left center',
          marginTop: 8,
        }}
      />
    </div>
  );
};

const Crosshair: React.FC<{ style: CSSProperties }> = ({ style }) => (
  <svg width={28} height={28} viewBox="0 0 28 28" style={{ position: 'absolute', ...style }}>
    <path d="M14 0 V28 M0 14 H28" stroke={G.indigo} strokeWidth={3} />
    <circle cx={14} cy={14} r={6} fill="none" stroke={G.ink} strokeWidth={3} />
  </svg>
);

// ── CARD 3 — Gráfico de barras vetorial ──────────────────────────────────
const BARS = [0.42, 0.68, 0.5, 0.86, 0.6, 1, 0.74, 0.9];
const BAR_AREA_H = 280;

const BarChart: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
  <div style={{ position: 'relative', height: BAR_AREA_H, display: 'flex', alignItems: 'flex-end', gap: 30 }}>
    {BARS.map((base, i) => {
      const grow = frame < 22 + i * 3 ? 0 : spring({ frame: frame - 22 - i * 3, fps, config: SPRINGS.impact });
      const live = 1 + 0.16 * Math.sin(frame * 0.07 + i * 0.9);
      const h = BAR_AREA_H * base * grow * live * 0.92;
      return (
        <div
          key={i}
          style={{
            width: 64,
            height: Math.max(0, h),
            backgroundColor: i === 5 ? G.ink : G.indigo,
            border: `4px solid ${G.black}`,
            boxSizing: 'border-box',
          }}
        />
      );
    })}
    <div style={{ position: 'absolute', left: -12, right: -12, bottom: -4, height: 6, backgroundColor: G.black }} />
  </div>
);

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const textsExit = useTextsExit(frame);

  // ── ENTRADAS (cartas jogadas na mesa) ─────────────────────────────────
  const sBase = frame < 10 ? 0 : spring({ frame: frame - 10, fps, config: SPRINGS.cardThrow });
  const sTop = frame < 15 ? 0 : spring({ frame: frame - 15, fps, config: SPRINGS.cardThrow });
  const stretch = ci(frame, [25, 43], [0, 1], Easing.out(Easing.back(1.5)));
  const centerIn = ci(frame, [25, 31], [0, 1]);

  // ── HOLD — parallax faux-2D em direções opostas ───────────────────────
  const px = Math.sin(frame * 0.035) * 10;
  const py = Math.cos(frame * 0.03) * 7;

  // ── SAÍDA — colapso no buraco negro (stagger 3f) ──────────────────────
  const exTop = collapse(frame, T.cardsExit, CARDS.top.y + CARDS.top.h / 2);
  const exCenter = collapse(frame, T.cardsExit + 3, CARDS.center.y + CARDS.center.h / 2);
  const exBase = collapse(frame, T.cardsExit + 6, CARDS.base.y + CARDS.base.h / 2);

  const hole = ci(frame, [T.holeStart, 448], [0, 1], Easing.in(Easing.cubic));
  const bgOpacity = ci(frame, [T.bgFade, 452], [1, 0], Easing.inOut(Easing.cubic));
  const fall = 1 + 0.5 * ci(frame, [425, 457], [0, 1], Easing.in(Easing.cubic)); // a câmera "cai"
  const dotsIn = ci(frame, [0, 10], [0, 1]);

  const cardTransform = (
    ex: ReturnType<typeof collapse>,
    baseX: number,
    baseY: number,
    baseRot: number,
    extra = ''
  ): CSSProperties => ({
    transform: `translate(${baseX + ex.x}px, ${baseY + ex.y}px) rotate(${baseRot + ex.rot}deg) scale(${ex.scale}) ${extra}`,
    filter: ex.blur > 0.05 ? `blur(${ex.blur}px)` : undefined,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: G.deep, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${fall})` }}>
        {/* BACKGROUND — off-white + grid de pontos indigo correndo em Y */}
        <AbsoluteFill style={{ opacity: bgOpacity }}>
          <AbsoluteFill style={{ backgroundColor: G.offWhite }} />
          <AbsoluteFill
            style={{
              opacity: 0.35 * dotsIn,
              backgroundImage: `radial-gradient(circle, ${G.indigo} 2px, transparent 2.6px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: `0px ${frame * 2}px`,
            }}
          />
        </AbsoluteFill>

        {/* BURACO NEGRO — o centro engole o plano */}
        <div
          style={{
            position: 'absolute',
            left: SCREEN.w / 2 - 1300,
            top: SCREEN.h / 2 - 1300,
            width: 2600,
            height: 2600,
            borderRadius: '50%',
            backgroundColor: G.deep,
            boxShadow: `0 0 120px 40px rgba(79,70,229,${0.55 * (1 - hole)})`,
            transform: `scale(${hole})`,
          }}
        />

        {/* CARD 3 — base (gráfico) */}
        <div
          style={{
            ...brutalCard,
            top: CARDS.base.y,
            height: CARDS.base.h,
            opacity: ci(frame, [10, 14], [0, 1]) * exBase.opacity,
            ...cardTransform(exBase, -px, 800 * (1 - sBase) - py, interpolate(sBase, [0, 1], [15, 2])),
          }}
        >
          <div style={{ padding: '36px 48px', ...textsExit }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <Caption>Infográfico</Caption>
              <Caption style={{ color: G.indigo }}>Dados • Vetor</Caption>
            </div>
            <BarChart frame={frame} fps={fps} />
          </div>
        </div>

        {/* CARD 1 — topo (tipografia cinética) */}
        <div
          style={{
            ...brutalCard,
            top: CARDS.top.y,
            height: CARDS.top.h,
            opacity: ci(frame, [15, 19], [0, 1]) * exTop.opacity,
            ...cardTransform(exTop, -800 * (1 - sTop) + px, py, interpolate(sTop, [0, 1], [-10, -3])),
          }}
        >
          <div style={{ ...textsExit, height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '32px 44px 0' }}>
              <Caption>Tipografia cinética</Caption>
              <Caption style={{ color: G.indigo }}>01</Caption>
            </div>
            <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KineticWord frame={frame} fps={fps} />
            </div>
          </div>
          <Marquee frame={frame} />
        </div>

        {/* CARD 2 — centro (título gigante, esticamento brutal) */}
        <div
          style={{
            ...brutalCard,
            top: CARDS.center.y,
            height: CARDS.center.h,
            opacity: centerIn * exCenter.opacity,
            ...cardTransform(exCenter, 0, py * 0.4, 0, `scaleY(${stretch})`),
          }}
        >
          <Crosshair style={{ left: 24, top: 24 }} />
          <Crosshair style={{ right: 24, bottom: 24 }} />
          <div
            style={{
              position: 'absolute',
              right: 36,
              top: 30,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 2,
              color: G.indigo,
              ...textsExit,
            }}
          >
            X 540 · Y 960
          </div>
          <div style={{ padding: '110px 64px 0', ...textsExit }}>
            <TitleBlock frame={frame} fps={fps} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
