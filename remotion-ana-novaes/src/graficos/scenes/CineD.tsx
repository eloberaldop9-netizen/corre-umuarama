import React, { CSSProperties, useLayoutEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { ci } from '../../lib/motion';
import { FONT, P, SPRINGS } from '../theme';
import { Sculpture, StudioEnvironment } from '../three/Studio';

// ─────────────────────────────────────────────────────────────────────────
// CENA 4 — Comunicação de Outro Nível (frames 1343–1800, local 0–457)
// Híbrido: a escultura da C3 projeta sombra real numa prancheta invisível;
// cards 2D orbitam ao redor dela (trocando de camada atrás/na frente),
// HUD chumbado na tela. Câmera em dolly out z -300 → -800. Saída: DISSOLVE.
// ─────────────────────────────────────────────────────────────────────────

/** Créditos — edite aqui (24px 800, tracking +5, cantos inferiores). */
export const CREDITS = {
  left: 'AGÊNCIA',
  right: 'PROJETO DIDÁTICO',
};

const T = {
  bg: 0,
  cards: 20,
  cardStagger: 10,
  titles: 40,
  cta: 60,
  credits: 75,
  dolly: [0, 400] as const,
  slabsIn: 0, // Blockout Híbrido: vidro entra sobre a massa chumbo da C3
  slabsOut: 18, // ...e sobe revelando o palco
  uiExit: 420,
  worldExit: 430,
  end: 456, // último frame da composição (1799) — preto absoluto
} as const;

const FOV = 40;
const OBJ_SCALE = 0.29;
const OBJ_CENTER = { x: 540, y: 990 };

const cameraDistance = (frame: number) => ci(frame, [T.dolly[0], T.dolly[1]], [300, 800], Easing.out(Easing.cubic));

const Rig: React.FC<{ frame: number }> = ({ frame }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    const d = cameraDistance(frame);
    camera.position.set(0, d * 0.16, d);
    camera.lookAt(0, 4, 0);
    camera.updateProjectionMatrix();
  }, [camera, frame]);
  return null;
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <StudioEnvironment intensity={0.55} />
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[180, 520, 260]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-260}
        shadow-camera-right={260}
        shadow-camera-top={260}
        shadow-camera-bottom={-260}
        shadow-camera-near={10}
        shadow-camera-far={1500}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-260, 220, -520]} intensity={3} color="#ffffff" />
      <pointLight position={[-420, 40, 260]} intensity={0.8} color="#FFB37A" decay={0} />
      <Rig frame={frame} />
      {/* escultura girando 0.5°/frame */}
      <group scale={OBJ_SCALE} rotation={[0.25, (frame * 0.5 * Math.PI) / 180, 0]}>
        <Sculpture wireDraw={1} wireOpacity={0} solidOpacity={1} shadows />
      </group>
      {/* prancheta plana invisível que recebe a sombra real */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -92, 0]} receiveShadow>
        <planeGeometry args={[3000, 3000]} />
        <shadowMaterial opacity={0.22} />
      </mesh>
    </>
  );
};

// ── CARDS 2D ORBITAIS ────────────────────────────────────────────────────
const CARD: CSSProperties = {
  width: 280,
  padding: '22px 24px',
  borderRadius: 20,
  backgroundColor: '#FFFFFF',
  boxShadow: '12px 16px 0 rgba(17,24,39,0.16)', // drop shadow rígida, plana
  fontFamily: FONT,
  color: P.ink,
  boxSizing: 'border-box',
};

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 3, color: P.slate }}>{children}</div>
);

const CardReach: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={CARD}>
    <Kicker>ALCANCE</Kicker>
    <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: -2, color: P.blueprint }}>+240%</div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 56, marginTop: 8 }}>
      {[0.4, 0.62, 0.5, 0.85, 1].map((b, i) => {
        const loop = 0.75 + 0.25 * Math.sin(frame * 0.06 + i * 0.9);
        return <div key={i} style={{ flex: 1, height: `${b * loop * 100}%`, backgroundColor: i === 4 ? P.neon : P.ink }} />;
      })}
    </div>
  </div>
);

const CardRetention: React.FC<{ frame: number }> = ({ frame }) => {
  const pct = 0.72 + 0.04 * Math.sin(frame * 0.04);
  const C = 2 * Math.PI * 30;
  return (
    <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: 18 }}>
      <svg width={76} height={76} viewBox="0 0 76 76">
        <circle cx={38} cy={38} r={30} fill="none" stroke="#E5E7EB" strokeWidth={10} />
        <circle
          cx={38}
          cy={38}
          r={30}
          fill="none"
          stroke={P.blueprint}
          strokeWidth={10}
          strokeDasharray={`${C * pct} ${C}`}
          transform="rotate(-90 38 38)"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <Kicker>RETENÇÃO</Kicker>
        <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1 }}>{Math.round(pct * 100)}%</div>
      </div>
    </div>
  );
};

