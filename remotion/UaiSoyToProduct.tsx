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

// =============================================================================
// UAI TOFU — "Da soja ao produto"
// Vertical 9:16 narrative: soybean grains -> creamy mass -> tofu block -> sliced
// -> real package -> finished dish -> logo close.
//
// Scenes 1-3 and 6 have no real product photography available yet (grains,
// creamy texture, whole block, finished plate), so per client direction they
// are STYLIZED motion graphics (shape/color/light in the brand palette) —
// never faux-photorealistic. Scenes 4, 5 and 7 use the real, already
// chroma-keyed brand assets (slice1-6.png, box.png, logo.png) completely
// unaltered: only uniform position/scale/rotation, never distorted/redrawn.
// =============================================================================

const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// ---- Timeline (frames @ 60fps) -------------------------------------------
// Cena 1  0.0-1.5s  grãos de soja
// Cena 2  1.5-3.0s  textura cremosa
// Cena 3  3.0-4.5s  bloco de tofu
// Cena 4  4.5-6.0s  corte em fatias
// Cena 5  6.0-7.5s  embalagem real
// Cena 6  7.5-9.0s  prato pronto
// Cena 7  9.0-10s   fechamento com a marca (0.5s hold no final)
const S1_START = 0;
const S1_END = 90;
const S2_START = 90;
const S2_END = 180;
const S3_START = 180;
const S3_END = 270;
const S4_START = 270;
const S4_END = 360;
const S5_START = 360;
const S5_END = 450;
const S6_START = 450;
const S6_END = 540;
const S7_START = 540;
export const DURATION = 600;

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Ponto focal compartilhado por todas as cenas centrais — evita "saltos" de
// composição na transição entre uma cena e a próxima.
const STAGE_CX = 540;
const STAGE_CY = 900;

// Duração do crossfade entre cenas.
const XFADE = 18;

// Opacidade de uma cena com dissolve suave para a vizinha — a primeira cena
// não tem fade-in (abre já visível) e a última não tem fade-out (fica em hold).
function crossfade(frame: number, start: number, end: number, isFirst: boolean, isLast: boolean) {
  if (isFirst && isLast) return 1;
  if (isFirst) {
    return interpolate(frame, [end - XFADE, end], [1, 0], clampCfg);
  }
  if (isLast) {
    return interpolate(frame, [start - XFADE, start], [0, 1], clampCfg);
  }
  return interpolate(
    frame,
    [start - XFADE, start, end - XFADE, end],
    [0, 1, 1, 0],
    clampCfg
  );
}

// ---- Paleta (quente, artesanal/mineiro, premium) --------------------------
const BG_CREAM = '#F3E2C0';
const BG_CREAM_DEEP = '#E7CE9C';
const YELLOW = '#FBBD3C';
const BEIGE = '#EAD6AC';
const BEIGE_DEEP = '#D6BA80';
const TERRACOTTA = '#C1602F';
const DARK_GREEN = '#33513A';
const BRAND_RED = '#962D15';
const SOY = '#C7B25A';
const SOY_DEEP = '#A38A3C';
const SMOKED = '#7A5230';
const TOFU_CREAM = '#F5EAD3';

const fontFamily = 'Lato';

const FontFace: React.FC = () => (
  <style>{`
    @font-face {
      font-family: 'Lato';
      src: url('${staticFile('fonts/Lato-Regular-latin.woff2')}') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: block;
    }
    @font-face {
      font-family: 'Lato';
      src: url('${staticFile('fonts/Lato-Black-latin.woff2')}') format('woff2');
      font-weight: 900;
      font-style: normal;
      font-display: block;
    }
  `}</style>
);

