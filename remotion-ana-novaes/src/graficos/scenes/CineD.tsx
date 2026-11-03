import React, { CSSProperties, useLayoutEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { ci } from '../../lib/motion';
import { FONT, NV, P, SPRINGS } from '../theme';
import { StudioEnvironment } from '../three/Studio';
import { ProductCan } from '../three/Can';
import { LabelArt, LABEL_H, LABEL_W } from '../LabelArt';
import { BarChart, Donut, LineChart } from './CineB';

// ─────────────────────────────────────────────────────────────────────────
// CENA 4 — Comunicação de Outro Nível (frames 1343–1800, local 0–456)
// A síntese: a PEÇA FINAL da campanha, nítida — a lata 3D da Cena 3 no
// centro, com a arte do rótulo e os infográficos 2D da Cena 2 encaixados ao
// redor (os planos na frente e atrás do volume). Depois a composição recua e
// entra o painel "Curta e Compartilhe" com o cursor clicando em curtir e em
// compartilhar. Saída: DISSOLVE elegante até o preto absoluto.
// ─────────────────────────────────────────────────────────────────────────

const T = {
  slabsIn: 0, // Blockout Híbrido: vidro entra sobre a massa chumbo da C3
  slabsOut: 18, // ...e sobe revelando a peça
  stage: [12, 26] as const,
  can: 14,
  cards: [34, 44, 54, 64] as const, // cartaz, barras, rosca, linha
  title: [56, 64] as const,
  settle: [232, 264] as const, // a peça recua para abrir espaço ao CTA
  cta: 250,
  buttons: [272, 278] as const,
  cursorIn: 292,
  clickLike: 322,
  clickShare: 366,
  cursorOut: 396,
  uiExit: 422,
  worldExit: 430,
  end: 456, // último frame da composição (1799) — preto absoluto
} as const;

const ENTRY = Easing.out(Easing.cubic);
const MORPH = Easing.inOut(Easing.cubic);

// ── TRANSIÇÃO C3 → C4 — BLOCKOUT HÍBRIDO ──────────────────────────────────
// Lâminas de vidro azulado com grade plana sobem de baixo, cobrem a massa
// chumbo da C3 enquanto a peça nasce por trás, e seguem para cima.
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
            backgroundColor: 'rgba(26,47,94,0.35)',
            backgroundImage:
              'linear-gradient(rgba(143,179,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(143,179,255,0.10) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            borderLeft: '1px solid rgba(143,179,255,0.45)',
            borderRight: '1px solid rgba(143,179,255,0.15)',
            backdropFilter: `blur(${blur}px) saturate(1.2)`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(1.2)`,
            opacity: ci(outP, [0.4, 1], [1, 0]),
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ── LATA 3D — de frente, balançando devagar para o metal reagir à luz ────
const Rig: React.FC = () => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.set(0, 40, 900);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
};

const RIM_DIR = new THREE.Vector3(-0.6, 0.55, -0.6).normalize();

const World3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = frame < T.can ? 0 : spring({ frame: frame - T.can, fps, config: SPRINGS.morph });
  // π = frente do rótulo voltada para a câmera; balanço ±0.45 rad.
  const yaw = Math.PI + 0.45 * Math.sin(frame * 0.014);
  return (
    <>
      <StudioEnvironment intensity={0.6} rotationY={frame * 0.006} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[320, 420, 520]} intensity={2.4} />
      <directionalLight position={[-420, 320, -420]} intensity={3.2} color="#BFD3FF" />
      <pointLight position={[480, -60, 300]} intensity={1.2} color="#FFB37A" decay={0} />
      <Rig />
      <group position={[0, -20 - 40 * (1 - rise), 0]} rotation={[0, yaw, 0.06]} scale={1.18 * (0.9 + 0.1 * rise)}>
        <ProductCan wireDraw={1} wireOpacity={0} solidOpacity={1} labelWipe={1} rimGlow={0.7} rimDir={RIM_DIR} />
      </group>
    </>
  );
};

// ── CARDS 2D da Cena 2, encaixados ao redor da lata ──────────────────────
const CARD: CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: 22,
  overflow: 'hidden',
  background: `linear-gradient(160deg, ${NV.cardHi} 0%, ${NV.card} 100%)`,
  border: `1px solid ${NV.line}`,
  boxSizing: 'border-box',
};

interface PieceProps {
  frame: number;
  fps: number;
  enter: number;
  from: [number, number];
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
  rot: number;
  phase: number;
  children: React.ReactNode;
}

/** Peça 2D: entra com mola pesada vindo de fora e flutua (±6px, defasada). */
const Piece: React.FC<PieceProps> = ({ frame, fps, enter, from, x, y, w, h, scale, rot, phase, children }) => {
  const s = frame < enter ? 0 : spring({ frame: frame - enter, fps, config: SPRINGS.card });
  const hover = Math.sin(frame * 0.03 + phase) * 6 * ci(frame, [enter + 20, enter + 40], [0, 1]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x + from[0] * (1 - s),
        top: y + from[1] * (1 - s) + hover,
        width: w,
        height: h,
        transform: `rotate(${rot * s}deg) scale(${scale})`,
        transformOrigin: 'top left',
        opacity: ci(frame - enter, [0, 8], [0, 1]),
        // C4: as sombras voltam — o 2D agora flutua sobre o espaço do 3D
        filter: 'drop-shadow(0 26px 40px rgba(2,5,14,0.55))',
      }}
    >
      {children}
    </div>
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

const BTN = 160;

const ActionButton: React.FC<{
  frame: number;
  fps: number;
  enter: number;
  click: number;
  icon: string;
  active: string;
  activeIcon: string;
}> = ({ frame, fps, enter, click, icon, active, activeIcon }) => {
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
        const d = 96 + 48 * burst;
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
              backgroundColor: i % 2 ? NV.ice : active,
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
          backgroundColor: on > 0.5 ? active : 'rgba(26,47,94,0.9)',
          border: `1px solid ${on > 0.5 ? active : NV.line}`,
          boxShadow: '0 18px 40px rgba(2,5,14,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        <svg width={72} height={72} viewBox="0 0 24 24">
          <path d={icon} fill={on > 0.5 ? activeIcon : NV.ice} />
        </svg>
      </div>
    </div>
  );
};

/** Cursor: entra, clica em curtir, depois em compartilhar, e sai. */
const Cursor: React.FC<{ frame: number; like: { x: number; y: number }; share: { x: number; y: number } }> = ({ frame, like, share }) => {
  const start = { x: 1000, y: 1880 };
  const end = { x: 1140, y: 1700 };
  const toLike = ci(frame, [T.cursorIn, T.clickLike - 6], [0, 1], MORPH);
  const toShare = ci(frame, [T.clickLike + 14, T.clickShare - 6], [0, 1], MORPH);
  const away = ci(frame, [T.cursorOut, T.cursorOut + 24], [0, 1], Easing.in(Easing.cubic));
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
        filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))',
      }}
    >
      <path d="M5 2 L5 19 L9.5 14.8 L12.6 21.6 L15.4 20.4 L12.3 13.7 L18.4 13.4 Z" fill="#FFFFFF" stroke={NV.navy} strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
};

// geometria do CTA (px absolutos)
const PANEL = { x: 100, y: 1400, w: 880, h: 380 };
const BTN_Y = PANEL.y + 170;
const LIKE_C = { x: 540 - 34 - BTN / 2, y: BTN_Y + BTN / 2 };
const SHARE_C = { x: 540 + 34 + BTN / 2, y: BTN_Y + BTN / 2 };

const BUILT = 999; // infográficos já montados

export const CineD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const stage = ci(frame, [T.stage[0], T.stage[1]], [0, 1], ENTRY);
  // A peça recua (escala + sobe) para dar lugar ao CTA.
  const settle = ci(frame, [T.settle[0], T.settle[1]], [0, 1], MORPH);
  const pieceScale = 1 - 0.14 * settle;
  const pieceLift = -150 * settle;

  // Saída — DISSOLVE elegante
  const ui = ci(frame, [T.uiExit, T.uiExit + 28], [0, 1], MORPH);
  const world = ci(frame, [T.worldExit, T.end], [0, 1], Easing.in(Easing.cubic));
  const uiExit: CSSProperties = {
    opacity: 1 - ui,
    filter: ui > 0.01 ? `blur(${10 * ui}px)` : undefined,
    transform: `translateY(${20 * ui}px) scale(${1 - 0.04 * ui})`,
  };
  const panelP = ci(frame, [T.cta, T.cta + 26], [0, 1], Easing.out(Easing.exp));
  const subP = ci(frame, [T.cta + 10, T.cta + 32], [0, 1], ENTRY);

  return (
    <AbsoluteFill style={{ overflow: 'hidden', fontFamily: FONT }}>
      {/* Massa chumbo herdada da C3 — some quando a peça assume. */}
      <AbsoluteFill style={{ backgroundColor: P.lead, opacity: 1 - stage }} />

      {/* MUNDO — fundo marinho + peça final (lata 3D + planos 2D) */}
      <AbsoluteFill style={{ opacity: stage * (1 - world), transform: `scale(${1 + 0.02 * world})` }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 50% at 50% 48%, #1A2F5E 0%, ${NV.navy} 58%, ${NV.abyss} 100%)` }} />
        <AbsoluteFill
          style={{
            backgroundImage:
              'linear-gradient(rgba(143,179,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(143,179,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <AbsoluteFill style={{ transformOrigin: '540px 900px', transform: `translateY(${pieceLift}px) scale(${pieceScale})` }}>
          {/* planos ATRÁS da lata */}
          <Piece frame={frame} fps={fps} enter={T.cards[0]} from={[-600, -80]} x={50} y={560} w={LABEL_W} h={LABEL_H} scale={0.58} rot={-6} phase={0}>
            <div style={{ ...CARD, border: 'none' }}>
              <LabelArt build={BUILT} />
            </div>
          </Piece>
          <Piece frame={frame} fps={fps} enter={T.cards[3]} from={[600, 120]} x={660} y={1190} w={560} h={240} scale={0.64} rot={-4} phase={2.4}>
            <div style={CARD}>
              <LineChart frame={BUILT + frame} box={{ x: 0, y: 0, w: 560, h: 240 }} />
            </div>
          </Piece>

          {/* sombra de contato da lata no "chão" */}
          <div
            style={{
              position: 'absolute',
              left: 540 - 250,
              top: 1330,
              width: 500,
              height: 80,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(2,5,14,0.7) 0%, transparent 70%)',
              opacity: stage,
            }}
          />
          <ThreeCanvas width={width} height={height} camera={{ fov: 40, near: 1, far: 6000, position: [0, 40, 900] }} gl={{ antialias: true }}>
            <World3D />
          </ThreeCanvas>

          {/* planos NA FRENTE da lata */}
          <Piece frame={frame} fps={fps} enter={T.cards[1]} from={[600, -60]} x={740} y={610} w={448} h={308} scale={0.64} rot={5} phase={0.8}>
            <div style={CARD}>
              <BarChart frame={BUILT + frame} />
            </div>
          </Piece>
          <Piece frame={frame} fps={fps} enter={T.cards[2]} from={[-600, 100]} x={44} y={1110} w={448} h={308} scale={0.64} rot={4} phase={1.6}>
            <div style={CARD}>
              <Donut frame={BUILT + frame} />
            </div>
          </Piece>
        </AbsoluteFill>
      </AbsoluteFill>

      <GlassSlabs frame={frame} />

      {/* HUD — título no topo e CTA */}
      <div style={{ position: 'absolute', inset: 0, ...uiExit }}>
        <div style={{ position: 'absolute', left: 40, right: 40, top: 170, transform: `translateY(${pieceLift * 0.35}px)` }}>
          <Words text="Comunicação de" start={T.title[0]} frame={frame} style={{ fontSize: 92, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05, color: NV.ice }} />
          <Words text="Outro Nível!" start={T.title[1]} frame={frame} style={{ fontSize: 92, fontWeight: 900, letterSpacing: -3, lineHeight: 1.05, color: NV.sky }} />
        </div>

        {/* painel de vidro escuro do CTA */}
        <div
          style={{
            position: 'absolute',
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            borderRadius: 44,
            backgroundColor: 'rgba(18,35,74,0.6)',
            border: `1px solid ${NV.line}`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 30px 80px rgba(2,5,14,0.55)',
            opacity: panelP,
            transform: `translateY(${100 * (1 - panelP)}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: PANEL.x,
            width: PANEL.w,
            top: PANEL.y + 56,
            textAlign: 'center',
            fontSize: 54,
            fontWeight: 800,
            letterSpacing: -1,
            color: NV.ice,
            opacity: subP,
            transform: `translateY(${(1 - subP) * 40}px)`,
            filter: subP < 0.999 ? `blur(${10 * (1 - subP)}px)` : undefined,
          }}
        >
          Curta e Compartilhe
        </div>
        <div style={{ position: 'absolute', left: LIKE_C.x - BTN / 2, top: BTN_Y }}>
          <ActionButton frame={frame} fps={fps} enter={T.buttons[0]} click={T.clickLike} icon={THUMB} active={NV.azure} activeIcon="#FFFFFF" />
        </div>
        <div style={{ position: 'absolute', left: SHARE_C.x - BTN / 2, top: BTN_Y }}>
          <ActionButton frame={frame} fps={fps} enter={T.buttons[1]} click={T.clickShare} icon={SHARE} active={NV.sky} activeIcon={NV.navy} />
        </div>
        <Cursor frame={frame} like={{ x: LIKE_C.x + 18, y: LIKE_C.y + 22 }} share={{ x: SHARE_C.x + 18, y: SHARE_C.y + 22 }} />
      </div>
    </AbsoluteFill>
  );
};
