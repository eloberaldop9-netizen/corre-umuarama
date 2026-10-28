import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ci } from '../../lib/motion';
import { FONT, G, SPRINGS } from '../theme';
import { SpringWords } from '../SpringWords';

// ─────────────────────────────────────────────────────────────────────────
// CENA 1 — O Nascimento do Volume (0–300)
// Círculo 2D desenhado → extrusão em túnel wireframe → Z-push → FLASH + WIPE.
// Câmera simulada em CSS 3D: FOV vira `perspective`, posição Z vira translateZ.
// ─────────────────────────────────────────────────────────────────────────

const H = 1920;
const RING_R = 200; // círculo de 400px
const CIRC = 2 * Math.PI * RING_R; // 1256.6 → strokeDashoffset 1256 → 0
const RING_COUNT = 24;
const RAIL_COUNT = 12;
const TUNNEL_DEPTH = 800;

/** FOV vertical (graus) → distância de perspectiva CSS equivalente. */
const perspectiveFromFov = (fov: number) => H / 2 / Math.tan((fov * Math.PI) / 360);
const P0 = perspectiveFromFov(70);
/** Câmera a 1000 no frame 0 ⇒ o círculo aparece em 1:1 (400px reais). */
const CAM_UNIT = P0 / 1000;

const Ring: React.FC<{ dash?: string; dashOffset?: number; opacity: number; glow?: boolean }> = ({
  dash,
  dashOffset = 0,
  opacity,
  glow,
}) => (
  <svg
    width={RING_R * 2 + 8}
    height={RING_R * 2 + 8}
    viewBox={`${-RING_R - 4} ${-RING_R - 4} ${RING_R * 2 + 8} ${RING_R * 2 + 8}`}
    style={{
      position: 'absolute',
      left: -RING_R - 4,
      top: -RING_R - 4,
      opacity,
      overflow: 'visible',
      filter: glow ? 'drop-shadow(0 0 14px rgba(79,70,229,0.85))' : undefined,
    }}
  >
    <circle
      r={RING_R}
      fill="none"
      stroke={G.indigo}
      strokeWidth={4}
      strokeDasharray={dash ?? `${CIRC}`}
      strokeDashoffset={dashOffset}
      strokeLinecap="round"
      transform="rotate(-90)"
    />
  </svg>
);

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── CÂMERA ────────────────────────────────────────────────────────────
  const tilt = ci(frame, [40, 120], [0, 1], Easing.out(Easing.cubic));
  const dive = ci(frame, [120, 280], [0, 1], Easing.inOut(Easing.cubic));
  const pierce = ci(frame, [275, 292], [0, 1], Easing.in(Easing.exp));

  // RotX 0→60 / RotY 0→-30 revelam o tubo; durante o mergulho a câmera se
  // realinha ao eixo do túnel (60→12 / -30→-6) para "entrar" nele.
  const rotX = 60 * tilt - 48 * dive;
  const rotY = -30 * tilt + 24 * dive;
  const fov = interpolate(dive, [0, 1], [70, 40]);
  const perspective = perspectiveFromFov(fov);
  const camZ = interpolate(dive, [0, 1], [1000, 200]) - 1100 * pierce; // fura a parede
  const camDist = camZ * CAM_UNIT;
  const worldZ = perspective - camDist;

  // ── TÚNEL ─────────────────────────────────────────────────────────────
  const draw = ci(frame, [15, 40], [CIRC, 0], Easing.inOut(Easing.cubic));
  const extrude = frame < 40 ? 0 : spring({ frame: frame - 40, fps, config: SPRINGS.extrude });
  const clonesIn = ci(frame, [40, 50], [0, 1]);
  const spin = Math.max(0, frame - 40) * 0.5; // 0.5°/frame

  const nearFade = (depth: number) => ci(camDist + depth, [30, 200], [0, 1]);

  // ── TEXTO ─────────────────────────────────────────────────────────────
  const textDrift = 80 * dive; // parallax Z sutil do texto acompanhando o push
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
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.15), transparent 60%)',
        }}
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
          <div style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `rotateZ(${spin}deg)` }}>
            {/* Trilhos longitudinais do wireframe cilíndrico */}
            {Array.from({ length: RAIL_COUNT }).map((_, i) => (
              <div
                key={`rail-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: -1,
                  width: TUNNEL_DEPTH * extrude,
                  height: 2,
                  transformOrigin: '0 50%',
                  transform: `rotateZ(${(360 / RAIL_COUNT) * i}deg) translateX(${RING_R}px) rotateY(90deg)`,
                  background: 'linear-gradient(90deg, rgba(79,70,229,0.75), rgba(79,70,229,0))',
                  opacity: 0.55 * clonesIn * nearFade(0),
                }}
              />
            ))}

            {/* Anéis de extrusão — do fundo para frente */}
            {Array.from({ length: RING_COUNT })
              .map((_, i) => RING_COUNT - 1 - i)
              .map((i) => {
                const depth = TUNNEL_DEPTH * extrude * (i / (RING_COUNT - 1));
                const isBase = i === 0;
                const opacity = isBase
                  ? nearFade(0)
                  : clonesIn * (1 - 0.78 * (i / (RING_COUNT - 1))) * nearFade(depth);
                return (
                  <div
                    key={`ring-${i}`}
                    style={{ position: 'absolute', transformStyle: 'preserve-3d', transform: `translateZ(${-depth}px)` }}
                  >
                    <Ring
                      opacity={opacity}
                      glow={isBase}
                      dash={isBase ? undefined : i % 3 === 0 ? '6 22' : undefined}
                      dashOffset={isBase ? draw : 0}
                    />
                  </div>
                );
              })}
          </div>
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
      <AbsoluteFill
        style={{
          backgroundColor: G.offWhite,
          clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)`,
        }}
      />
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
