import React, { useLayoutEffect, useMemo } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { ci } from '../../lib/motion';
import { FONT, P } from '../theme';
import { AppBadge } from '../AppBadge';
import { Dust, Sculpture, StudioEnvironment } from '../three/Studio';

// ─────────────────────────────────────────────────────────────────────────
// CENA 3 — A Profundidade do 3D (frames 743–1350, local 0–607)
// Esqueleto wireframe ciano se desenha no vazio → órbita 180° épica →
// malha vira sólido chumbo texturizado → Rim Light acende → Fill quente.
// Saída: WIPE VOLUMÉTRICO — órbita vertiginosa + escala 1→40 (blockout).
// ─────────────────────────────────────────────────────────────────────────

const T = {
  wire: 10,
  etapa: 40,
  title: 50,
  titleStagger: 15,
  orbit: [30, 570] as const,
  solid: [200, 260] as const,
  rim: [280, 320] as const,
  fill: [320, 360] as const,
  hud: 90,
  textExit: 570,
  inflate: 575,
  end: 600,
} as const;

const ORBIT_RADIUS = 800;
const LOOK_AT = new THREE.Vector3(0, 70, 0);
const SCULPT_SCALE = 0.62;

const orbitAngle = (frame: number) =>
  ci(frame, [T.orbit[0], T.orbit[1]], [0, Math.PI], Easing.inOut(Easing.cubic)) +
  ci(frame, [T.textExit, T.end], [0, Math.PI * 0.9], Easing.in(Easing.exp)); // acelera vertiginosamente

const camPosition = (frame: number) => {
  const a = orbitAngle(frame);
  return new THREE.Vector3(Math.sin(a) * ORBIT_RADIUS, 150, Math.cos(a) * ORBIT_RADIUS);
};

const Rig: React.FC<{ frame: number }> = ({ frame }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.copy(camPosition(frame));
    camera.lookAt(LOOK_AT);
    camera.updateProjectionMatrix();
  }, [camera, frame]);
  return null;
};

/** Rim (directional traseiro branco) + Fill (point quente lateral), presos à câmera. */
const StudioLights: React.FC<{ frame: number }> = ({ frame }) => {
  const rim = ci(frame, [T.rim[0], T.rim[1]], [0, 5], Easing.inOut(Easing.cubic));
  const fill = ci(frame, [T.fill[0], T.fill[1]], [0, 1.6], Easing.inOut(Easing.cubic));
  const a = orbitAngle(frame);
  const rimPos = useMemo(() => new THREE.Vector3(), []);
  rimPos.set(-Math.sin(a) * 700 + Math.cos(a) * 180, 320, -Math.cos(a) * 700 - Math.sin(a) * 180);
  const fillPos: [number, number, number] = [Math.sin(a + 1.25) * 650, 60, Math.cos(a + 1.25) * 650];
  return (
    <>
      <ambientLight intensity={0.05} />
      <directionalLight position={rimPos} intensity={rim} color="#ffffff" />
      <pointLight position={fillPos} intensity={fill} color="#FFB37A" decay={0} />
    </>
  );
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const wireDraw = ci(frame, [T.wire, T.wire + 100], [0, 1], Easing.out(Easing.sin));
  const wireIn = ci(frame, [T.wire, T.wire + 40], [0, 1], Easing.out(Easing.sin));
  const swap = ci(frame, [T.solid[0], T.solid[1]], [0, 1], Easing.inOut(Easing.cubic));
  const inflate = ci(frame, [T.inflate, T.end], [1, 40], Easing.in(Easing.exp));
  return (
    <>
      <StudioEnvironment intensity={0.18} />
      <StudioLights frame={frame} />
      <Rig frame={frame} />
      <group scale={SCULPT_SCALE * inflate} rotation={[0.25, 0, 0]}>
        <Sculpture wireDraw={wireDraw} wireOpacity={wireIn * (1 - swap)} solidOpacity={swap} />
      </group>
      <Dust frame={frame} seed="c3-dust" count={220} spread={1800} size={4} opacity={0.35} />
    </>
  );
};

// ── BACKGROUND — névoa noise + focos de luz piscando ─────────────────────
const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const FOCI = [
  { x: 20, y: 30, r: 520, seed: 'f1' },
  { x: 82, y: 58, r: 620, seed: 'f2' },
  { x: 40, y: 86, r: 480, seed: 'f3' },
];

