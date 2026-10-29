import React, { useLayoutEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { ci } from '../../lib/motion';
import { FONT, P, SPRINGS } from '../theme';
import { SpringWords } from '../SpringWords';
import { MorphShape, StudioEnvironment } from '../three/Studio';

// ─────────────────────────────────────────────────────────────────────────
// CENA 1 — O Nascimento da Massa (0–300)
// Prancheta off-white. Um quadrado azul chapado "infla" (scale punch 1→1.3→1)
// e vira esfera cromada com sombra de oclusão. Texto abraça o objeto.
// Saída: Z-DIVE MASSIVO — a esfera engole a lente e estoura no azul da C2.
// ─────────────────────────────────────────────────────────────────────────

const H = 1920;
const FOV = 60;
const TAN = Math.tan((FOV * Math.PI) / 360);
const pxPerUnit = (dist: number) => H / (2 * dist * TAN);
/** Lado do quadrado (unidades de mundo) para medir 400px com a câmera a 800. */
const SIZE = 400 / pxPerUnit(800);

const T = {
  bgIn: 0,
  morph: 30,
  shadow: 35,
  text: [45, 48, 51] as const,
  badge: 56,
  hold: 90,
  textExit: 270,
  dive: 275,
  end: 300,
} as const;

/** Distância da câmera ao objeto (z: -800 → -450, e o Z-push da saída). */
const cameraDistance = (frame: number) => {
  const push = ci(frame, [0, 90], [800, 450], Easing.out(Easing.cubic));
  const dive = ci(frame, [T.textExit, T.end], [0, 1], Easing.in(Easing.exp));
  return push - 330 * dive;
};

const floatY = (frame: number) => Math.sin(frame * 0.015) * ci(frame, [T.hold - 30, T.hold], [0, 1]);

const Camera: React.FC<{ frame: number }> = ({ frame }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.fov = FOV;
    camera.position.set(0, 0, cameraDistance(frame));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, frame]);
  return null;
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame < T.morph ? 0 : spring({ frame: frame - T.morph, fps, config: SPRINGS.morph });
  const punch = interpolate(s, [0, 0.5, 1], [1, 1.3, 1], { extrapolateLeft: 'clamp' });
  const dive = ci(frame, [T.dive, T.end], [1, 30], Easing.in(Easing.exp));
  // ±12px de flutuação na distância final da câmera (450).
  const y = (12 / pxPerUnit(450)) * floatY(frame);
  return (
    <>
      {/* Luzes "rodando fora de quadro": o HDRI gira em Y */}
      <StudioEnvironment intensity={1.1} rotationY={frame * 0.012} />
      <pointLight position={[260, 220, 300]} intensity={1.4} decay={0} />
      <pointLight position={[-300, -120, 200]} intensity={0.5} decay={0} color="#c7d2fe" />
      <Camera frame={frame} />
      <MorphShape morph={s} size={SIZE} y={y} scale={punch * dive} />
    </>
  );
};

/** Anéis concêntricos vetoriais pulsando a cada 3s (90f). */
const PulseRings: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
    {[0, 30, 60].map((offset) => {
      const t = ((frame + offset) % 90) / 90;
      return (
        <circle
          key={offset}
          cx={540}
          cy={960}
          r={260 + t * 520}
          fill="none"
          stroke="#000"
          strokeWidth={1.5}
          opacity={0.07 * (1 - t)}
        />
      );
    })}
  </svg>
);

