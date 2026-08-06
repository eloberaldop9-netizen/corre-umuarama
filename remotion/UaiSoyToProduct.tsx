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
// Vertical 9:16 narrative: grãos de soja -> bloco de tofu -> corte em fatias
// -> embalagem real -> prato pronto -> logo close.
//
// Todas as cenas usam fotografia REAL do produto (recortes com alpha real ou
// "photo cards" retangulares) — nada de formas 3D/CGI inventadas. A cena
// intermediária de "textura cremosa" foi removida por decisão do cliente
// (não existia foto real para ela e a versão em motion graphics lia como
// falsa); a transição grão -> bloco agora é um crossfade com um pulso de
// blur bem curto, só para vender a "transformação" sem fabricar conteúdo.
// =============================================================================

const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// ---- Timeline (frames @ 60fps) -------------------------------------------
// Cena 1  0.00-1.83s  grãos de soja (foto real)
// Cena 3  1.83-3.67s  bloco de tofu inteiro, sem embalagem (foto real)
// Cena 4  3.67-5.42s  corte (foto real) -> fatias reais se espalhando
// Cena 5  5.42-7.00s  embalagem real + fatias ao redor
// Cena 6  7.00-8.75s  prato pronto (foto real)
// Cena 7  8.75-10.0s  fechamento com a marca (0.5s hold no final)
// (Numeração das cenas preservada do briefing original — a Cena 2, de
// textura cremosa, foi removida a pedido do cliente.)
const S1_START = 0;
const S1_END = 110;
const S3_START = 110;
const S3_END = 220;
const S4_START = 220;
const S4_END = 325;
const S5_START = 325;
const S5_END = 420;
const S6_START = 420;
const S6_END = 525;
const S7_START = 525;
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

// Pulso de blur curto centrado num frame — usado só na transição grão->bloco
// para sugerir "transformação" sem precisar de uma forma inventada no meio.
function transitionBlur(frame: number, center: number, halfWindow: number, peakPx: number) {
  return interpolate(
    frame,
    [center - halfWindow, center, center + halfWindow],
    [0, peakPx, 0],
    clampCfg
  );
}

// ---- Paleta (quente, artesanal/mineiro, premium) --------------------------
const BG_CREAM = '#F3E2C0';
const BG_CREAM_DEEP = '#E7CE9C';
const TERRACOTTA = '#C1602F';
const BRAND_RED = '#962D15';

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

// Sombra de contato genérica — mesmo tratamento usado sob todo elemento
// "hero" (grão, bloco, cards de foto, embalagem), para todas as cenas
// pousarem no mesmo chão visual.
const ContactShadow: React.FC<{ cx: number; cy: number; w: number; opacity: number }> = ({ cx, cy, w, opacity }) => (
  <div
    style={{
      position: 'absolute',
      left: cx - w / 2,
      top: cy,
      width: w,
      height: w * 0.16,
      opacity,
      background: 'radial-gradient(ellipse at center, rgba(60,35,10,0.5) 0%, rgba(60,35,10,0) 72%)',
      filter: 'blur(16px)',
    }}
  />
);

// =============================================================================
// CENA 1 — SoybeanGrains (0-1.83s)
// Foto real (potinho de grãos de soja + grãos soltos + folhas de soja).
// Recorte com alpha real (chroma-key sobre fundo branco), sem forma inventada.
// =============================================================================
const BEANS = { src: 'soy-beans.png', w: 887, h: 899 };
const BEANS_DISPLAY_W = 660;

const SoybeanGrains: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - S1_START;
  const s = spring({ frame: local, fps, config: { damping: 12, mass: 0.8, stiffness: 120 } });
  const scale = interpolate(s, [0, 1], [0.84, 1]);
  const opacity = interpolate(local, [0, 16], [0, 1], clampCfg);
  const shadowOpacity = interpolate(local, [0, 18], [0, 0.28], clampCfg);
  // respiração bem sutil, contínua, para a foto não ficar "morta" em tela.
  const breathe = 1 + Math.sin(frame * 0.025) * 0.012;

  const w = BEANS_DISPLAY_W * scale * breathe;
  const h = w * (BEANS.h / BEANS.w);

  return (
    <>
      <ContactShadow cx={STAGE_CX} cy={STAGE_CY + h * 0.42} w={w * 0.7} opacity={shadowOpacity} />
      <Img
        src={staticFile(`uai-tofu/${BEANS.src}`)}
        style={{
          position: 'absolute',
          left: STAGE_CX - w / 2,
          top: STAGE_CY - h / 2,
          width: w,
          height: h,
          opacity,
        }}
      />
    </>
  );
};

