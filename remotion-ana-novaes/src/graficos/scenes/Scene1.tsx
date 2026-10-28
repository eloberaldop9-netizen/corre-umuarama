import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../../lib/motion';
import { FONT, G, SPRINGS } from '../theme';
import { SpringWords } from '../SpringWords';

// ─────────────────────────────────────────────────────────────────────────
// CENA 1 — O Nascimento do Volume (0–300)
// Formas planas (círculo, quadrado, triângulo) são desenhadas em vetor e
// ganham volume: extrusão em wireframe (cilindro, cubo, prisma). Z-push para
// dentro do túnel → FLASH + WIPE. Câmera em CSS 3D: FOV vira `perspective`.
// ─────────────────────────────────────────────────────────────────────────

const H = 1920;
const RING_R = 200; // círculo herói de 400px (perímetro 1256)

/** FOV vertical (graus) → distância de perspectiva CSS equivalente. */
const perspectiveFromFov = (fov: number) => H / 2 / Math.tan((fov * Math.PI) / 360);
const P0 = perspectiveFromFov(70);
/** Câmera a 1000 no frame 0 ⇒ as formas aparecem em 1:1 (círculo de 400px). */
const CAM_UNIT = P0 / 1000;

type ShapeKind = 'circle' | 'square' | 'triangle';

interface ShapeDef {
  kind: ShapeKind;
  size: number; // diâmetro / lado
  x: number;
  y: number;
  depth: number;
  clones: number;
  draw: [number, number];
  extrudeAt: number;
  spinFactor: number;
  stroke: number;
}

const SHAPES: ShapeDef[] = [
  { kind: 'square', size: 170, x: -290, y: -560, depth: 340, clones: 10, draw: [18, 42], extrudeAt: 44, spinFactor: -0.6, stroke: 3 },
  { kind: 'triangle', size: 210, x: 290, y: 560, depth: 340, clones: 10, draw: [21, 45], extrudeAt: 48, spinFactor: 0.6, stroke: 3 },
  { kind: 'circle', size: RING_R * 2, x: 0, y: 0, depth: 800, clones: 24, draw: [15, 40], extrudeAt: 40, spinFactor: 1, stroke: 4 },
];

const TRI_H = Math.sqrt(3) / 2;
const vertices = (s: ShapeDef): Array<[number, number]> => {
  const r = s.size / 2;
  if (s.kind === 'square') return [[-r, -r], [r, -r], [r, r], [-r, r]];
  if (s.kind === 'triangle') {
    const h = s.size * TRI_H;
    return [[0, -h * (2 / 3)], [r, h / 3], [-r, h / 3]];
  }
  return Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
  });
};

