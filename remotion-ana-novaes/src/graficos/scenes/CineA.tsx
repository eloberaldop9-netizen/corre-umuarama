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
// CENA 1 — O Nascimento da Massa (0–300 | from=0)
// Prancheta off-white. Um quadrado azul chapado "infla" (scale punch 1→1.3→1)
// e vira esfera cromada com sombra de oclusão. O texto abraça o objeto.
// Saída: Z-DIVE MASSIVO — a esfera engole a lente; em 293 o cromo estoura no
// azul chapado da Cena 2 (que fica por baixo desta cena durante o overlap).
//
// Espaço de câmera único (WebGL + DOM): a câmera olha para +Z a partir de
// z = -800. Toda "Z-depth" do roteiro é medida em direção à lente, ou seja,
// z_mundo = -zDepth. A tipografia DOM usa a mesma projeção (FOV 60), então a
// paralaxe entre texto e esfera é matematicamente a mesma do render 3D.
// ─────────────────────────────────────────────────────────────────────────

const H = 1920;
const FOV = 60;
const FOCAL = H / (2 * Math.tan((FOV * Math.PI) / 360)); // px por unidade a distância 1
const pxPerUnit = (dist: number) => FOCAL / dist;

const CAM_START = -800;
/** Lado do quadrado (unidades) para a face frontal medir 400px em z = -800. */
const SIZE = (400 * -CAM_START) / (FOCAL + 200);

const T = {
  bgIn: 0,
  morph: 30,
  shadow: 35,
  text: [45, 48, 51] as const,
  badge: 56,
  hold: 90,
  textExit: 270,
  dive: 275,
  pop: 293, // cromo → azul (início da Cena 2)
  end: 300,
} as const;

// ── Câmera: z -800 → -450 (0→90, out cubic) e Z-push -450 → +100 (270→300, in exp)
const cameraZ = (frame: number) =>
  ci(frame, [0, T.hold], [CAM_START, -450], Easing.out(Easing.cubic)) +
  ci(frame, [T.textExit, T.end], [0, 550], Easing.in(Easing.exp));

// ── Morfo: spring (damping 12, mass 1.5) a partir do frame 30
const morphSpring = (frame: number, fps: number) =>
  frame < T.morph ? 0 : spring({ frame: frame - T.morph, fps, config: SPRINGS.morph });

/**
 * Scale punch 1 → 1.3 → 1. A subida é meia senoide sobre o progresso do spring
 * (pico em s = 0.5, ~frame 35); o overshoot do próprio spring (s > 1) vira o
 * rebote de compressão, que assenta em ~frame 50.
 */
const punchScale = (s: number) => {
  const rise = Math.min(s, 1);
  const over = Math.max(s, 1) - 1;
  return 1 + 0.3 * Math.sin(Math.PI * rise) - 0.5 * over;
};

/** Flutuação gravitacional: Math.sin(frame × 0.015), entra suave antes do hold. */
const floatWave = (frame: number) => Math.sin(frame * 0.015) * ci(frame, [T.hold - 30, T.hold], [0, 1]);

// ── Saída da esfera: scale 1→30 e zPosition 0→+1000 (em direção à lente)
const diveScale = (frame: number) => ci(frame, [T.dive, T.pop], [1, 30], Easing.in(Easing.exp));
const diveZ = (frame: number) => ci(frame, [T.dive, T.pop], [0, 1000], Easing.in(Easing.exp));

/** Escala de projeção de um plano em zDepth, normalizada para o hold (câmera em -450). */
const depthScale = (frame: number, zDepth: number) => {
  const dist = Math.max(-cameraZ(frame) - zDepth, 40);
  return (450 - zDepth) / dist;
};

const Camera: React.FC<{ frame: number }> = ({ frame }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.fov = FOV;
    camera.position.set(0, 0, cameraZ(frame));
    // Olha sempre para +Z — mesmo quando o Z-push atravessa a origem.
    camera.rotation.set(0, Math.PI, 0);
    camera.updateProjectionMatrix();
  }, [camera, frame]);
  return null;
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = morphSpring(frame, fps);
  const y = (12 / pxPerUnit(450)) * floatWave(frame);
  // 293→294: o brilho morre em corte seco — em 294 a superfície já é azul chapado.
  const flatten = ci(frame, [T.pop, T.pop + 1], [0, 1]);
  // Luz e HDRI só existem no estado cromado: o 2D é emissivo puro (#1D4ED8 exato).
  const chrome = Math.min(s, 1) * (1 - flatten);
  return (
    <>
      {/* "Luzes rodando fora de quadro": o HDRI de estúdio gira em Y */}
      <StudioEnvironment intensity={1.1} rotationY={frame * 0.012} />
      <pointLight position={[-260, 220, -300]} intensity={1.4 * chrome} decay={0} />
      <pointLight position={[300, -120, -200]} intensity={0.5 * chrome} decay={0} color="#c7d2fe" />
      <Camera frame={frame} />
      <MorphShape
        morph={Math.min(s, 1)}
        flatten={flatten}
        size={SIZE}
        y={y}
        z={-diveZ(frame)}
        scale={punchScale(s) * diveScale(frame)}
      />
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

/** Grid SVG 50×50, stroke #000 @ 0.04, rolando -1px/frame. */
const ScrollingGrid: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
    <defs>
      <pattern
        id="c1-grid"
        width={50}
        height={50}
        patternUnits="userSpaceOnUse"
        patternTransform={`translate(15 ${-(frame % 50)})`}
      >
        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#000" strokeOpacity={0.04} strokeWidth={1} />
      </pattern>
    </defs>
    <rect width={1080} height={1920} fill="url(#c1-grid)" />
  </svg>
);