// Fundo quente contínuo (papel kraft sutil) + grão discreto — presente do
// início ao fim, para as cenas nunca parecerem "flutuando no vazio".
const Background: React.FC<{ frame: number }> = ({ frame }) => {
  const grainFlicker = 0.035 + Math.sin(frame * 0.3) * 0.008;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 38%, ${BG_CREAM} 0%, ${BG_CREAM_DEEP} 100%)`,
        }}
      />
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: grainFlicker, mixBlendMode: 'multiply' }}
      >
        <filter id="kraft-grain">
          <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={5} stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0.5 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#kraft-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 1 — SoybeanParticles (0-1.5s)
// Grãos surgindo em disposição phyllotaxis (ângulo dourado) — orgânico e
// determinístico, sem depender de Math.random no render.
// =============================================================================
const GOLDEN_ANGLE = 137.50776;
const GRAIN_COUNT = 24;

type Grain = { i: number; cx: number; cy: number; size: number; rot: number; stagger: number };

const GRAINS: Grain[] = Array.from({ length: GRAIN_COUNT }).map((_, i) => {
  const angle = (i * GOLDEN_ANGLE * Math.PI) / 180;
  const radius = 46 * Math.sqrt(i);
  return {
    i,
    cx: STAGE_CX + Math.cos(angle) * radius,
    cy: STAGE_CY + Math.sin(angle) * radius * 0.92,
    size: 80 + (i % 5) * 11,
    rot: ((i * 53) % 360) - 180,
    stagger: i * 1.6,
  };
});

const SoybeanGrain: React.FC<{ g: Grain; frame: number }> = ({ g, frame }) => {
  const local = frame - S1_START - g.stagger;
  const enter = interpolate(local, [0, 20], [0, 1], { ...clampCfg, easing: Easing.out(Easing.cubic) });
  const scale = interpolate(enter, [0, 1], [0.8, 1]);
  const rot = interpolate(enter, [0, 1], [g.rot * 0.4, 0]);
  // Leve deriva orgânica contínua, como grãos assentando.
  const drift = Math.sin((frame + g.i * 9) * 0.05) * 3;
  // No fim da cena os grãos são puxados sutilmente para dentro, antecipando a fusão.
  const pull = interpolate(frame, [S1_END - 22, S1_END], [0, 1], clampCfg);
  const x = g.cx + (STAGE_CX - g.cx) * pull * 0.35;
  const y = g.cy + (STAGE_CY - g.cy) * pull * 0.35 + drift * (1 - pull);

  return (
    <div
      style={{
        position: 'absolute',
        left: x - g.size / 2,
        top: y - g.size / 2,
        width: g.size,
        height: g.size * 0.86,
        opacity: enter,
        borderRadius: '52% 48% 55% 45% / 58% 52% 48% 42%',
        transform: `rotate(${rot}deg) scale(${scale})`,
        background: `radial-gradient(circle at 34% 30%, #E9D98A 0%, ${SOY} 45%, ${SOY_DEEP} 100%)`,
        boxShadow: '0 4px 8px rgba(90,70,20,0.18)',
      }}
    />
  );
};

const SoybeanParticles: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {GRAINS.map((g) => (
      <SoybeanGrain key={g.i} g={g} frame={frame} />
    ))}
  </>
);

// =============================================================================
// CENA 2 — CreamMorph (1.5-3s)
// Mancha orgânica (turbulência + displacement em CSS filter) que cresce a
// partir do agrupamento de grãos e amolece em massa cremosa. Nada de "leite
// industrial": tom bege elegante, bordas macias, sem brilho plástico.
// =============================================================================
const CreamFilterDefs: React.FC<{ displacement: number }> = ({ displacement }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }}>
    <defs>
      <filter id="cream-morph-filter" x="-40%" y="-40%" width="180%" height="180%">
        <feTurbulence type="fractalNoise" baseFrequency={0.012} numOctaves={2} seed={7} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={displacement} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