/** Contorno vetorial; `pathLength=1` normaliza o desenho do stroke. */
const Outline: React.FC<{ shape: ShapeDef; draw: number; dash?: boolean; opacity: number; glow?: boolean }> = ({
  shape,
  draw,
  dash,
  opacity,
  glow,
}) => {
  const pad = 8;
  const half = shape.size / 2 + pad;
  const common = {
    fill: 'none',
    stroke: G.indigo,
    strokeWidth: shape.stroke,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
    pathLength: 1,
    strokeDasharray: dash ? '0.012 0.03' : '1',
    strokeDashoffset: dash ? 0 : 1 - draw,
  };
  return (
    <svg
      width={half * 2}
      height={half * 2}
      viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
      style={{
        position: 'absolute',
        left: -half,
        top: -half,
        opacity,
        overflow: 'visible',
        filter: glow ? 'drop-shadow(0 0 14px rgba(79,70,229,0.85))' : undefined,
      }}
    >
      {shape.kind === 'circle' ? (
        <circle r={shape.size / 2} transform="rotate(-90)" {...common} />
      ) : (
        <polygon points={vertices(shape).map((v) => v.join(',')).join(' ')} {...common} />
      )}
    </svg>
  );
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── CÂMERA ────────────────────────────────────────────────────────────
  const tilt = ci(frame, [40, 120], [0, 1], Easing.out(Easing.cubic));
  const dive = ci(frame, [120, 280], [0, 1], Easing.inOut(Easing.cubic));
  const pierce = ci(frame, [275, 292], [0, 1], Easing.in(Easing.exp));

  // RotX 0→60 / RotY 0→-30 revelam os volumes; durante o mergulho a câmera
  // se realinha ao eixo do túnel (60→12 / -30→-6) para "entrar" nele.
  const rotX = 60 * tilt - 48 * dive;
  const rotY = -30 * tilt + 24 * dive;
  const fov = interpolate(dive, [0, 1], [70, 40]);
  const perspective = perspectiveFromFov(fov);
  const camDist = (interpolate(dive, [0, 1], [1000, 200]) - 1100 * pierce) * CAM_UNIT;
  const worldZ = perspective - camDist;

  const spin = Math.max(0, frame - 40) * 0.5; // 0.5°/frame
  const nearFade = (depth: number) => ci(camDist + depth, [30, 200], [0, 1]);

  // ── TEXTO ─────────────────────────────────────────────────────────────
  const textDrift = 80 * dive;
  const glowA = 0.4 + 0.2 * Math.sin(frame * 0.05); // 0.2 ↔ 0.6

  // ── FLASH + WIPE ──────────────────────────────────────────────────────
  const flash = interpolate(frame, [280, 285, 290], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wipe = ci(frame, [282, 292], [0, 1], Easing.inOut(Easing.cubic));

  const gridOpacity = ci(frame, [0, 30], [0, 0.05], Easing.out(Easing.cubic));
  const gridScale = 1 + 0.35 * dive + 0.8 * pierce;

  return (
    <AbsoluteFill style={{ backgroundColor: G.void, overflow: 'hidden' }}>
      {/* BACKGROUND — base + radial indigo + grid com parallax Z */}
      <AbsoluteFill
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.15), transparent 60%)' }}
      />
      <AbsoluteFill
        style={{
          opacity: gridOpacity,
          transform: `scale(${gridScale})`,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          backgroundPosition: '50% 50%',
        }}
      />

      {/* MUNDO 3D — câmera */}
      <AbsoluteFill style={{ perspective: `${perspective}px`, perspectiveOrigin: '50% 50%' }}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transformStyle: 'preserve-3d',
            transform: `translateZ(${worldZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {SHAPES.map((shape) => {
            const draw = ci(frame, shape.draw, [0, 1], Easing.inOut(Easing.cubic));
            const extrude =
              frame < shape.extrudeAt ? 0 : spring({ frame: frame - shape.extrudeAt, fps, config: SPRINGS.extrude });
            const clonesIn = ci(frame, [shape.extrudeAt, shape.extrudeAt + 10], [0, 1]);
            const isHero = shape.kind === 'circle';
            return (
              <div
                key={shape.kind}
                style={{
                  position: 'absolute',
                  transformStyle: 'preserve-3d',
                  transform: `translate(${shape.x}px, ${shape.y}px) rotateZ(${spin * shape.spinFactor}deg)`,
                }}
              >
                {/* Arestas longitudinais (trilhos do wireframe) */}
                {vertices(shape).map(([vx, vy], i) => (
                  <div
                    key={`rail-${i}`}
                    style={{
                      position: 'absolute',
                      left: vx,
                      top: vy - 1,
                      width: shape.depth * extrude,
                      height: 2,
                      transformOrigin: '0 50%',
                      transform: 'rotateY(90deg)',
                      background: 'linear-gradient(90deg, rgba(79,70,229,0.8), rgba(79,70,229,0))',
                      opacity: (isHero ? 0.55 : 0.75) * clonesIn * nearFade(0),
                    }}
                  />
                ))}

                {/* Clones de extrusão — do fundo para frente */}
                {Array.from({ length: shape.clones })
                  .map((_, i) => shape.clones - 1 - i)
                  .map((i) => {
                    const depth = shape.depth * extrude * (i / (shape.clones - 1));
                    const isBase = i === 0;
                    const opacity = isBase
                      ? nearFade(0)
                      : clonesIn * (1 - 0.78 * (i / (shape.clones - 1))) * nearFade(depth);
                    return (
                      <div
                        key={`clone-${i}`}
                        style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translateZ(${-depth}px)` }}
                      >
                        <Outline
                          shape={shape}
                          draw={isBase ? draw : 1}
                          opacity={opacity}
                          glow={isBase}
                          dash={!isBase && isHero && i % 3 === 0}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* TIPOGRAFIA — rasga o centro do túnel */}
      <AbsoluteFill
        style={{
          perspective: '1000px',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: FONT,
          color: G.white,
        }}
      >
        <div style={{ transformStyle: 'preserve-3d', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ transformStyle: 'preserve-3d', transform: `translateZ(${100 + textDrift}px)` }}>
            <SpringWords
              text="Gráficos"
              start={60}
              config={SPRINGS.text}
              from={{ y: 60, blur: 20 }}
              exit={{ start: 275, z: -500, scale: 0, blur: 40, dur: 14 }}
              style={{ fontSize: 50, fontWeight: 300, letterSpacing: 2 }}
            />
          </div>
          <div style={{ transformStyle: 'preserve-3d', transform: `translateZ(${150 + textDrift}px)` }}>
            <SpringWords
              text="2D vs 3D"
              start={70}
              ease={{ dur: 24, fn: Easing.out(Easing.back(1.5)) }}
              from={{ scale: 3, blur: 40 }}
              exit={{ start: 277, z: -500, scale: 0, blur: 40, dur: 14 }}
              style={{ fontSize: 120, fontWeight: 900, letterSpacing: -4, lineHeight: 1.05 }}
              wordStyle={{
                textShadow: `0 0 40px rgba(79,70,229,${glowA}), 0 0 90px rgba(79,70,229,${glowA * 0.7})`,
              }}
            />
          </div>
          <div style={{ transformStyle: 'preserve-3d', transform: `translateZ(${100 + textDrift}px)` }}>
            <SpringWords
              text="na Comunicação!"
              start={80}
              config={SPRINGS.text}
              from={{ y: -60, blur: 20 }}
              exit={{ start: 279, z: -500, scale: 0, blur: 40, dur: 14 }}
              style={{ fontSize: 50, fontWeight: 300, letterSpacing: 2 }}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* WIPE — guilhotina vertical revelando o off-white da Cena 2 */}
      <AbsoluteFill style={{ backgroundColor: G.offWhite, clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)` }} />
      {wipe > 0 && wipe < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: wipe * H - 4,
            height: 8,
            backgroundColor: G.indigo,
            boxShadow: '0 0 40px 10px rgba(79,70,229,0.7)',
          }}
        />
      ) : null}

      {/* FLASH — cega a retina */}
      <AbsoluteFill style={{ backgroundColor: G.white, opacity: flash }} />
    </AbsoluteFill>
  );
};