const Atmosphere: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {FOCI.map((f, i) => {
      const flicker = 0.5 + 0.35 * Math.sin(frame * 0.05 + i * 2.1) + 0.15 * (random(`${f.seed}-${Math.floor(frame / 3)}`) - 0.5);
      return (
        <div
          key={f.seed}
          style={{
            position: 'absolute',
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.r,
            height: f.r,
            marginLeft: -f.r / 2,
            marginTop: -f.r / 2,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.10), transparent 65%)',
            opacity: flicker,
          }}
        />
      );
    })}
    <AbsoluteFill
      style={{
        backgroundImage: NOISE,
        backgroundSize: '1024px 1024px',
        opacity: 0.05,
        transform: `translateY(${ci(frame, [0, T.end], [0, -100])}px)`,
        mixBlendMode: 'screen',
      }}
    />
  </>
);

// ── TIPOGRAFIA — overlay flat flutuando livre na lente ───────────────────
const TitleLine: React.FC<{ text: string; start: number; frame: number; style: React.CSSProperties }> = ({
  text,
  start,
  frame,
  style,
}) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.26em', ...style }}>
    {text.split(' ').map((word, i) => {
      const s = start + i * 3;
      const p = ci(frame, [s, s + 24], [0, 1], Easing.out(Easing.cubic));
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            opacity: p,
            transform: `scale(${interpolate(p, [0, 1], [1.1, 1])})`,
            filter: p < 0.999 ? `blur(${20 * (1 - p)}px)` : undefined,
          }}
        >
          {word}
        </span>
      );
    })}
  </div>
);

const STAGES = ['Wireframe', 'Textura', 'Luz'] as const;

const Hud: React.FC<{ frame: number }> = ({ frame }) => {
  const enter = ci(frame, [T.hud, T.hud + 22], [0, 1], Easing.out(Easing.cubic));
  const stage = frame >= T.rim[0] ? 2 : frame >= T.solid[0] ? 1 : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        right: 48,
        bottom: 110,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 50}px)`,
      }}
    >
      <AppBadge app="ae" variant="glass" size={56} kicker="Feito no" />
      <div style={{ display: 'flex', gap: 10 }}>
        {STAGES.map((label, i) => {
          const active = i === stage;
          return (
            <div
              key={label}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: active ? P.void : 'rgba(255,255,255,0.5)',
                backgroundColor: active ? P.wire : 'rgba(255,255,255,0.05)',
                border: `1px solid ${active ? P.wire : 'rgba(255,255,255,0.14)'}`,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CineC: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const etapa = ci(frame, [T.etapa, T.etapa + 24], [0, 1], Easing.inOut(Easing.cubic));
  const textExit = ci(frame, [T.textExit, T.textExit + 18], [0, 1], Easing.in(Easing.exp));
  const textExitStyle: React.CSSProperties = {
    opacity: 1 - textExit,
    filter: textExit > 0.01 ? `blur(${25 * textExit}px)` : undefined,
  };
  const blockout = ci(frame, [586, T.end], [0, 1], Easing.in(Easing.cubic));
  const float = Math.sin(frame * 0.03) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: P.void, overflow: 'hidden', fontFamily: FONT }}>
      <Atmosphere frame={frame} />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 45, near: 1, far: 8000, position: [0, 150, ORBIT_RADIUS] }}
        gl={{ antialias: true }}
      >
        <World />
      </ThreeCanvas>

      <div style={{ position: 'absolute', top: 190, left: 40, right: 40, transform: `translateY(${float}px)`, ...textExitStyle }}>
        <div
          style={{
            textAlign: 'center',
            fontSize: 48,
            fontWeight: 300,
            letterSpacing: 4,
            color: P.gray,
            opacity: etapa,
            filter: etapa < 0.999 ? `blur(${20 * (1 - etapa)}px)` : undefined,
            marginBottom: 14,
          }}
        >
          Etapa 2:
        </div>
        <TitleLine text="A Profundidade e" start={T.title} frame={frame} style={{ fontSize: 80, fontWeight: 800, letterSpacing: -2, color: '#FFFFFF', lineHeight: 1.08 }} />
        <TitleLine
          text="o Impacto do 3D"
          start={T.title + T.titleStagger}
          frame={frame}
          style={{ fontSize: 80, fontWeight: 800, letterSpacing: -2, color: '#FFFFFF', lineHeight: 1.08 }}
        />
      </div>

      <div style={textExitStyle}>
        <Hud frame={frame} />
      </div>

      {/* BLOCKOUT — a massa chumbo tapa a lente por completo */}
      <AbsoluteFill style={{ backgroundColor: P.lead, opacity: blockout }} />
    </AbsoluteFill>
  );
};