const CreamMorph: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - S2_START;
  const grow = interpolate(local, [0, 55], [0, 1], { ...clampCfg, easing: Easing.inOut(Easing.sin) });
  const diameter = interpolate(grow, [0, 1], [340, 620]);

  // Cresce orgânico e depois começa a se "aprumar" para o formato de bloco.
  const settle = interpolate(local, [55, 90], [0, 1], { ...clampCfg, easing: Easing.inOut(Easing.cubic) });
  const borderRadius = interpolate(settle, [0, 1], [50, 30]); // % -> vira retangular arredondado
  const width = interpolate(settle, [0, 1], [diameter, 620]);
  const height = interpolate(settle, [0, 1], [diameter, 440]);
  const displacement = interpolate(local, [0, 30, 60, 90], [0, 34, 30, 6], clampCfg);
  const blurAmt = interpolate(local, [0, 30, 90], [16, 9, 3], clampCfg);
  const opacity = interpolate(local, [0, 14], [0, 1], clampCfg);

  return (
    <>
      <CreamFilterDefs displacement={displacement} />
      <div
        style={{
          position: 'absolute',
          left: STAGE_CX - width / 2,
          top: STAGE_CY - height / 2,
          width,
          height,
          opacity,
          borderRadius: `${borderRadius}%`,
          background: `radial-gradient(ellipse at 38% 32%, #FBF3DE 0%, ${BEIGE} 55%, ${BEIGE_DEEP} 100%)`,
          filter: `url(#cream-morph-filter) blur(${blurAmt}px)`,
          boxShadow: `0 20px 40px -12px rgba(90,60,20,0.28)`,
        }}
      />
      {/* Reflexo suave sugerindo movimento de mistura, sem parecer líquido industrial. */}
      <div
        style={{
          position: 'absolute',
          left: STAGE_CX - width * 0.28,
          top: STAGE_CY - height * 0.3,
          width: width * 0.56,
          height: height * 0.22,
          opacity: opacity * 0.5 * (1 - settle * 0.6),
          borderRadius: '50%',
          background: 'linear-gradient(90deg, rgba(255,250,235,0.65), rgba(255,250,235,0))',
          filter: 'blur(6px)',
          transform: `rotate(${-8 + settle * 4}deg)`,
        }}
      />
    </>
  );
};

// =============================================================================
// CENA 3 — TofuBlock (3-4.5s)
// Bloco com volume, squash-and-stretch de chegada, sombra de contato e
// bordas levemente irregulares (artesanal, não um retângulo perfeito de CSS).
// =============================================================================
const TofuBlock: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - S3_START;
  const s = spring({ frame: local, fps, config: { damping: 9, mass: 0.9, stiffness: 130 } });
  // Squash-and-stretch sutil: chega "achatado" e assenta na proporção final.
  const stretchY = interpolate(s, [0, 1], [0.72, 1]);
  const stretchX = interpolate(s, [0, 1], [1.14, 1]);
  const opacity = interpolate(local, [0, 10], [0, 1], clampCfg);

  const W = 620;
  const H = 440;
  const shadowOpacity = interpolate(local, [0, 16], [0, 0.3], clampCfg);

  return (
    <>
      {/* sombra de contato */}
      <div
        style={{
          position: 'absolute',
          left: STAGE_CX - (W * stretchX) * 0.46,
          top: STAGE_CY + (H * stretchY) * 0.42,
          width: W * stretchX * 0.92,
          height: 60,
          opacity: shadowOpacity,
          background: 'radial-gradient(ellipse at center, rgba(70,45,15,0.55) 0%, rgba(70,45,15,0) 72%)',
          filter: 'blur(18px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: STAGE_CX - (W * stretchX) / 2,
          top: STAGE_CY - (H * stretchY) / 2,
          width: W * stretchX,
          height: H * stretchY,
          opacity,
          // cantos levemente irregulares, para não ler como "retângulo de vetor".
          borderRadius: '42px 50px 38px 46px',
          background: `linear-gradient(165deg, #FBF3DE 0%, ${TOFU_CREAM} 45%, ${BEIGE_DEEP} 100%)`,
          border: `2px solid rgba(122,82,48,0.22)`,
          boxShadow: '0 26px 46px -18px rgba(90,60,20,0.35), inset 0 2px 0 rgba(255,255,255,0.5)',
        }}
      />
      {/* realce suave no topo, sugerindo volume sem look 3D artificial */}
      <div
        style={{
          position: 'absolute',
          left: STAGE_CX - (W * stretchX) * 0.36,
          top: STAGE_CY - (H * stretchY) * 0.42,
          width: W * stretchX * 0.5,
          height: H * stretchY * 0.28,
          opacity: opacity * 0.55,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,252,240,0.75), rgba(255,252,240,0))',
          filter: 'blur(4px)',
        }}
      />
    </>
  );
};