// =============================================================================
// CENA 3 — TofuBlock (1.83-3.67s)
// Bloco inteiro real (foto, sem embalagem), recorte com alpha real (chroma-key
// sobre fundo verde). Chegada com leve squash-and-stretch, sombra de contato.
// =============================================================================
const BLOCK = { src: 'tofu-block.png', w: 773, h: 619 };
const BLOCK_DISPLAY_W = 700;

const TofuBlock: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - S3_START;
  const s = spring({ frame: local, fps, config: { damping: 9, mass: 0.9, stiffness: 130 } });
  // Squash-and-stretch sutil: chega "achatado" e assenta na proporção final.
  const stretchY = interpolate(s, [0, 1], [0.8, 1]);
  const stretchX = interpolate(s, [0, 1], [1.1, 1]);
  const opacity = interpolate(local, [0, 10], [0, 1], clampCfg);
  const shadowOpacity = interpolate(local, [0, 16], [0, 0.32], clampCfg);
  const breathe = 1 + Math.sin(frame * 0.025) * 0.01;

  const w = BLOCK_DISPLAY_W * stretchX * breathe;
  const h = w * (BLOCK.h / BLOCK.w) * (stretchY / stretchX);

  return (
    <>
      <ContactShadow cx={STAGE_CX} cy={STAGE_CY + h * 0.4} w={w * 0.8} opacity={shadowOpacity} />
      <Img
        src={staticFile(`uai-tofu/${BLOCK.src}`)}
        style={{
          position: 'absolute',
          left: STAGE_CX - w / 2,
          top: STAGE_CY - h / 2,
          width: w,
          height: h,
          opacity,
        }}
      />
    </>
  );
};

// =============================================================================
// CENA 4 — TofuSlices (3.67-5.42s)
// Um "photo card" real (bloco sendo cortado com faca, tábua de madeira) abre
// a cena; em seguida cede lugar às fatias REAIS (já extraídas) que se
// espalham com rotação e espaçamento naturais.
// =============================================================================
const CUTTING_PHOTO = { src: 'tofu-cutting.jpg', w: 1080, h: 718 };
const CUTTING_DISPLAY_W = 760;
const CARD_FADE_OUT_START = S4_START + 34;
const CARD_FADE_OUT_END = S4_START + 50;

const CuttingPhotoCard: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - S4_START;
  const s = spring({ frame: local, fps, config: { damping: 13, mass: 0.8, stiffness: 130 } });
  const scale = interpolate(s, [0, 1], [0.9, 1]);
  const fadeIn = interpolate(local, [0, 14], [0, 1], clampCfg);
  const fadeOut = interpolate(frame, [CARD_FADE_OUT_START, CARD_FADE_OUT_END], [1, 0], clampCfg);
  const opacity = fadeIn * fadeOut;
  if (opacity <= 0) return null;

  const w = CUTTING_DISPLAY_W * scale;
  const h = w * (CUTTING_PHOTO.h / CUTTING_PHOTO.w);

  return (
    <>
      <ContactShadow cx={STAGE_CX} cy={STAGE_CY + h / 2 - 10} w={w * 0.85} opacity={opacity * 0.3} />
      <div
        style={{
          position: 'absolute',
          left: STAGE_CX - w / 2,
          top: STAGE_CY - h / 2,
          width: w,
          height: h,
          opacity,
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow: '0 30px 50px -20px rgba(60,35,10,0.4)',
        }}
      >
        <Img
          src={staticFile(`uai-tofu/${CUTTING_PHOTO.src}`)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </>
  );
};

type SliceCfg = { src: string; w: number; h: number; targetX: number; targetY: number; targetRot: number };

