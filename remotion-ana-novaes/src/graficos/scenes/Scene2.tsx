import React, { CSSProperties } from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../../lib/motion';
import { FONT, G, SPRINGS } from '../theme';
import { SpringWords } from '../SpringWords';
import { AppBadge } from '../AppBadge';

// ─────────────────────────────────────────────────────────────────────────
// CENA 2 — O Dinamismo do 2D (frames 293–750, local 0–457)
// Roteiro: elementos planos, tipografias dinâmicas, vinhetas, cartazes e
// infográficos "sendo organizados na tela", criados no After Effects.
// Colagem brutalista com física só em X/Y. Saída: COLAPSO Z-DIVE.
// ─────────────────────────────────────────────────────────────────────────

const SCREEN = { w: 1080, h: 1920 };

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
const CARDS: Record<'comp' | 'title' | 'poster' | 'chart', Rect> = {
  comp: { x: 80, y: 130, w: 920, h: 440 },
  title: { x: 80, y: 640, w: 920, h: 520 },
  poster: { x: 80, y: 1230, w: 420, h: 540 },
  chart: { x: 540, y: 1230, w: 460, h: 540 },
};
const BADGE = { x: 600, y: 588 };

const T = {
  textsExit: 410,
  cardsExit: 415,
  holeStart: 418,
  bgFade: 435,
} as const;

const brutalCard = (r: Rect): CSSProperties => ({
  position: 'absolute',
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
  backgroundColor: G.white,
  border: `4px solid ${G.black}`,
  boxShadow: `12px 12px 0 0 ${G.black}`,
  boxSizing: 'border-box',
  overflow: 'hidden',
  fontFamily: FONT,
  color: G.ink,
});

/** Saída quádrupla rumo ao centro da tela (buraco negro). */
const collapse = (frame: number, start: number, cx: number, cy: number) => {
  const e = ci(frame, [start, start + 22], [0, 1], Easing.in(Easing.exp));
  return {
    x: (SCREEN.w / 2 - cx) * e,
    y: (SCREEN.h / 2 - cy) * e,
    scale: interpolate(e, [0, 1], [1, 0.1]),
    rot: 45 * e,
    blur: 30 * e,
    opacity: ci(e, [0.3, 1], [1, 0]),
  };
};
type Collapse = ReturnType<typeof collapse>;
const collapseRect = (frame: number, start: number, r: Rect) => collapse(frame, start, r.x + r.w / 2, r.y + r.h / 2);

const placed = (ex: Collapse, x: number, y: number, rot: number, extra = ''): CSSProperties => ({
  transform: `translate(${x + ex.x}px, ${y + ex.y}px) rotate(${rot + ex.rot}deg) scale(${ex.scale}) ${extra}`,
  filter: ex.blur > 0.05 ? `blur(${ex.blur}px)` : undefined,
});

/** Todos os textos dos cards somem antes dos cards (scale 1→0). */
const textsExitStyle = (frame: number): CSSProperties => {
  const e = ci(frame, [T.textsExit, T.textsExit + 14], [0, 1], Easing.in(Easing.exp));
  return { transform: `scale(${1 - e})`, opacity: 1 - e };
};

const Caption: React.FC<{ children: React.ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', ...style }}>{children}</div>
);

// ── CARD 1 — Janela de composição: tipografia cinética + timeline + vinheta ──
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
        fontSize: 120,
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

const TIMELINE_KEYS = [0.06, 0.22, 0.41, 0.58, 0.77, 0.93];