const CardLayers: React.FC = () => (
  <div style={{ ...CARD, display: 'flex', alignItems: 'center', gap: 18 }}>
    <svg width={84} height={56} viewBox="0 0 84 56">
      <rect x={2} y={10} width={34} height={34} fill={P.blueprint} />
      <g fill="none" stroke={P.ink} strokeWidth={3} strokeLinejoin="round">
        <path d="M50 18 L64 10 L80 18 L64 26 Z" />
        <path d="M50 18 V40 L64 48 V26" />
        <path d="M80 18 V40 L64 48" />
      </g>
    </svg>
    <div>
      <Kicker>CAMADAS</Kicker>
      <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1 }}>2D + 3D</div>
    </div>
  </div>
);

const ORBIT_CARDS = [
  { phase: -0.9, from: [-900, -200], render: (f: number) => <CardReach frame={f} /> },
  { phase: 1.2, from: [900, 100], render: (f: number) => <CardRetention frame={f} /> },
  { phase: 3.0, from: [0, 900], render: () => <CardLayers /> },
] as const;

interface OrbitState {
  x: number;
  y: number;
  scale: number;
  front: boolean;
  opacity: number;
}

const orbitState = (frame: number, fps: number, i: number): OrbitState => {
  const c = ORBIT_CARDS[i];
  const k = Math.sqrt(800 / cameraDistance(frame)); // os cards participam do dolly
  const phi = c.phase + frame * 0.006;
  const depth = Math.cos(phi);
  const at = T.cards + i * T.cardStagger;
  const s = frame < at ? 0 : spring({ frame: frame - at, fps, config: SPRINGS.card });
  const hover = Math.sin(frame * 0.03 + i * 1.7) * 6;
  return {
    x: OBJ_CENTER.x + Math.sin(phi) * 330 * k + c.from[0] * (1 - s),
    y: OBJ_CENTER.y + depth * 120 * k + hover + c.from[1] * (1 - s),
    scale: (0.84 + 0.16 * depth) * Math.min(1.25, k),
    front: depth >= 0,
    opacity: ci(frame - at, [0, 6], [0, 1]),
  };
};

const OrbitLayer: React.FC<{ frame: number; fps: number; front: boolean }> = ({ frame, fps, front }) => (
  <>
    {ORBIT_CARDS.map((c, i) => {
      const st = orbitState(frame, fps, i);
      if (st.front !== front) return null;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: st.x - 140,
            top: st.y - 60,
            transform: `scale(${st.scale})`,
            opacity: st.opacity,
          }}
        >
          {c.render(frame)}
        </div>
      );
    })}
  </>
);

/** Anéis 2D pulsando ao redor do objeto. */
const Rings: React.FC<{ frame: number }> = ({ frame }) => {
  const k = Math.sqrt(800 / cameraDistance(frame));
  const pulse = (frame % 60) / 60;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      <g transform={`translate(${OBJ_CENTER.x} ${OBJ_CENTER.y + 40}) scale(${k})`} fill="none">
        <ellipse rx={360} ry={110} stroke={P.ink} strokeOpacity={0.18} strokeWidth={2} strokeDasharray="6 12" />
        <ellipse rx={300} ry={88} stroke={P.blueprint} strokeOpacity={0.35} strokeWidth={2} />
        <ellipse rx={300 + pulse * 140} ry={88 + pulse * 42} stroke={P.blueprint} strokeOpacity={0.35 * (1 - pulse)} strokeWidth={2} />
      </g>
    </svg>
  );
};

const HeartIcon = () => (
  <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={P.slate} strokeWidth={1.8}>
    <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
  </svg>
);
const ShareIcon = () => (
  <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke={P.slate} strokeWidth={1.8}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 7l-4-4-4 4M12 3v12" />
  </svg>
);

const Monogram: React.FC = () => (
  <svg width={56} height={30} viewBox="0 0 56 30">
    <rect x={1} y={4} width={22} height={22} fill={P.blueprint} />
    <g fill="none" stroke={P.ink} strokeWidth={2.5} strokeLinejoin="round">
      <path d="M32 10 L42 4 L54 10 L42 16 Z" />
      <path d="M32 10 V22 L42 28 V16" />
      <path d="M54 10 V22 L42 28" />
    </g>
  </svg>
);

// ── TRANSIÇÃO C3 → C4 — BLOCKOUT HÍBRIDO ──────────────────────────────────
// Lâminas de acrílico (glassmorphism) com grade plana sobem de baixo, cobrem
// a massa chumbo da C3 enquanto o palco cinza gelo nasce por trás, e seguem
// para cima revelando a composição. Direção: de baixo → para cima (a C2 saiu
// pelas laterais e a C3 pela lente — nenhuma direção se repete).
const SLABS = 4;
const SLAB_W = 1080 / SLABS;

