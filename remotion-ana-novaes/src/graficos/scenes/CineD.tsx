import React, { CSSProperties, useLayoutEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { ci } from '../../lib/motion';
import { FONT, P, SPRINGS } from '../theme';
import { MorphShape, StudioEnvironment } from '../three/Studio';
import { ProductCan } from '../three/Can';
import { BarChart, Donut, LineChart, Poster } from './CineB';

// ─────────────────────────────────────────────────────────────────────────
// CENA 4 — Comunicação de Outro Nível (frames 1343–1800, local 0–456)
// Roteiro: "o projeto final é exibido com harmonia perfeita entre elementos
// planos e volumétricos" + CTA. Ao fundo, a colagem do que construiu o vídeo
// — o cubo e a lata (3D) junto do cartaz e dos infográficos (2D) — desfocada,
// opaca e dessaturada, recuando num dolly out lento. Na frente, um painel de
// vidro com o título, o subtítulo e os botões de curtir/compartilhar sendo
// clicados por um cursor. Saída: DISSOLVE elegante até o preto absoluto.
// ─────────────────────────────────────────────────────────────────────────

const T = {
  bg: 0,
  slabsIn: 0, // Blockout Híbrido: vidro entra sobre a massa chumbo da C3
  slabsOut: 18, // ...e sobe revelando o palco
  panel: 26,
  title: [38, 46] as const,
  subtitle: 66,
  buttons: [84, 90] as const,
  cursorIn: 120,
  clickLike: 156,
  clickShare: 214,
  cursorOut: 262,
  dolly: [0, 400] as const,
  uiExit: 420,
  worldExit: 430,
  end: 456, // último frame da composição (1799) — preto absoluto
} as const;

const ENTRY = Easing.out(Easing.cubic);

// ── TRANSIÇÃO C3 → C4 — BLOCKOUT HÍBRIDO ──────────────────────────────────
// Lâminas de acrílico com grade plana sobem de baixo, cobrem a massa chumbo
// da C3 enquanto o palco nasce por trás, e seguem para cima revelando a cena.
const SLABS = 4;
const SLAB_W = 1080 / SLABS;

const GlassSlabs: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {Array.from({ length: SLABS }, (_, i) => {
      const order = [1, 0, 2, 3][i];
      const inP = ci(frame, [T.slabsIn + order * 3, T.slabsIn + order * 3 + 16], [1, 0], Easing.out(Easing.exp));
      const outP = ci(frame, [T.slabsOut + order * 3, T.slabsOut + order * 3 + 16], [0, 1], Easing.in(Easing.exp));
      const y = 1920 * inP - 2100 * outP;
      const blur = 4 + 18 * outP;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: i * SLAB_W - 1,
            top: 0,
            width: SLAB_W + 2,
            height: 1920,
            transform: `translateY(${y}px) scale(${1 - 0.04 * outP})`,
            backgroundColor: 'rgba(229,231,235,0.22)',
            backgroundImage:
              'linear-gradient(rgba(17,24,39,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.10) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            borderLeft: '1px solid rgba(255,255,255,0.55)',
            borderRight: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: `blur(${blur}px) saturate(1.2)`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(1.2)`,
            opacity: ci(outP, [0.4, 1], [1, 0]),
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── FUNDO 3D — cubo (C1) + lata (C3) girando devagar ─────────────────────
const Rig: React.FC = () => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.set(0, 60, 900);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
};

const World3D: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = (frame * 0.5 * Math.PI) / 180; // 0.5°/frame
  return (
    <>
      <StudioEnvironment intensity={0.9} rotationY={frame * 0.01} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[300, 500, 400]} intensity={2.2} />
      <Rig />
      <group position={[170, -150, 0]} rotation={[0, spin + 2.6, 0.12]} scale={1.15}>
        <ProductCan wireDraw={1} wireOpacity={0} solidOpacity={1} labelWipe={1} />
      </group>
      <group position={[-150, 190 + Math.sin(frame * 0.02) * 10, -60]}>
        <MorphShape morph={1} round={0.12} rotation={[-0.5, 0.72 + spin * 0.6, 0]} size={120} y={0} scale={1} />
      </group>
    </>
  );
};

// ── COLAGEM 2D — peças da Cena 2 já montadas, flutuando ──────────────────
const BUILT = 500; // frame "local" da C2 em que tudo já está montado
const drift = (frame: number, phase: number, amp = 8) => Math.sin(frame * 0.02 + phase) * amp;

const Piece: React.FC<{ x: number; y: number; w: number; h: number; scale: number; rot: number; phase: number; frame: number; children: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  scale,
  rot,
  phase,
  frame,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y + drift(frame, phase),
      width: w,
      height: h,
      transform: `scale(${scale}) rotate(${rot}deg)`,
      transformOrigin: 'top left',
    }}
  >
    {children}
  </div>
);

const Collage2D: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const f = BUILT + frame;
  return (
    <>
      <Piece x={40} y={1060} w={448} h={640} scale={0.72} rot={-4} phase={0} frame={frame}>
        <Poster frame={f} fps={fps} />
      </Piece>
      <Piece x={640} y={180} w={448} h={308} scale={0.8} rot={5} phase={1.3} frame={frame}>
        <BarChart frame={f} />
      </Piece>
      <Piece x={600} y={1240} w={448} h={308} scale={0.78} rot={3} phase={2.1} frame={frame}>
        <Donut frame={f} />
      </Piece>
      <Piece x={40} y={120} w={560} h={240} scale={0.85} rot={-3} phase={0.7} frame={frame}>
        <LineChart frame={f} box={{ x: 0, y: 0, w: 560, h: 240 }} />
      </Piece>
      {/* formas planas soltas */}
      <div style={{ position: 'absolute', left: 860, top: 760 + drift(frame, 2.8, 14), width: 150, height: 150, borderRadius: '50%', backgroundColor: P.neon }} />
      <div style={{ position: 'absolute', left: 90, top: 820 + drift(frame, 1.9, 12), width: 110, height: 110, backgroundColor: P.blueprint, transform: `rotate(${frame * 0.2}deg)` }} />
    </>
  );
};

// ── TÍTULO — palavra por palavra ─────────────────────────────────────────
const Words: React.FC<{ text: string; start: number; frame: number; style: CSSProperties }> = ({ text, start, frame, style }) => (
  <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', columnGap: '0.26em', ...style }}>
    {text.split(' ').map((w, i) => {
      const s = start + i * 3;
      const p = ci(frame, [s, s + 22], [0, 1], ENTRY);
      const bl = 12 * ci(frame, [s, s + 13], [1, 0]);
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            opacity: ci(frame, [s, s + 12], [0, 1]),
            transform: `translateY(${(1 - p) * 50}px)`,
            filter: bl > 0.05 ? `blur(${bl}px)` : undefined,
          }}
        >
          {w}
        </span>
      );
    })}
  </div>
);

// ── BOTÕES — curtir / compartilhar com clique ────────────────────────────
const THUMB =
  'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z';
const SHARE = 'M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z';

const BTN = 168;

const ActionButton: React.FC<{ frame: number; fps: number; enter: number; click: number; icon: string; active: string }> = ({
  frame,
  fps,
  enter,
  click,
  icon,
  active,
}) => {
  // entrada: scale + bounce (skill: badges/ícones)
  const inS = frame < enter ? 0 : spring({ frame: frame - enter, fps, config: SPRINGS.badge });
  // clique: afunda 4 frames e volta com mola
  const press = ci(frame, [click - 4, click], [0, 1], Easing.out(Easing.cubic));
  const release = frame < click ? 0 : spring({ frame: frame - click, fps, config: { damping: 9, mass: 0.6, stiffness: 180 } });
  const scale = (0.6 + 0.4 * inS) * (1 - 0.14 * press * (1 - release));
  const on = ci(frame, [click, click + 4], [0, 1]);
  const ring = ci(frame, [click, click + 20], [0, 1], Easing.out(Easing.cubic));
  const burst = ci(frame, [click, click + 18], [0, 1], Easing.out(Easing.cubic));
  return (
    <div style={{ position: 'relative', width: BTN, height: BTN, opacity: ci(frame - enter, [0, 8], [0, 1]) }}>
      {/* onda do clique */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `4px solid ${active}`,
          transform: `scale(${1 + 0.7 * ring})`,
          opacity: frame < click ? 0 : 0.6 * (1 - ring),
        }}
      />
      {/* faíscas */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const d = 100 + 50 * burst;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: BTN / 2 - 7 + Math.cos(a) * d,
              top: BTN / 2 - 7 + Math.sin(a) * d,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: i % 2 ? P.neon : active,
              opacity: frame < click ? 0 : 1 - burst,
              transform: `scale(${1 - 0.6 * burst})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: on > 0.5 ? active : '#FFFFFF',
          boxShadow: '0 18px 40px rgba(17,24,39,0.16), 0 2px 6px rgba(17,24,39,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <svg width={76} height={76} viewBox="0 0 24 24">
          <path d={icon} fill={on > 0.5 ? '#FFFFFF' : P.ink} />
        </svg>
      </div>
    </div>
  );
};

/** Cursor: entra, clica em curtir, depois em compartilhar, e sai. */
const Cursor: React.FC<{ frame: number; like: { x: number; y: number }; share: { x: number; y: number } }> = ({ frame, like, share }) => {
  const start = { x: 1000, y: 1700 };
  const end = { x: 1120, y: 1500 };
  const toLike = ci(frame, [T.cursorIn, T.clickLike - 6], [0, 1], Easing.inOut(Easing.cubic));
  const toShare = ci(frame, [T.clickLike + 22, T.clickShare - 6], [0, 1], Easing.inOut(Easing.cubic));
  const away = ci(frame, [T.cursorOut, T.cursorOut + 26], [0, 1], Easing.in(Easing.cubic));
  let x = start.x + (like.x - start.x) * toLike;
  let y = start.y + (like.y - start.y) * toLike;
  x += (share.x - like.x) * toShare;
  y += (share.y - like.y) * toShare;
  x += (end.x - share.x) * away;
  y += (end.y - share.y) * away;
  const tap = (c: number) => ci(frame, [c - 4, c], [0, 1]) * (1 - ci(frame, [c, c + 6], [0, 1]));
  const s = 1 - 0.18 * Math.max(tap(T.clickLike), tap(T.clickShare));
  return (
    <svg
      width={72}
      height={72}
      viewBox="0 0 24 24"
      style={{
        position: 'absolute',
        left: x - 10,
        top: y - 6,
        transform: `scale(${s})`,
        transformOrigin: '10px 6px',
        opacity: ci(frame, [T.cursorIn, T.cursorIn + 8], [0, 1]) * (1 - away),
        filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.25))',
      }}
    >
      <path d="M5 2 L5 19 L9.5 14.8 L12.6 21.6 L15.4 20.4 L12.3 13.7 L18.4 13.4 Z" fill="#FFFFFF" stroke={P.ink} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
};

// geometria do painel / botões (px absolutos)
const PANEL = { x: 80, y: 560, w: 920, h: 800 };
const BTN_Y = PANEL.y + 540;
const LIKE_C = { x: 540 - 30 - BTN / 2, y: BTN_Y + BTN / 2 };
const SHARE_C = { x: 540 + 30 + BTN / 2, y: BTN_Y + BTN / 2 };

export const CineD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const bgIn = ci(frame, [T.bg, T.bg + 30], [0, 1], ENTRY);
  // O palco só nasce quando o vidro já cobre a massa chumbo.
  const stage = ci(frame, [T.slabsIn + 12, T.slabsOut + 6], [0, 1], ENTRY);
  const dolly = ci(frame, [T.dolly[0], T.dolly[1]], [1.14, 1], ENTRY);

  // Saída — DISSOLVE elegante
  const ui = ci(frame, [T.uiExit, T.uiExit + 30], [0, 1], Easing.inOut(Easing.cubic));
  const world = ci(frame, [T.worldExit, T.end], [0, 1], Easing.in(Easing.cubic));
  const uiExit: CSSProperties = {
    opacity: 1 - ui,
    filter: ui > 0.01 ? `blur(${10 * ui}px)` : undefined,
    transform: `translateY(${20 * ui}px) scale(${1 - 0.04 * ui})`,
  };

  const panelP = ci(frame, [T.panel, T.panel + 26], [0, 1], Easing.out(Easing.exp));

  return (
    <AbsoluteFill style={{ overflow: 'hidden', fontFamily: FONT }}>
      {/* Massa chumbo herdada da C3 — some quando o palco assume. */}
      <AbsoluteFill style={{ backgroundColor: P.lead, opacity: 1 - bgIn }} />

      {/* MUNDO — fundo cinza gelo + colagem 2D/3D desfocada e opaca */}
      <AbsoluteFill style={{ opacity: stage * (1 - world), transform: `scale(${1 + 0.02 * world})` }}>
        <AbsoluteFill style={{ backgroundColor: P.ice }} />
        <AbsoluteFill
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <AbsoluteFill
          style={{
            transform: `scale(${dolly})`,
            filter: 'blur(9px) saturate(0.35)',
            opacity: 0.5,
          }}
        >
          <Collage2D frame={frame} fps={fps} />
          <ThreeCanvas width={width} height={height} camera={{ fov: 40, near: 1, far: 6000, position: [0, 60, 900] }} gl={{ antialias: true }}>
            <World3D />
          </ThreeCanvas>
        </AbsoluteFill>
      </AbsoluteFill>

      <GlassSlabs frame={frame} />

      {/* HUD — painel de vidro com título, subtítulo e CTA */}
      <div style={{ position: 'absolute', inset: 0, ...uiExit }}>
        <div
          style={{
            position: 'absolute',
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            borderRadius: 48,
            backgroundColor: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(255,255,255,0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 30px 80px rgba(17,24,39,0.12)',
            opacity: panelP,
            transform: `translateY(${100 * (1 - panelP)}px)`,
          }}
        />
        <div style={{ position: 'absolute', left: PANEL.x + 40, right: 1080 - PANEL.x - PANEL.w + 40, top: PANEL.y + 110 }}>
          <Words text="Comunicação de" start={T.title[0]} frame={frame} style={{ fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05, color: P.ink }} />
          <Words text="Outro Nível!" start={T.title[1]} frame={frame} style={{ fontSize: 96, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05, color: P.blueprint }} />
          <div style={{ height: 36 }} />
          <Words text="Curta e Compartilhe" start={T.subtitle} frame={frame} style={{ fontSize: 44, fontWeight: 500, letterSpacing: 1, color: P.slate }} />
        </div>
        <div style={{ position: 'absolute', left: LIKE_C.x - BTN / 2, top: BTN_Y }}>
          <ActionButton frame={frame} fps={fps} enter={T.buttons[0]} click={T.clickLike} icon={THUMB} active={P.blueprint} />
        </div>
        <div style={{ position: 'absolute', left: SHARE_C.x - BTN / 2, top: BTN_Y }}>
          <ActionButton frame={frame} fps={fps} enter={T.buttons[1]} click={T.clickShare} icon={SHARE} active={P.ink} />
        </div>
        <Cursor frame={frame} like={{ x: LIKE_C.x + 20, y: LIKE_C.y + 24 }} share={{ x: SHARE_C.x + 20, y: SHARE_C.y + 24 }} />
      </div>
    </AbsoluteFill>
  );
};