export const CineA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const bgIn = ci(frame, [T.bgIn, 20], [0, 1], Easing.out(Easing.cubic));

  // ── Sombra de oclusão (DOM, atrás do canvas transparente) ─────────────
  const s = frame < T.morph ? 0 : spring({ frame: frame - T.morph, fps, config: SPRINGS.morph });
  const punch = interpolate(s, [0, 0.5, 1], [1, 1.3, 1], { extrapolateLeft: 'clamp' });
  const dist = cameraDistance(frame);
  const diameter = SIZE * pxPerUnit(dist) * punch;
  const fl = floatY(frame); // -1..1 (1 = esfera em cima)
  const shadowIn = ci(frame, [T.shadow, T.shadow + 30], [0, 1], Easing.out(Easing.exp));
  const shadowAlpha = 0.3 * shadowIn * interpolate(fl, [-1, 1], [1, 0.667]) * ci(frame, [T.dive, T.dive + 8], [1, 0]);
  const shadowScale = interpolate(fl, [-1, 1], [1, 0.9]);
  const sphereOffsetPx = -12 * fl;

  // ── Texto: saída quádrupla (translateY -200, blur, opacity, scale) ────
  const exitText = { start: T.textExit, y: -200, blur: 20, scale: 0.95, dur: 18, stagger: 0 };
  const lineBase: React.CSSProperties = { transformStyle: 'preserve-3d' };

  return (
    <AbsoluteFill style={{ backgroundColor: P.paper, overflow: 'hidden', fontFamily: FONT }}>
      {/* BACKGROUND VIVO — grid 50px rolando -1px/frame + anéis pulsando */}
      <AbsoluteFill style={{ opacity: bgIn }}>
        <AbsoluteFill
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            backgroundPosition: `15px ${-frame}px`,
          }}
        />
        <PulseRings frame={frame} />
      </AbsoluteFill>

      {/* SOMBRA 3D — 0 80px 120px rgba(0,0,0,0.3) */}
      <div
        style={{
          position: 'absolute',
          left: 540 - diameter / 2,
          top: 960 - diameter / 2 + sphereOffsetPx,
          width: diameter,
          height: diameter,
          borderRadius: '50%',
          backgroundColor: `rgba(0,0,0,${shadowAlpha})`,
          filter: 'blur(60px)',
          transform: `translateY(${80 * shadowIn}px) scale(${shadowScale})`,
        }}
      />

      {/* O MORFO — quadrado 2D → esfera cromada */}
      <ThreeCanvas
        width={width}
        height={height}
        flat
        camera={{ fov: FOV, near: 1, far: 5000, position: [0, 0, 800] }}
        gl={{ antialias: true }}
      >
        <World />
      </ThreeCanvas>

      {/* TIPOGRAFIA — abraça o objeto (z-depth por perspectiva) */}
      <AbsoluteFill style={{ perspective: '1200px', perspectiveOrigin: '50% 50%', color: P.ink }}>
        <div style={{ position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <BadgeTop frame={frame} fps={fps} />
        </div>
        <div style={{ position: 'absolute', top: 400, left: 40, right: 40, ...lineBase, transform: 'translateZ(100px)' }}>
          <SpringWords
            text="Como o 2D e o 3D"
            start={T.text[0]}
            stagger={3}
            config={SPRINGS.text}
            from={{ y: 60, blur: 14 }}
            exit={exitText}
            style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}
          />
        </div>
        <div style={{ position: 'absolute', top: 1350, left: 40, right: 40, ...lineBase, transform: 'translateZ(50px)' }}>
          <SpringWords
            text="transformam a"
            start={T.text[1]}
            stagger={3}
            config={SPRINGS.text}
            from={{ y: 60, blur: 14 }}
            exit={{ ...exitText, start: T.textExit + 1 }}
            style={{ fontSize: 64, fontWeight: 300, color: P.gray }}
          />
        </div>
        <div style={{ position: 'absolute', top: 1450, left: 40, right: 40, ...lineBase, transform: 'translateZ(120px)' }}>
          <SpringWords
            text="Comunicação Visual?"
            start={T.text[2]}
            stagger={3}
            config={SPRINGS.text}
            from={{ y: 60, blur: 14 }}
            exit={{ ...exitText, start: T.textExit + 2 }}
            style={{ fontSize: 80, fontWeight: 900, letterSpacing: -3, color: P.blueprint, lineHeight: 1.05 }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Badge topo "Gráficos 2D vs 3D!" — 48px 500, tracking +4. */
const BadgeTop: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = frame < T.badge ? 0 : spring({ frame: frame - T.badge, fps, config: SPRINGS.badge });
  const exit = ci(frame, [T.textExit, T.textExit + 18], [0, 1], Easing.in(Easing.exp));
  return (
    <div
      style={{
        padding: '14px 34px',
        border: `3px solid ${P.ink}`,
        borderRadius: 999,
        fontSize: 48,
        fontWeight: 500,
        letterSpacing: 4,
        color: P.ink,
        backgroundColor: P.paper,
        opacity: ci(frame - T.badge, [0, 8], [0, 1]) * ci(exit, [0.3, 1], [1, 0]),
        transform: `translateY(${-200 * exit}px) scale(${interpolate(s, [0, 1], [0.6, 1]) * (1 - 0.05 * exit)})`,
        filter: exit > 0.01 ? `blur(${20 * exit}px)` : undefined,
      }}
    >
      Gráficos 2D vs 3D!
    </div>
  );
};
