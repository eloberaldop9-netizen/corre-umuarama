import React, { useLayoutEffect } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from 'remotion';
import * as THREE from 'three';
import { ci } from '../../lib/motion';
import { FONT, G, SPRINGS } from '../theme';
import { SpringWords } from '../SpringWords';
import { AppBadge } from '../AppBadge';
import { Dust, knotCurvePoint, MetalKnot, StudioEnvironment, StudioLights } from '../three/Studio';

// ─────────────────────────────────────────────────────────────────────────
// CENA 3 — A Profundidade do 3D (frames 743–1350, local 0–607)
// Take contínuo: wireframe verde → scanner → metal PBR, com órbita 180° +
// dolly in. Saída: MACRO CRASH — a câmera atravessa a superfície metálica.
// ─────────────────────────────────────────────────────────────────────────

const T = {
  scanStart: 150,
  scanEnd: 260,
  textIn: 25,
  textExit: 550,
  crash: 570,
  end: 600,
} as const;

const LOOK_AT = new THREE.Vector3(0, 110, 0); // objeto fica um pouco abaixo do centro
// Ponto da curva mais voltado para -Z (onde a câmera está após 180°).
const CRASH_POINT = knotCurvePoint(Math.PI);
const CRASH_LOOK = CRASH_POINT.clone().add(new THREE.Vector3(0, 0, 220));

const CameraRig: React.FC<{ frame: number }> = ({ frame }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useLayoutEffect(() => {
    const orbit = ci(frame, [0, T.end], [0, Math.PI], Easing.inOut(Easing.cubic));
    const dist = ci(frame, [0, T.end], [1000, 600], Easing.inOut(Easing.cubic));
    const height = ci(frame, [0, T.end], [220, 70], Easing.inOut(Easing.cubic));
    const crash = ci(frame, [T.crash, T.end], [0, 1], Easing.in(Easing.cubic));

    const orbitPos = new THREE.Vector3(Math.sin(orbit) * dist, height, Math.cos(orbit) * dist);
    camera.position.copy(orbitPos.lerp(CRASH_POINT, crash));
    camera.lookAt(LOOK_AT.clone().lerp(CRASH_LOOK, crash));
    camera.updateProjectionMatrix();
  }, [camera, frame]);

  return null;
};

const ScanRing: React.FC<{ y: number; opacity: number }> = ({ y, opacity }) =>
  opacity <= 0 ? null : (
    <group position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[300, 96]} />
        <meshBasicMaterial
          color={G.emerald}
          transparent
          opacity={0.07 * opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[296, 303, 128]} />
        <meshBasicMaterial
          color={G.emerald}
          transparent
          opacity={0.9 * opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );

const World: React.FC = () => {
  const frame = useCurrentFrame();

  const appear = ci(frame, [0, 45], [0, 1], Easing.out(Easing.cubic));
  const wireFade = ci(frame, [0, 20], [0, 1]);
  const scanY = ci(frame, [T.scanStart, T.scanEnd], [270, -270], Easing.inOut(Easing.cubic));
  const scanVisible =
    ci(frame, [T.scanStart - 6, T.scanStart + 4], [0, 1]) * ci(frame, [T.scanEnd - 6, T.scanEnd + 4], [1, 0]);

  return (
    <>
      <StudioEnvironment intensity={0.35} />
      <StudioLights />
      <CameraRig frame={frame} />

      <group scale={Math.max(0.0001, appear)}>
        <MetalKnot scanY={scanY} wireOpacity={wireFade} />
      </group>
      <ScanRing y={scanY} opacity={scanVisible} />

      {/* Poeira: fina ao fundo + bokeh grande perto da lente */}
      <Dust frame={frame} seed="dust-far" count={260} spread={1800} size={5} opacity={0.5} />
      <Dust frame={frame} seed="dust-near" count={40} spread={1300} size={34} opacity={0.12} />
    </>
  );
};

/** Título verde com extrusão falsa (camadas de text-shadow) + glow. */
const EXTRUDE_SHADOW = [
  ...Array.from({ length: 7 }, (_, i) => `${i + 1}px ${i + 1}px 0 ${i < 3 ? '#0b7a56' : '#064e3b'}`),
  '0 0 34px rgba(16,185,129,0.45)',
].join(', ');

const TextOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const float = Math.sin(frame * 0.04) * 8;
  const exit = { start: T.textExit, x: -1000, scale: 0.8, blur: 20, dur: 20 };
  return (
    <AbsoluteFill
      style={{ perspective: '1000px', perspectiveOrigin: '50% 300px', fontFamily: FONT, pointerEvents: 'none' }}
    >
      <div
        style={{
          position: 'absolute',
          top: 170,
          left: 40,
          right: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          transformStyle: 'preserve-3d',
          transform: `translateY(${float}px)`,
        }}
      >
        <div style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-200px)' }}>
          <SpringWords
            text="Etapa 2:"
            start={T.textIn}
            config={SPRINGS.emerge}
            from={{ z: -1300, blur: 50 }}
            exit={exit}
            style={{ fontSize: 40, fontWeight: 300, letterSpacing: 4, color: G.white }}
          />
        </div>
        <div style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-100px)' }}>
          {['A PROFUNDIDADE', 'DO 3D'].map((line, i) => (
            <SpringWords
              key={line}
              text={line}
              start={T.textIn + 6 + i * 8}
              config={SPRINGS.emerge}
              from={{ z: -1400, blur: 50 }}
              exit={{ ...exit, start: T.textExit + 4 + i * 4 }}
              style={{ fontSize: 70, fontWeight: 800, letterSpacing: -2, color: G.emerald, lineHeight: 1.1 }}
              wordStyle={{ textShadow: EXTRUDE_SHADOW }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};


/** Gizmo de eixos (X vermelho, Y verde, Z azul) que gira com a órbita. */
const AxisGizmo: React.FC<{ orbit: number }> = ({ orbit }) => {
  const axes = [
    { label: 'X', color: '#F43F5E', dir: [Math.cos(orbit), 0.0, Math.sin(orbit)] },
    { label: 'Y', color: '#84CC16', dir: [0, 1, 0] },
    { label: 'Z', color: '#3B82F6', dir: [-Math.sin(orbit), 0, Math.cos(orbit)] },
  ];
  const R = 46;
  return (
    <svg width={140} height={140} viewBox="-70 -70 140 140">
      <circle r={66} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" />
      {axes.map((a) => {
        const x = a.dir[0] * R;
        const y = -(a.dir[1] * R) + a.dir[2] * R * 0.35;
        return (
          <g key={a.label}>
            <line x1={0} y1={0} x2={x} y2={y} stroke={a.color} strokeWidth={4} strokeLinecap="round" />
            <circle cx={x} cy={y} r={13} fill={a.color} />
            <text x={x} y={y + 5} fontSize={14} fontWeight={800} textAnchor="middle" fill="#0A0A0C" fontFamily={FONT}>
              {a.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/** HUD de viewport do Blender: modo de shading muda quando o scanner passa. */
const ViewportHud: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const enter = ci(frame, [50, 72], [0, 1], Easing.out(Easing.cubic));
  const exit = ci(frame, [T.textExit + 6, T.textExit + 24], [0, 1], Easing.in(Easing.exp));
  const rendered = frame >= (T.scanStart + T.scanEnd) / 2;
  const samples = Math.round(ci(frame, [T.scanEnd - 20, T.scanEnd + 90], [1, 128]));
  const orbit = ci(frame, [0, T.end], [0, Math.PI], Easing.inOut(Easing.cubic));
  const style = (dir: 1 | -1): React.CSSProperties => ({
    opacity: enter * ci(exit, [0, 0.7], [1, 0]),
    transform: `translateY(${(1 - enter) * 60}px) translateX(${dir * 600 * exit}px)`,
    filter: exit > 0.01 ? `blur(${16 * exit}px)` : undefined,
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 48, bottom: 96, display: 'flex', flexDirection: 'column', gap: 18, ...style(-1) }}>
        <AppBadge app="blender" variant="glass" size={60} kicker="Criado no" />
        <div
          style={{
            display: 'flex',
            gap: 10,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          {['Wireframe', 'Rendered'].map((mode) => {
            const active = (mode === 'Rendered') === rendered;
            return (
              <div
                key={mode}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: `1px solid ${active ? G.emerald : 'rgba(255,255,255,0.15)'}`,
                  backgroundColor: active ? 'rgba(16,185,129,0.16)' : 'rgba(255,255,255,0.04)',
                  color: active ? G.emerald : 'rgba(255,255,255,0.5)',
                }}
              >
                {mode}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: 1.5, color: 'rgba(255,255,255,0.5)' }}>
          {rendered ? `Cycles · ${samples}/128 samples · Metal PBR` : 'Malha · 14.336 faces'}
        </div>
      </div>
      <div style={{ position: 'absolute', right: 48, bottom: 96, ...style(1) }}>
        <AxisGizmo orbit={orbit} />
      </div>
    </AbsoluteFill>
  );
};

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const blackout = ci(frame, [588, 600], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: G.deep }}>
      <AbsoluteFill
        style={{ background: 'radial-gradient(circle at 50% 58%, rgba(16,185,129,0.08), transparent 55%)' }}
      />
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 50, near: 0.5, far: 6000, position: [0, 220, 1000] }}
        gl={{ antialias: true }}
      >
        <World />
      </ThreeCanvas>
      <TextOverlay frame={frame} />
      <ViewportHud frame={frame} fps={fps} />
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: blackout }} />
    </AbsoluteFill>
  );
};