// =============================================================================
// CENA 4 — TofuSlices (4.5-6s)
// Uma linha de corte varre o bloco estilizado; ele dá lugar às fatias REAIS
// (fotos já extraídas), que deslizam para os lados com rotação e espaçamento
// naturais. Poeira sutil e opcional no instante do corte.
// =============================================================================
type SliceCfg = { src: string; w: number; h: number; targetX: number; targetY: number; targetRot: number };

const SLICE_TARGET_LONG = 380;
const SLICE_SET: SliceCfg[] = [
  { src: 'slice1.png', w: 362, h: 300, targetX: STAGE_CX - 300, targetY: STAGE_CY - 10, targetRot: -13 },
  { src: 'slice3.png', w: 334, h: 272, targetX: STAGE_CX - 102, targetY: STAGE_CY + 24, targetRot: -4 },
  { src: 'slice5.png', w: 286, h: 313, targetX: STAGE_CX + 102, targetY: STAGE_CY - 22, targetRot: 6 },
  { src: 'slice6.png', w: 388, h: 286, targetX: STAGE_CX + 300, targetY: STAGE_CY + 12, targetRot: 14 },
];

const CutLine: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - S4_START;
  const progress = interpolate(local, [0, 24], [0, 1], { ...clampCfg, easing: Easing.inOut(Easing.cubic) });
  const opacity = interpolate(local, [0, 6, 22, 28], [0, 1, 1, 0], clampCfg);
  if (opacity <= 0) return null;
  const x = STAGE_CX - 320 + progress * 640;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 2,
        top: STAGE_CY - 240,
        width: 4,
        height: 480,
        opacity,
        background: 'linear-gradient(180deg, rgba(255,253,246,0) 0%, #FFFDF6 45%, #FFFDF6 55%, rgba(255,253,246,0) 100%)',
        boxShadow: '0 0 18px 4px rgba(255,253,246,0.7)',
      }}
    />
  );
};

const CRUMB_DOTS = [
  { dx: -14, dy: 30, size: 4 },
  { dx: 10, dy: 42, size: 3 },
  { dx: -30, dy: 20, size: 3 },
  { dx: 24, dy: 26, size: 4 },
  { dx: 2, dy: 50, size: 3 },
];

const CrumbDust: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - S4_START;
  const opacity = interpolate(local, [16, 22, 40], [0, 0.4, 0], clampCfg);
  if (opacity <= 0) return null;
  return (
    <>
      {CRUMB_DOTS.map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: STAGE_CX + d.dx - d.size / 2,
            top: STAGE_CY + d.dy - d.size / 2 + (local - 16) * 0.6,
            width: d.size,
            height: d.size,
            opacity,
            borderRadius: '50%',
            background: TOFU_CREAM,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </>
  );
};

const RealSlice: React.FC<{ cfg: SliceCfg; frame: number; fps: number }> = ({ cfg, frame, fps }) => {
  const emergeStart = S4_START + 26;
  const s = spring({ frame: Math.max(0, frame - emergeStart), fps, config: { damping: 15, mass: 0.85, stiffness: 105 } });
  const opacity = interpolate(frame, [emergeStart, emergeStart + 12], [0, 1], clampCfg);
  const scaleBase = SLICE_TARGET_LONG / Math.max(cfg.w, cfg.h);
  const scale = interpolate(s, [0, 1], [scaleBase * 0.55, scaleBase]);
  const x = interpolate(s, [0, 1], [STAGE_CX, cfg.targetX] as number[]);
  const y = interpolate(s, [0, 1], [STAGE_CY, cfg.targetY] as number[]);
  const rot = interpolate(s, [0, 1], [cfg.targetRot * 2.2, cfg.targetRot]);

  // Micro-flutuação viva depois de assentar, até o fim da cena.
  const idleEnv = interpolate(frame, [emergeStart + 30, emergeStart + 44], [0, 1], clampCfg);
  const idleY = idleEnv * Math.sin(frame * 0.045 + cfg.targetX) * 3;

  const w = cfg.w * scale;
  const h = cfg.h * scale;

  return (
    <Img
      src={staticFile(`uai-tofu/${cfg.src}`)}
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2 + idleY,
        width: w,
        height: h,
        opacity,
        transform: `rotate(${rot}deg)`,
      }}
    />
  );
};