const GlassSlabs: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {Array.from({ length: SLABS }, (_, i) => {
      // stagger 3f do centro para fora — o palco abre como uma cortina de vidro
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

/** Título HUD palavra por palavra: translateY -100→0, blur 10→0, out exp. */
const HudWords: React.FC<{ text: string; start: number; frame: number; color: string }> = ({ text, start, frame, color }) => (
  <div style={{ display: 'flex', justifyContent: 'center', columnGap: '0.26em', fontSize: 80, color }}>
    {text.split(' ').map((w, i) => {
      const p = ci(frame, [start + i * 3, start + i * 3 + 24], [0, 1], Easing.out(Easing.exp));
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            fontSize: 80,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 1.05,
            opacity: p,
            transform: `translateY(${-100 * (1 - p)}px)`,
            filter: p < 0.999 ? `blur(${10 * (1 - p)}px)` : undefined,
          }}
        >
          {w}
        </span>
      );
    })}
  </div>
);

export const CineD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const bgIn = ci(frame, [T.bg, T.bg + 30], [0, 1], Easing.out(Easing.cubic));
  // O palco (cinza gelo + 3D) só nasce quando o vidro já cobre a massa chumbo.
  const stage = ci(frame, [T.slabsIn + 12, T.slabsOut + 6], [0, 1], Easing.out(Easing.cubic));

  const ctaP = ci(frame, [T.cta, T.cta + 24], [0, 1], Easing.out(Easing.exp));
  const creditsP = ci(frame, [T.credits, T.credits + 24], [0, 1], Easing.out(Easing.exp));

  // Saída — DISSOLVE elegante
  const ui = ci(frame, [T.uiExit, T.uiExit + 30], [0, 1], Easing.inOut(Easing.cubic));
  const world = ci(frame, [T.worldExit, T.end], [0, 1], Easing.in(Easing.cubic));
  const uiExit: CSSProperties = {
    opacity: 1 - ui,
    filter: ui > 0.01 ? `blur(${10 * ui}px)` : undefined,
    transform: `translateY(${20 * ui}px) scale(${1 - 0.04 * ui})`,
  };

  return (
    <AbsoluteFill style={{ overflow: 'hidden', fontFamily: FONT }}>
      {/* Massa chumbo herdada da C3 — some quando o palco cinza gelo assume,
          para que o dissolve final caia no preto absoluto da composição. */}
      <AbsoluteFill style={{ backgroundColor: P.lead, opacity: 1 - bgIn }} />
      {/* MUNDO — BG + 3D + cards orbitais (dissolve 430) */}
      <AbsoluteFill style={{ opacity: stage * (1 - world), transform: `scale(${1 + 0.02 * world})` }}>
        <AbsoluteFill style={{ opacity: bgIn }}>
          <AbsoluteFill style={{ backgroundColor: P.ice }} />
          <AbsoluteFill
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div style={uiExit}>
            <Rings frame={frame} />
          </div>
        </AbsoluteFill>

        <div style={{ position: 'absolute', inset: 0, ...uiExit }}>
          <OrbitLayer frame={frame} fps={fps} front={false} />
        </div>

        <ThreeCanvas
          width={width}
          height={height}
          shadows
          camera={{ fov: FOV, near: 1, far: 6000, position: [0, 48, 300] }}
          gl={{ antialias: true }}
        >
          <World />
        </ThreeCanvas>

        <div style={{ position: 'absolute', inset: 0, ...uiExit }}>
          <OrbitLayer frame={frame} fps={fps} front />
        </div>
      </AbsoluteFill>

      <GlassSlabs frame={frame} />

      {/* HUD — chumbado na tela (Z mais alto) */}
      <div style={{ position: 'absolute', inset: 0, ...uiExit }}>
        <div style={{ position: 'absolute', top: 160, left: 40, right: 40 }}>
          <HudWords text="Comunicação de" start={T.titles} frame={frame} color={P.ink} />
          <HudWords text="Outro Nível!" start={T.titles + 4} frame={frame} color={P.blueprint} />
        </div>

        {/* Card rodapé CTA — vidro blur 16px */}
        <div
          style={{
            position: 'absolute',
            left: 140,
            right: 140,
            bottom: 230,
            height: 116,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.8)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            opacity: ctaP,
            transform: `translateY(${100 * (1 - ctaP)}px)`,
          }}
        >
          <HeartIcon />
          <span style={{ fontSize: 32, fontWeight: 500, letterSpacing: 2, color: P.slate }}>Curta e Compartilhe</span>
          <ShareIcon />
        </div>

        {/* Logo / créditos — cantos inferiores */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            right: 60,
            bottom: 96,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 5,
            color: P.ink,
            opacity: creditsP,
            transform: `translateY(${30 * (1 - creditsP)}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Monogram />
            {CREDITS.left}
          </div>
          <div>{CREDITS.right}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