/** Plano de texto na profundidade zDepth — escala em torno do centro óptico. */
const DepthLayer: React.FC<{ frame: number; zDepth: number; children: React.ReactNode }> = ({
  frame,
  zDepth,
  children,
}) => (
  <AbsoluteFill style={{ transformOrigin: '540px 960px', transform: `scale(${depthScale(frame, zDepth)})` }}>
    {children}
  </AbsoluteFill>
);

const LINE_ENTRY = { from: { y: 60, blur: 14 }, config: SPRINGS.text, stagger: 2 } as const;

export const CineA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const bgIn = ci(frame, [T.bgIn, 20], [0, 1], Easing.out(Easing.cubic));

  // ── Sombra de oclusão: 0 80px 120px rgba(0,0,0,0.3) — blur 120px ≡ σ 60px
  const s = morphSpring(frame, fps);
  const camDist = -cameraZ(frame);
  const diameter = SIZE * pxPerUnit(camDist) * punchScale(s);
  const fl = floatWave(frame); // -1..1 (1 = esfera no alto, sombra mais fraca e menor)
  const shadowIn = ci(frame, [T.shadow, T.shadow + 25], [0, 1], Easing.out(Easing.exp));
  const shadowAlpha =
    shadowIn * interpolate(fl, [-1, 1], [0.3, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
    ci(frame, [T.dive, T.dive + 8], [1, 0]);
  const shadowScale = interpolate(fl, [-1, 1], [1, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // ── Saída do texto (270, stagger +0f): translateY 0→-200, blur 0→20,
  //    opacity 1→0, scale 1→0.95 — Saída Quádrupla, Easing.in(Easing.exp)
  const ex = ci(frame, [T.textExit, T.textExit + 18], [0, 1], Easing.in(Easing.exp));
  const textExit: React.CSSProperties = {
    transform: `translateY(${-200 * ex}px) scale(${1 - 0.05 * ex})`,
    filter: ex > 0.005 ? `blur(${20 * ex}px)` : undefined,
    opacity: ci(ex, [0.35, 1], [1, 0]),
  };

  // ── Overlap 293–300: a superfície já é azul chapado idêntico ao fundo da
  //    Cena 2; a camada some e entrega o grid que a Cena 2 desenha por baixo.
  const handoff = ci(frame, [T.pop + 3, T.end], [1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: P.paper, overflow: 'hidden', fontFamily: FONT, opacity: handoff }}>
      {/* BACKGROUND VIVO — corte seco na base, grid + anéis em opacidade */}
      <AbsoluteFill style={{ opacity: bgIn }}>
        <ScrollingGrid frame={frame} />
        <PulseRings frame={frame} />
      </AbsoluteFill>

      {/* SOMBRA 3D — ausente no 2D, forte no 3D, presa ao "chão" */}
      <div
        style={{
          position: 'absolute',
          left: 540 - diameter / 2,
          top: 960 - diameter / 2,
          width: diameter,
          height: diameter,
          borderRadius: '50%',
          backgroundColor: `rgba(0,0,0,${shadowAlpha})`,
          filter: 'blur(60px)',
          transform: `translateY(${80 * shadowIn}px) scale(${shadowScale})`,
        }}
      />

      {/* O MORFO — quadrado 2D → esfera cromada (WebGL, fundo transparente) */}
      <ThreeCanvas
        width={width}
        height={height}
        flat
        camera={{ fov: FOV, near: 1, far: 8000, position: [0, 0, CAM_START] }}
        gl={{ antialias: true }}
      >
        <World />
      </ThreeCanvas>

      {/* BADGE TOPO — HUD, fora da paralaxe */}
      <AbsoluteFill style={textExit}>
        <div style={{ position: 'absolute', top: 160, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <BadgeTop frame={frame} fps={fps} />
        </div>
      </AbsoluteFill>

      {/* TIPOGRAFIA — abraça o objeto: cada linha num plano Z próprio */}
      <AbsoluteFill style={{ ...textExit, color: P.ink }}>
        <DepthLayer frame={frame} zDepth={100}>
          <div style={{ position: 'absolute', top: 470, left: 40, right: 40 }}>
            <SpringWords
              text="Como o 2D e o 3D"
              start={T.text[0]}
              {...LINE_ENTRY}
              style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}
            />
          </div>
        </DepthLayer>
        <DepthLayer frame={frame} zDepth={50}>
          <div style={{ position: 'absolute', top: 1400, left: 40, right: 40 }}>
            <SpringWords
              text="transformam a"
              start={T.text[1]}
              {...LINE_ENTRY}
              style={{ fontSize: 64, fontWeight: 300, color: P.gray, lineHeight: 1 }}
            />
          </div>
        </DepthLayer>
        <DepthLayer frame={frame} zDepth={120}>
          <div style={{ position: 'absolute', top: 1490, left: 40, right: 40 }}>
            <SpringWords
              text="Comunicação Visual?"
              start={T.text[2]}
              {...LINE_ENTRY}
              style={{ fontSize: 80, fontWeight: 900, letterSpacing: -3, color: P.blueprint, lineHeight: 1.05 }}
            />
          </div>
        </DepthLayer>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Badge topo "Gráficos 2D vs 3D!" — 48px 500, tracking +4, scale + bounce. */
const BadgeTop: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = frame < T.badge ? 0 : spring({ frame: frame - T.badge, fps, config: SPRINGS.badge });
  // Linear no spring (sem interpolate) para manter o overshoot do bounce.
  const scale = 0.6 + 0.4 * s;
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
        opacity: ci(frame - T.badge, [0, 8], [0, 1]),
        transform: `scale(${scale})`,
        filter: `blur(${ci(frame - T.badge, [0, 9], [6, 0])}px)`,
      }}
    >
      Gráficos 2D vs 3D!
    </div>
  );
};