/** Timeline de keyframes estilo After Effects, com playhead em loop. */
const Timeline: React.FC<{ frame: number }> = ({ frame }) => {
  const head = ((Math.max(0, frame - 30) % KINETIC_PERIOD) / KINETIC_PERIOD) * 0.92 + 0.04;
  const appear = ci(frame, [28, 44], [0, 1], Easing.out(Easing.cubic));
  return (
    <div style={{ position: 'relative', height: 44, margin: '0 40px', transform: `scaleX(${appear})`, transformOrigin: 'left' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 20, height: 4, backgroundColor: G.ink, opacity: 0.15 }} />
      <div
        style={{ position: 'absolute', left: 0, width: `${head * 100}%`, top: 20, height: 4, backgroundColor: G.indigo }}
      />
      {TIMELINE_KEYS.map((k, i) => {
        const passed = head >= k;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${k * 100}%`,
              top: 12,
              width: 18,
              height: 18,
              marginLeft: -9,
              transform: `rotate(45deg) scale(${passed ? 1.15 : 1})`,
              backgroundColor: passed ? G.indigo : G.white,
              border: `3px solid ${G.black}`,
              boxSizing: 'border-box',
            }}
          />
        );
      })}
      <div style={{ position: 'absolute', left: `${head * 100}%`, top: 0, bottom: 0, width: 3, backgroundColor: '#E11D48' }} />
    </div>
  );
};

const MARQUEE_TEXT = 'VINHETA ✦ MOTION GRAPHICS ✦ TIPOGRAFIA ✦ CARTAZ ✦ INFOGRÁFICO ✦ ';

const Marquee: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 60,
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
        transform: `translateX(${-((frame * 4) % 1500)}px)`,
        color: G.white,
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 2,
      }}
    >
      {MARQUEE_TEXT.repeat(6)}
    </div>
  </div>
);

const CompWindow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
  <>
    <div
      style={{
        height: 52,
        backgroundColor: G.black,
        color: G.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        {['#F87171', '#FBBF24', '#34D399'].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: c }} />
        ))}
      </div>
      <Caption style={{ fontSize: 17, letterSpacing: 2.5, color: 'rgba(255,255,255,0.85)' }}>
        Comp 01 · Tipografia cinética
      </Caption>
      <Caption style={{ fontSize: 17, color: G.indigo }}>2D</Caption>
    </div>
    <div style={{ ...textsExitStyle(frame) }}>
      <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <KineticWord frame={frame} fps={fps} />
      </div>
      <Timeline frame={frame} />
    </div>
    <Marquee frame={frame} />
  </>
);

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

// ── CARD 3 — Cartaz vetorial ─────────────────────────────────────────────
const Poster: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const sCircle = frame < 26 ? 0 : spring({ frame: frame - 26, fps, config: SPRINGS.impact });
  const bars = ci(frame, [30, 48], [0, 1], Easing.out(Easing.cubic));
  const orbit = frame * 0.6;
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: G.indigo, overflow: 'hidden' }}>
      {/* geometria do cartaz */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 70,
          width: 270,
          height: 270,
          borderRadius: '50%',
          backgroundColor: '#F4F4F5',
          border: `4px solid ${G.black}`,
          transform: `scale(${sCircle})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 210,
          top: 40,
          width: 150,
          height: 150,
          border: `4px solid ${G.black}`,
          backgroundColor: '#FBBF24',
          transform: `rotate(${orbit}deg) scale(${sCircle})`,
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 36,
            top: 372 + i * 22,
            width: 300 - i * 70,
            height: 10,
            backgroundColor: G.black,
            transform: `scaleX(${bars})`,
            transformOrigin: 'left',
          }}
        />
      ))}
      <div style={{ ...textsExitStyle(frame), position: 'absolute', left: 36, right: 36, bottom: 30 }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 0.9,
            color: G.white,
            WebkitTextStroke: `2px ${G.black}`,
          }}
        >
          CARTAZ
        </div>
        <Caption style={{ color: G.white, marginTop: 10, fontSize: 17 }}>Peça gráfica · 2D</Caption>
      </div>
    </div>
  );
};

// ── CARD 4 — Infográfico de barras ───────────────────────────────────────
const BARS = [0.42, 0.68, 0.5, 0.86, 1, 0.74];
const BAR_AREA_H = 300;