const SLICE_TARGET_LONG = 380;
const SLICE_SET: SliceCfg[] = [
  { src: 'slice1.png', w: 362, h: 300, targetX: STAGE_CX - 300, targetY: STAGE_CY - 10, targetRot: -13 },
  { src: 'slice3.png', w: 334, h: 272, targetX: STAGE_CX - 102, targetY: STAGE_CY + 24, targetRot: -4 },
  { src: 'slice5.png', w: 286, h: 313, targetX: STAGE_CX + 102, targetY: STAGE_CY - 22, targetRot: 6 },
  { src: 'slice6.png', w: 388, h: 286, targetX: STAGE_CX + 300, targetY: STAGE_CY + 12, targetRot: 14 },
];

const RealSlice: React.FC<{ cfg: SliceCfg; frame: number; fps: number }> = ({ cfg, frame, fps }) => {
  const emergeStart = S4_START + 30;
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

const TofuSlices: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
  <>
    <CuttingPhotoCard frame={frame} fps={fps} />
    {SLICE_SET.map((cfg) => (
      <RealSlice key={cfg.src} cfg={cfg} frame={frame} fps={fps} />
    ))}
  </>
);

// =============================================================================
// CENA 5 — ProductPackage (5.42-7s)
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
        }}
      />
    </>
  );
};

// =============================================================================
// CENA 6 — FinalDish (7-8.75s)
// Foto real (fatias no prato amarelo, pano xadrez, folhas de louro) como
// "photo card" — push-in elegante. Embalagem some desfocada ao fundo, como
// contexto de marca.
// =============================================================================
const PLATE_PHOTO = { src: 'tofu-plate.jpg', w: 1080, h: 1200 };
const PLATE_DISPLAY_W = 760;

const FinalDish: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - S6_START;
  const s = spring({ frame: local, fps, config: { damping: 13, mass: 0.8, stiffness: 130 } });
  const scale = interpolate(s, [0, 1], [0.92, 1]);
  const opacity = interpolate(local, [0, 18], [0, 1], clampCfg);
  const pushIn = interpolate(local, [0, 105], [1, 1.05], { ...clampCfg, easing: Easing.inOut(Easing.sin) });

  const w = PLATE_DISPLAY_W * scale * pushIn;
  const h = w * (PLATE_PHOTO.h / PLATE_PHOTO.w);

  return (
    <>
      {/* Embalagem desfocada ao fundo, apenas como contexto de marca. */}
      <Img
        src={staticFile(`uai-tofu/${BOX.src}`)}
        style={{
          position: 'absolute',
          left: 70,
          top: STAGE_CY + 470,
          width: 170,
          height: 170 * (BOX.h / BOX.w),
          opacity: opacity * 0.3,
          filter: 'blur(8px)',
        }}
      />
      <ContactShadow cx={STAGE_CX} cy={STAGE_CY + h / 2 - 14} w={w * 0.85} opacity={opacity * 0.32} />
      <div
        style={{
          position: 'absolute',
          left: STAGE_CX - w / 2,
          top: STAGE_CY - h / 2,
          width: w,
          height: h,
          opacity,
          borderRadius: 26,
          overflow: 'hidden',
          boxShadow: '0 34px 60px -20px rgba(60,35,10,0.42)',
        }}
      >
        <Img
          src={staticFile(`uai-tofu/${PLATE_PHOTO.src}`)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </>
  );
};

// =============================================================================
// CENA 7 — LogoReveal (8.75-10s)
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
// Composição principal — orquestra o crossfade entre as 6 cenas.
// =============================================================================
export const UaiSoyToProduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulso de blur na transição grão -> bloco (substitui a antiga cena de
  // "textura cremosa"): as duas fotos reais se cruzam com um leve desfoque
  // no meio do dissolve, sugerindo transformação sem inventar conteúdo.
  const blend13 = transitionBlur(frame, S3_START, XFADE, 7);

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <FontFace />
      <Background frame={frame} />

      <AbsoluteFill
        style={{ opacity: crossfade(frame, S1_START, S1_END, true, false), filter: `blur(${blend13}px)` }}
      >
        <SoybeanGrains frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{ opacity: crossfade(frame, S3_START, S3_END, false, false), filter: `blur(${blend13}px)` }}
      >
        <TofuBlock frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S4_START, S4_END, false, false) }}>
        <TofuSlices frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S5_START, S5_END, false, false) }}>
        <ProductPackage frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S6_START, S6_END, false, false) }}>
        <FinalDish frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S7_START, DURATION, false, true) }}>
        <LogoReveal frame={frame} fps={fps} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
