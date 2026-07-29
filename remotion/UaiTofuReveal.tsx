import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Fundo exato extraído da arte original (não alterar).
const BG = '#FBBD3C';

const FPS = 60;
// Cena 1: 0-60 (reveal da caixa) | Cena 2: 60-120 (fatias emergem)
// Cena 3: 120-216 (micro movimento) | Cena 4: 216-264 (convergência)
// Cena 5: 264-300 (reveal da logo + hold)
const S1_END = 60;
const S2_END = 120;
const S3_END = 216;
const S4_END = 264;
export const DURATION = 300;

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Posições e tamanhos exatos extraídos da imagem de referência (composição final),
// já na escala do canvas 1080x1920.
const BOX = { src: 'box.png', cx: 554, cy: 942, w: 585, h: 733 };
const LOGO = { src: 'logo.png', cx: 554, cy: 942, w: 300, h: 245 };

type SliceConfig = {
  id: number;
  src: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  stagger: number;
  bulgeAxis: 'x' | 'y';
  bulge: number;
  rotSeed: number;
  idleFreq: number;
  idlePhase: number;
  idleAmpY: number;
  idleAmpR: number;
};

const SLICES: SliceConfig[] = [
  { id: 1, src: 'slice1.png', cx: 217, cy: 466, w: 362, h: 300, stagger: 0, bulgeAxis: 'x', bulge: -90, rotSeed: -22, idleFreq: 0.05, idlePhase: 0.3, idleAmpY: 5, idleAmpR: 1.8 },
  { id: 2, src: 'slice2.png', cx: 756, cy: 427, w: 368, h: 206, stagger: 6, bulgeAxis: 'y', bulge: 70, rotSeed: 18, idleFreq: 0.043, idlePhase: 2.1, idleAmpY: 4, idleAmpR: 2.0 },
  { id: 3, src: 'slice3.png', cx: 892, cy: 803, w: 334, h: 272, stagger: 12, bulgeAxis: 'x', bulge: 80, rotSeed: -16, idleFreq: 0.038, idlePhase: 4.0, idleAmpY: 6, idleAmpR: 1.5 },
  { id: 4, src: 'slice4.png', cx: 128, cy: 872, w: 256, h: 346, stagger: 18, bulgeAxis: 'y', bulge: -65, rotSeed: 24, idleFreq: 0.056, idlePhase: 1.2, idleAmpY: 3, idleAmpR: 2.2 },
  { id: 5, src: 'slice5.png', cx: 849, cy: 1397, w: 286, h: 313, stagger: 24, bulgeAxis: 'x', bulge: 75, rotSeed: -20, idleFreq: 0.047, idlePhase: 3.3, idleAmpY: 5, idleAmpR: 1.7 },
  { id: 6, src: 'slice6.png', cx: 262, cy: 1398, w: 388, h: 286, stagger: 30, bulgeAxis: 'y', bulge: -60, rotSeed: 18, idleFreq: 0.041, idlePhase: 5.0, idleAmpY: 4, idleAmpR: 2.0 },
];

// Raio fixo do "anel/flor" fechado — cada fatia converge para este raio,
// mantendo sua direção original a partir do centro da caixa, para que as
// pétalas se toquem de forma consistente (como no storyboard de referência).
const RING_RADIUS = 128;
const RING_SCALE = 0.56;
const EMERGE_TRAVEL = 34;

function ringTarget(cfg: SliceConfig) {
  const dx = cfg.cx - BOX.cx;
  const dy = cfg.cy - BOX.cy;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: BOX.cx + (dx / dist) * RING_RADIUS,
    y: BOX.cy + (dy / dist) * RING_RADIUS,
  };
}