const TofuSlices: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // O bloco estilizado permanece visível até a linha de corte terminar de
  // passar, depois cede lugar às fatias reais (crossfade curto e local).
  const blockFade = interpolate(frame, [S4_START + 22, S4_START + 34], [1, 0], clampCfg);
  return (
    <>
      {blockFade > 0 && (
        <div style={{ position: 'absolute', inset: 0, opacity: blockFade }}>
          <TofuBlock frame={S3_END - 1} fps={fps} />
        </div>
      )}
      <CutLine frame={frame} />
      <CrumbDust frame={frame} />
      {SLICE_SET.map((cfg) => (
        <RealSlice key={cfg.src} cfg={cfg} frame={frame} fps={fps} />
      ))}
    </>
  );
};

// =============================================================================
// CENA 5 — ProductPackage (6-7.5s)
// Embalagem real (box.png) — asset travado: nunca distorcer, redesenhar ou
// recolorir. Apenas fade + escala uniforme + sombra realista. As fatias reais
// da cena anterior se reposicionam ao redor da caixa.
// =============================================================================
const BOX = { src: 'box.png', w: 557, h: 705 };

const ProductPackage: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - S5_START;
  const s = spring({ frame: local, fps, config: { damping: 13, mass: 0.8, stiffness: 120 } });
  const scale = interpolate(s, [0, 1], [0.92, 1]);
  const opacity = interpolate(local, [0, 16], [0, 1], clampCfg);
  const shadowOpacity = interpolate(local, [0, 20], [0, 0.26], clampCfg);

  const w = BOX.w * scale;
  const h = BOX.h * scale;

  // Posições das 4 fatias reais, agora flanqueando a embalagem (2 de cada lado).
  const flank = [
    { src: 'slice1.png', w: 362, h: 300, x: STAGE_CX - w / 2 - 118, y: STAGE_CY - 190, rot: -16 },
    { src: 'slice6.png', w: 388, h: 286, x: STAGE_CX - w / 2 - 92, y: STAGE_CY + 210, rot: 10 },
    { src: 'slice3.png', w: 334, h: 272, x: STAGE_CX + w / 2 + 96, y: STAGE_CY - 200, rot: 12 },
    { src: 'slice5.png', w: 286, h: 313, x: STAGE_CX + w / 2 + 112, y: STAGE_CY + 196, rot: -10 },
  ];
  const flankScale = interpolate(s, [0, 1], [205, 225]) / 380;

  return (
    <>
      {flank.map((f, i) => {
        const fs = spring({ frame: Math.max(0, local - 6 - i * 3), fps, config: { damping: 15, mass: 0.85, stiffness: 100 } });
        const fOpacity = interpolate(fs, [0, 1], [0, 1]);
        const dw = f.w * flankScale;
        const dh = f.h * flankScale;
        const fx = interpolate(fs, [0, 1], [STAGE_CX, f.x]);
        const fy = interpolate(fs, [0, 1], [STAGE_CY, f.y]);
        return (
          <Img
            key={f.src}
            src={staticFile(`uai-tofu/${f.src}`)}
            style={{
              position: 'absolute',
              left: fx - dw / 2,
              top: fy - dh / 2,
              width: dw,
              height: dh,
              opacity: fOpacity * 0.94,
              transform: `rotate(${f.rot}deg)`,
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: STAGE_CX - w * 0.4,
          top: STAGE_CY + h * 0.44,
          width: w * 0.8,
          height: h * 0.15,
          opacity: shadowOpacity,
          background: 'radial-gradient(ellipse at center, rgba(60,35,10,0.55) 0%, rgba(60,35,10,0) 72%)',
          filter: 'blur(14px)',
        }}
      />
      <Img
        src={staticFile(`uai-tofu/${BOX.src}`)}
        style={{
          position: 'absolute',
          left: STAGE_CX - w / 2,
          top: STAGE_CY - h / 2,
          width: w,
          height: h,
          opacity,
          transform: `scale(1)`,
        }}
      />
    </>
  );
};

// =============================================================================
// CENA 6 — FinalDish (7.5-9s)
// Prato estilizado (sem foto real disponível) com cubos de tofu, guarnição e
// vapor sutil. Push-in elegante. Embalagem some desfocada ao fundo.
// =============================================================================
const SteamWisp: React.FC<{ frame: number; x: number; y: number; delay: number }> = ({ frame, x, y, delay }) => {
  const local = frame - S6_START - delay;
  const rise = interpolate(local, [0, 70], [0, -150], clampCfg);
  const opacity = interpolate(local, [0, 20, 55, 70], [0, 0.28, 0.16, 0], clampCfg);
  const sway = Math.sin(local * 0.06) * 16;
  return (
    <div
      style={{
        position: 'absolute',
        left: x + sway,
        top: y - 250 + rise,
        width: 5,
        height: 120,
        opacity,
        borderRadius: 6,
        background: 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0))',
        filter: 'blur(5px)',
      }}
    />
  );
};

const TofuCube: React.FC<{ x: number; y: number; size: number; rot: number }> = ({ x, y, size, rot }) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: 8,
      transform: `rotate(${rot}deg)`,
      background: `linear-gradient(165deg, ${TOFU_CREAM} 0%, ${BEIGE} 70%, ${SMOKED} 100%)`,
      border: '1.5px solid rgba(122,82,48,0.3)',
      boxShadow: '0 8px 14px -6px rgba(90,60,20,0.4)',
    }}
  />
);