const BarChart: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
  <div style={{ position: 'relative', height: BAR_AREA_H, display: 'flex', alignItems: 'flex-end', gap: 18 }}>
    {BARS.map((base, i) => {
      const grow = frame < 24 + i * 3 ? 0 : spring({ frame: frame - 24 - i * 3, fps, config: SPRINGS.impact });
      const live = 1 + 0.16 * Math.sin(frame * 0.07 + i * 0.9);
      const h = BAR_AREA_H * base * grow * live * 0.86;
      return (
        <div
          key={i}
          style={{
            width: 46,
            height: Math.max(0, h),
            backgroundColor: i === 4 ? G.ink : G.indigo,
            border: `4px solid ${G.black}`,
            boxSizing: 'border-box',
          }}
        />
      );
    })}
    <div style={{ position: 'absolute', left: -10, right: -10, bottom: -4, height: 6, backgroundColor: G.black }} />
  </div>
);

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texts = textsExitStyle(frame);

  // ── ENTRADAS (cartas jogadas na mesa, overshoot pesado) ───────────────
  const throwIn = (at: number) => (frame < at ? 0 : spring({ frame: frame - at, fps, config: SPRINGS.cardThrow }));
  const sPoster = throwIn(10);
  const sChart = throwIn(13);
  const sComp = throwIn(15);
  const stretch = ci(frame, [25, 43], [0, 1], Easing.out(Easing.back(1.5)));
  const titleIn = ci(frame, [25, 31], [0, 1]);
  const sBadge = frame < 52 ? 0 : spring({ frame: frame - 52, fps, config: SPRINGS.impact });

  // ── HOLD — parallax faux-2D em direções opostas ───────────────────────
  const px = Math.sin(frame * 0.035) * 10;
  const py = Math.cos(frame * 0.03) * 7;

  // ── SAÍDA — colapso no buraco negro (stagger 3f) ──────────────────────
  const exComp = collapseRect(frame, T.cardsExit, CARDS.comp);
  const exBadge = collapse(frame, T.cardsExit + 1, BADGE.x + 170, BADGE.y + 50);
  const exTitle = collapseRect(frame, T.cardsExit + 3, CARDS.title);
  const exPoster = collapseRect(frame, T.cardsExit + 6, CARDS.poster);
  const exChart = collapseRect(frame, T.cardsExit + 9, CARDS.chart);

  const hole = ci(frame, [T.holeStart, 448], [0, 1], Easing.in(Easing.cubic));
  const bgOpacity = ci(frame, [T.bgFade, 452], [1, 0], Easing.inOut(Easing.cubic));
  const fall = 1 + 0.5 * ci(frame, [425, 457], [0, 1], Easing.in(Easing.cubic)); // a câmera "cai"
  const dotsIn = ci(frame, [0, 10], [0, 1]);

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

        {/* CARTAZ — base esquerda */}
        <div
          style={{
            ...brutalCard(CARDS.poster),
            left: 0,
            top: 0,
            opacity: ci(frame, [10, 14], [0, 1]) * exPoster.opacity,
            ...placed(exPoster, CARDS.poster.x - px, CARDS.poster.y + 800 * (1 - sPoster) - py, interpolate(sPoster, [0, 1], [15, -2])),
          }}
        >
          <Poster frame={frame} fps={fps} />
        </div>

        {/* INFOGRÁFICO — base direita */}
        <div
          style={{
            ...brutalCard(CARDS.chart),
            left: 0,
            top: 0,
            opacity: ci(frame, [13, 17], [0, 1]) * exChart.opacity,
            ...placed(exChart, CARDS.chart.x - px, CARDS.chart.y + 800 * (1 - sChart) - py, interpolate(sChart, [0, 1], [-12, 2])),
          }}
        >
          <div style={{ padding: '32px 36px', ...texts }}>
            <Caption>Infográfico</Caption>
            <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: -2, color: G.indigo, margin: '6px 0 34px' }}>
              +87%
            </div>
            <BarChart frame={frame} fps={fps} />
          </div>
        </div>

        {/* COMPOSIÇÃO — topo */}
        <div
          style={{
            ...brutalCard(CARDS.comp),
            left: 0,
            top: 0,
            opacity: ci(frame, [15, 19], [0, 1]) * exComp.opacity,
            ...placed(exComp, CARDS.comp.x - 800 * (1 - sComp) + px, CARDS.comp.y + py, interpolate(sComp, [0, 1], [-10, -3])),
          }}
        >
          <CompWindow frame={frame} fps={fps} />
        </div>

        {/* TÍTULO — centro (esticamento brutal) */}
        <div
          style={{
            ...brutalCard(CARDS.title),
            left: 0,
            top: 0,
            opacity: titleIn * exTitle.opacity,
            ...placed(exTitle, CARDS.title.x, CARDS.title.y + py * 0.4, 0, `scaleY(${stretch})`),
          }}
        >
          <Crosshair style={{ left: 24, top: 24 }} />
          <Crosshair style={{ right: 24, bottom: 24 }} />
          <div
            style={{ position: 'absolute', left: 70, bottom: 30, fontSize: 18, fontWeight: 600, letterSpacing: 2, color: G.indigo, ...texts }}
          >
            X 540 · Y 960
          </div>
          <div style={{ padding: '110px 64px 0', ...texts }}>
            <TitleBlock frame={frame} fps={fps} />
          </div>
        </div>

        {/* SELO — Feito no After Effects (sticker sobre a junção dos cards) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            opacity: ci(frame, [52, 57], [0, 1]) * exBadge.opacity,
            ...placed(exBadge, BADGE.x + px * 0.5, BADGE.y + py * 0.5, 4, `scale(${sBadge})`),
          }}
        >
          <AppBadge app="ae" variant="brutal" size={64} kicker="Feito no" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