const Slice: React.FC<{ cfg: SliceConfig; frame: number; fps: number }> = ({ cfg, frame, fps }) => {
  const emergeStart = S1_END + cfg.stagger;

  const progress = spring({
    frame: Math.max(0, frame - emergeStart),
    fps,
    config: { damping: 13, mass: 0.9, stiffness: 100 },
  });

  const clampedLin = interpolate(frame, [emergeStart, emergeStart + EMERGE_TRAVEL], [0, 1], clampCfg);

  const emergeX = interpolate(progress, [0, 1], [BOX.cx, cfg.cx] as number[]);
  const emergeY = interpolate(progress, [0, 1], [BOX.cy, cfg.cy] as number[]);
  const emergeScale = interpolate(progress, [0, 1], [0.2, 1]);
  const emergeRot = interpolate(progress, [0, 1], [cfg.rotSeed, 0] as number[]);
  const emergeOpacity = interpolate(frame, [emergeStart, emergeStart + 10], [0, 1], clampCfg);

  const bulge = cfg.bulge * Math.sin(clampedLin * Math.PI);

  // Convergência (Cena 4): parte de onde a fatia já está (emergeX/Y) até o cluster fechado.
  const closeProgress = interpolate(frame, [S3_END, S4_END], [0, 1], {
    ...clampCfg,
    easing: Easing.inOut(Easing.cubic),
  });
  const ring = ringTarget(cfg);
  const convergeX = interpolate(closeProgress, [0, 1], [emergeX, ring.x] as number[]);
  const convergeY = interpolate(closeProgress, [0, 1], [emergeY, ring.y] as number[]);
  const convergeScale = interpolate(closeProgress, [0, 1], [emergeScale, emergeScale * RING_SCALE] as number[]);

  // Micro movimento vivo (Cena 3), com entrada/saída suave via envelope.
  const idleEnv = interpolate(
    frame,
    [110, 130, S3_END, S3_END + 16],
    [0, 1, 1, 0],
    clampCfg
  );
  const idleX = idleEnv * Math.sin(frame * cfg.idleFreq * 1.1 + cfg.idlePhase + 1.5) * 3;
  const idleY = idleEnv * Math.sin(frame * cfg.idleFreq + cfg.idlePhase) * cfg.idleAmpY;
  const idleRot = idleEnv * Math.sin(frame * cfg.idleFreq * 0.85 + cfg.idlePhase + 0.7) * cfg.idleAmpR;

  const x = convergeX + idleX + (cfg.bulgeAxis === 'x' ? bulge : 0);
  const y = convergeY + idleY + (cfg.bulgeAxis === 'y' ? bulge : 0);
  const rotation = emergeRot + idleRot;
  const scale = convergeScale;

  return (
    <Img
      src={staticFile(`uai-tofu/${cfg.src}`)}
      style={{
        position: 'absolute',
        left: x - cfg.w / 2,
        top: y - cfg.h / 2,
        width: cfg.w,
        height: cfg.h,
        opacity: emergeOpacity,
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
    />
  );
};

const BoxShadow: React.FC<{ opacity: number }> = ({ opacity }) => (
  <div
    style={{
      position: 'absolute',
      left: BOX.cx - BOX.w * 0.42,
      top: BOX.cy + BOX.h * 0.46,
      width: BOX.w * 0.84,
      height: BOX.h * 0.16,
      opacity,
      background: 'radial-gradient(ellipse at center, rgba(60,35,10,0.55) 0%, rgba(60,35,10,0) 72%)',
      filter: 'blur(14px)',
    }}
  />
);

const Glow: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [S4_END, S4_END + 8, DURATION], [0, 0.35, 0.16], clampCfg);
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: 'screen',
        background: `radial-gradient(circle at ${LOGO.cx}px ${LOGO.cy}px, #fffdf6 0%, #fff1c4 40%, transparent 72%)`,
      }}
    />
  );
};

const Burst: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [S4_END, S4_END + 8, S4_END + 24], [0, 0.55, 0], clampCfg);
  const scale = interpolate(frame, [S4_END, S4_END + 22], [0.6, 1.35], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });

  if (opacity <= 0) return null;

  const lines = 14;
  return (
    <svg
      width={LOGO.w * 2.4}
      height={LOGO.w * 2.4}
      viewBox="0 0 200 200"
      style={{
        position: 'absolute',
        left: LOGO.cx - (LOGO.w * 2.4) / 2,
        top: LOGO.cy - (LOGO.w * 2.4) / 2,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '50% 50%',
      }}
    >
      {Array.from({ length: lines }).map((_, i) => {
        const angle = (i / lines) * Math.PI * 2;
        const r0 = 34;
        const r1 = 56 + (i % 3) * 8;
        const x0 = 100 + Math.cos(angle) * r0;
        const y0 = 100 + Math.sin(angle) * r0;
        const x1 = 100 + Math.cos(angle) * r1;
        const y1 = 100 + Math.sin(angle) * r1;
        return (
          <line
            key={i}
            x1={x0}
            y1={y0}
            x2={x1}
            y2={y1}
            stroke="#fffdf6"
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export const UaiTofuReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cena 1 — reveal da caixa
  const boxSpring = spring({ frame, fps, config: { damping: 10, mass: 0.8, stiffness: 120 } });
  const boxScale = interpolate(boxSpring, [0, 1], [0.92, 1]);
  const boxRevealOpacity = interpolate(frame, [0, 20], [0, 1], clampCfg);
  const shadowOpacity = interpolate(frame, [0, 30], [0, 0.22], clampCfg);

  // Cena 4 — caixa desaparece suavemente enquanto as fatias continuam fechando
  const boxFade = interpolate(frame, [S3_END + 12, S3_END + 36], [1, 0], {
    ...clampCfg,
    easing: Easing.inOut(Easing.cubic),
  });
  const boxOpacity = boxRevealOpacity * boxFade;

  // Cena 5 — reveal da logo
  const logoSpring = spring({
    frame: Math.max(0, frame - S4_END),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 130 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.9, 1]);
  const logoOpacity = interpolate(frame, [S4_END, S4_END + 12], [0, 1], clampCfg);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <BoxShadow opacity={shadowOpacity * boxFade} />

      {SLICES.map((cfg) => (
        <Slice key={cfg.id} cfg={cfg} frame={frame} fps={fps} />
      ))}

      <Img
        src={staticFile(`uai-tofu/${BOX.src}`)}
        style={{
          position: 'absolute',
          left: BOX.cx - BOX.w / 2,
          top: BOX.cy - BOX.h / 2,
          width: BOX.w,
          height: BOX.h,
          opacity: boxOpacity,
          transform: `scale(${boxScale})`,
        }}
      />

      <Img
        src={staticFile(`uai-tofu/${LOGO.src}`)}
        style={{
          position: 'absolute',
          left: LOGO.cx - LOGO.w / 2,
          top: LOGO.cy - LOGO.h / 2,
          width: LOGO.w,
          height: LOGO.h,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      />

      <Glow frame={frame} />
      <Burst frame={frame} />
    </AbsoluteFill>
  );
};