const FinalDish: React.FC<{ frame: number }> = ({ frame }) => {
  const local = frame - S6_START;
  const enter = interpolate(local, [0, 22], [0, 1], { ...clampCfg, easing: Easing.out(Easing.cubic) });
  const pushIn = interpolate(local, [0, 90], [1, 1.08], { ...clampCfg, easing: Easing.inOut(Easing.sin) });

  // Centro do prato — um pouco abaixo do ponto focal padrão, para a
  // composição respirar (guarnição e vapor sobem acima dele).
  const plateCx = STAGE_CX;
  const plateCy = STAGE_CY + 90;

  return (
    <AbsoluteFill style={{ transform: `scale(${pushIn})`, transformOrigin: '50% 50%' }}>
      {/* Embalagem desfocada ao fundo, apenas como contexto de marca. */}
      <Img
        src={staticFile(`uai-tofu/${BOX.src}`)}
        style={{
          position: 'absolute',
          left: 70,
          top: plateCy + 420,
          width: 190,
          height: 190 * (BOX.h / BOX.w),
          opacity: enter * 0.32,
          filter: 'blur(8px)',
        }}
      />

      {/* sombra do prato */}
      <div
        style={{
          position: 'absolute',
          left: plateCx - 400,
          top: plateCy + 220,
          width: 800,
          height: 100,
          opacity: enter * 0.3,
          background: 'radial-gradient(ellipse at center, rgba(50,30,10,0.55) 0%, rgba(50,30,10,0) 72%)',
          filter: 'blur(20px)',
        }}
      />
      {/* prato */}
      <div
        style={{
          position: 'absolute',
          left: plateCx - 450,
          top: plateCy - 190,
          width: 900,
          height: 380,
          opacity: enter,
          borderRadius: '50%',
          background: `linear-gradient(180deg, #FBF3DE 0%, ${BEIGE} 60%, ${TERRACOTTA} 100%)`,
          boxShadow: '0 34px 60px -20px rgba(70,40,10,0.4)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: plateCx - 392,
          top: plateCy - 158,
          width: 784,
          height: 296,
          opacity: enter,
          borderRadius: '50%',
          background: '#FBF6E8',
        }}
      />

      <TofuCube x={plateCx - 104} y={plateCy + 60} size={162} rot={-6} />
      <TofuCube x={plateCx + 76} y={plateCy + 44} size={150} rot={9} />
      <TofuCube x={plateCx - 14} y={plateCy - 56} size={134} rot={2} />

      {/* guarnição — folha estilizada */}
      <svg
        width={120}
        height={120}
        viewBox="0 0 70 70"
        style={{ position: 'absolute', left: plateCx + 206, top: plateCy - 40, opacity: enter }}
      >
        <path d="M35 5 C55 15 60 45 35 65 C10 45 15 15 35 5 Z" fill={DARK_GREEN} />
        <path d="M35 12 L35 58" stroke="#4E7457" strokeWidth={2} strokeLinecap="round" />
      </svg>

      <SteamWisp frame={frame} x={plateCx - 50} y={plateCy} delay={4} />
      <SteamWisp frame={frame} x={plateCx + 35} y={plateCy} delay={18} />
      <SteamWisp frame={frame} x={plateCx - 120} y={plateCy} delay={30} />
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 7 — LogoReveal (9-10s)
// Logo real (logo.png) — asset travado, apenas fade + escala uniforme + brilho.
// Linhas orgânicas mínimas e texto opcional. 0.5s de hold no final.
// =============================================================================
const LOGO = { src: 'logo.png', w: 460, h: 376 };
const TAGLINE = 'Natural. Artesanal. Mineiro.';

const MinimalArc: React.FC<{ frame: number; radius: number; dash: string; rotOffset: number; opacity: number }> = ({
  frame,
  radius,
  dash,
  rotOffset,
  opacity,
}) => {
  const spin = frame * 0.06 + rotOffset;
  const size = radius * 2 + 20;
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      style={{
        position: 'absolute',
        left: STAGE_CX - c,
        top: STAGE_CY - 60 - c,
        opacity,
        transform: `rotate(${spin}deg)`,
        transformOrigin: '50% 50%',
      }}
    >
      <circle cx={c} cy={c} r={radius} fill="none" stroke={TERRACOTTA} strokeWidth={2} strokeLinecap="round" strokeDasharray={dash} opacity={0.5} />
    </svg>
  );
};

const LogoReveal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - S7_START;
  const s = spring({ frame: local, fps, config: { damping: 13, mass: 0.8, stiffness: 120 } });
  const scale = interpolate(s, [0, 1], [0.9, 1]);
  const opacity = interpolate(local, [0, 16], [0, 1], clampCfg);
  const glow = interpolate(local, [0, 20, 60], [0, 0.4, 0.26], clampCfg);

  const taglineOpacity = interpolate(local, [22, 36], [0, 1], clampCfg);
  const taglineY = interpolate(local, [22, 36], [12, 0], { ...clampCfg, easing: Easing.out(Easing.cubic) });

  const w = LOGO.w * scale;
  const h = LOGO.h * scale;

  return (
    <>
      <AbsoluteFill
        style={{
          opacity: glow,
          mixBlendMode: 'screen',
          background: `radial-gradient(circle at ${STAGE_CX}px ${STAGE_CY - 60}px, #fffdf6 0%, #fff1c4 40%, transparent 72%)`,
        }}
      />
      <MinimalArc frame={frame} radius={280} dash="90 280" rotOffset={0} opacity={opacity * 0.4} />
      <MinimalArc frame={frame} radius={330} dash="50 380" rotOffset={140} opacity={opacity * 0.28} />

      <Img
        src={staticFile(`uai-tofu/${LOGO.src}`)}
        style={{
          position: 'absolute',
          left: STAGE_CX - w / 2,
          top: STAGE_CY - 60 - h / 2,
          width: w,
          height: h,
          opacity,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: STAGE_CY - 60 + h / 2 + 26,
          textAlign: 'center',
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontFamily,
          fontWeight: 400,
          fontSize: 30,
          letterSpacing: 0.5,
          color: BRAND_RED,
        }}
      >
        {TAGLINE}
      </div>
    </>
  );
};

// =============================================================================
// Composição principal — orquestra o crossfade entre as 7 cenas.
// =============================================================================
export const UaiSoyToProduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FontFace />
      <Background frame={frame} />

      <AbsoluteFill style={{ opacity: crossfade(frame, S1_START, S1_END, true, false) }}>
        <SoybeanParticles frame={frame} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S2_START, S2_END, false, false) }}>
        <CreamMorph frame={frame} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S3_START, S3_END, false, false) }}>
        <TofuBlock frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S4_START, S4_END, false, false) }}>
        <TofuSlices frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S5_START, S5_END, false, false) }}>
        <ProductPackage frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S6_START, S6_END, false, false) }}>
        <FinalDish frame={frame} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S7_START, DURATION, false, true) }}>
        <LogoReveal frame={frame} fps={fps} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
