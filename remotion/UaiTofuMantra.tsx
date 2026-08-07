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
// UAI TOFU — "O Mantra"
// Vertical 9:16, 30fps, 225 frames (7.5s).
//
// Estrutura (seguindo a referência "Royal Tempeh" enviada pelo cliente):
//   Cena 1 — Manifesto tipográfico (Lato Black, 3 frases empilhadas)
//   Cena 2 — As palavras se fundem num ponto central; dessa fusão nascem a
//            embalagem real + 6 fatias reais ao redor, juntas (sem uma fase
//            separada de fatias "flutuando sozinhas")
//   Cena 3 — Embalagem + fatias diminuem de tamanho juntas (saída suave,
//            sem giro) e a logo real surge desse mesmo encolhimento
//   Cena 4 — Hold da logo, dissolve pra preto
//
// O fundo troca de verde profundo (texto) para o amarelo da marca (produto e
// logo) numa única transição de cor compartilhada, na mesma janela da fusão.
// =============================================================================

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 225;

const CENTER_X = 540;
const CENTER_Y = 960;

// ---- Timeline (frames @ 30fps) --------------------------------------------
const S1_START = 0;
const MERGE_START = 83; // palavras começam a colapsar pro centro
const MERGE_END = 100; // ponto de "fusão" — flash, embalagem+fatias nascem daqui
const REVEAL_HOLD_END = 158; // fim do respiro com embalagem+fatias paradas (mais fatias, mais tempo de leitura)
const EXIT_START = 158; // embalagem+fatias começam a diminuir juntas
const EXIT_END = 182; // encolhimento completo
const LOGO_START = 172; // a logo já começa a crescer antes do encolhimento terminar — crossfade suave, sem frame vazio
const DISSOLVE_START = 210;

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---- Paleta técnica --------------------------------------------------------
const BG_DEEP = '#183D24'; // verde profundo — cena do texto
const BG_DEEP_RGB: [number, number, number] = [24, 61, 36];
const BG_YELLOW = '#FBBD3C'; // amarelo da marca — cena do produto/logo (mesmo tom já aprovado em outras peças UAI Tofu)
const BG_YELLOW_RGB: [number, number, number] = [251, 189, 60];
const YELLOW = '#FFD23F'; // amarelo de destaque tipográfico (mais vibrante que o bg)
const CREAM = '#FDFBF7';
const SHADOW = '#0B1F11';

function lerpColor(t: number, c0: [number, number, number], c1: [number, number, number]) {
  const r = Math.round(interpolate(t, [0, 1], [c0[0], c1[0]], clampCfg));
  const g = Math.round(interpolate(t, [0, 1], [c0[1], c1[1]], clampCfg));
  const b = Math.round(interpolate(t, [0, 1], [c0[2], c1[2]], clampCfg));
  return `rgb(${r}, ${g}, ${b})`;
}

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

// =============================================================================
// CENA 1 — O Mantra do Tofu (0-100)
// Tipografia de impacto na fonte da marca (Lato Black), com espaçamento
// generoso entre letras e linhas. As 3 frases entram em sequência, cada uma
// pousando abaixo da anterior — nada desaparece durante a leitura. No fim
// (83-100), o bloco inteiro colapsa pro centro — a "fusão" que dá origem à
// Cena 2.
// =============================================================================
const LINE_SIZE = 92;
const LINE_GAP = 44;

type WordSpec = { text: string; color: string };
type LineSpec = { words: WordSpec[]; delay: number };

const LINES: LineSpec[] = [
  { words: [{ text: 'EU', color: CREAM }, { text: 'COMO', color: YELLOW }, { text: 'TOFU', color: CREAM }], delay: 0 },
  { words: [{ text: 'EU', color: CREAM }, { text: 'AMO', color: YELLOW }, { text: 'TOFU', color: CREAM }], delay: 20 },
  { words: [{ text: 'EU', color: CREAM }, { text: 'VIVO', color: YELLOW }, { text: 'TOFU', color: CREAM }], delay: 40 },
];

// Grade cinética amarela bem sutil, com uma deriva contínua e lenta — só
// pra a cena nunca ficar estática, sem depender de movimento de câmera.
const KineticGrid: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = (frame * 0.25) % 96;
  const opacity = 0.05 * interpolate(frame, [MERGE_START, MERGE_END], [1, 0], clampCfg);
  if (opacity <= 0) return null;
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}>
      {Array.from({ length: Math.ceil(HEIGHT / 96) + 1 }).map((_, i) => (
        <line key={i} x1={0} y1={i * 96 - drift} x2={WIDTH} y2={i * 96 - drift} stroke={YELLOW} strokeWidth={1} />
      ))}
    </svg>
  );
};

// Entrada polida — o mesmo princípio de movimento já aprovado pela marca em
// "UAI, é ciência!": leve translateY + skew + scale, com spring suave. Nada
// de blur/scale agressivo — o impacto vem do peso da fonte, não do efeito.
const MantraWord: React.FC<{ w: WordSpec; frame: number; delay: number; fps: number }> = ({ w, frame, delay, fps }) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, mass: 1, stiffness: 110 } });
  const translateY = interpolate(s, [0, 1], [46, 0]);
  const skewY = interpolate(s, [0, 1], [2.5, 0]);
  const scale = interpolate(s, [0, 1], [0.92, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1], clampCfg);
  return (
    <span
      style={{
        display: 'inline-block',
        marginRight: '0.32em',
        color: w.color,
        transform: `translateY(${translateY}px) skewY(${skewY}deg) scale(${scale})`,
        opacity,
      }}
    >
      {w.text}
    </span>
  );
};

const MantraLine: React.FC<{ line: LineSpec; frame: number; fps: number; top: number }> = ({ line, frame, fps, top }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top,
      textAlign: 'center',
      fontFamily,
      fontWeight: 900,
      fontSize: LINE_SIZE,
      lineHeight: 1.05,
      letterSpacing: -0.5,
    }}
  >
    {line.words.map((w, i) => (
      <MantraWord key={i} w={w} frame={frame} delay={line.delay + i * 3} fps={fps} />
    ))}
  </div>
);

const MantraScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const blockHeight = LINES.length * LINE_SIZE * 1.05 + (LINES.length - 1) * LINE_GAP;
  const firstTop = CENTER_Y - blockHeight / 2;

  // Fusão: o bloco inteiro (as 3 frases já formadas) colapsa pro centro da
  // tela — encolhe, borra e escurece — em vez de simplesmente sumir. É desse
  // colapso que a Cena 2 nasce.
  const mergeT = interpolate(frame, [MERGE_START, MERGE_END], [0, 1], { ...clampCfg, easing: Easing.in(Easing.cubic) });
  const mergeScale = interpolate(mergeT, [0, 1], [1, 0.08]);
  const mergeBlur = interpolate(mergeT, [0, 1], [0, 14]);
  const mergeOpacity = interpolate(mergeT, [0, 1], [1, 0]);

  return (
    <AbsoluteFill>
      <KineticGrid frame={frame} />
      <AbsoluteFill
        style={{
          transform: `scale(${mergeScale})`,
          transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
          filter: `blur(${mergeBlur}px)`,
          opacity: mergeOpacity,
        }}
      >
        {LINES.map((line, i) => (
          <MantraLine key={i} line={line} frame={frame} fps={fps} top={firstTop + i * (LINE_SIZE * 1.05 + LINE_GAP)} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 2 — Fusão -> Embalagem + Fatias (83-158)
// No instante da fusão (MERGE_END), um flash rápido marca a transformação: a
// embalagem real e 6 fatias reais nascem juntas do mesmo ponto central,
// crescendo e assentando com uma entrada mais pesada/suave (menos "pop",
// mais assentamento) — igual à referência (produto + peças aparecem de uma
// vez, não em duas fases separadas).
// =============================================================================
const BOX = { src: 'box.png', w: 557, h: 705 };
const BOX_DISPLAY_W = 540;

type FlankCfg = { src: string; w: number; h: number; angleDeg: number; radiusMul: number; rot: number };

// 6 fatias reais (todas as que temos) espalhadas ao redor da embalagem em
// ângulos e raios levemente irregulares — orgânico, como na referência, não
// um anel perfeitamente simétrico.
const FLANK: FlankCfg[] = [
  { src: 'slice1.png', w: 362, h: 300, angleDeg: -152, radiusMul: 1.0, rot: -16 },
  { src: 'slice2.png', w: 368, h: 206, angleDeg: -95, radiusMul: 0.82, rot: 6 },
  { src: 'slice3.png', w: 334, h: 272, angleDeg: -32, radiusMul: 1.05, rot: 12 },
  { src: 'slice4.png', w: 256, h: 346, angleDeg: 30, radiusMul: 0.95, rot: -8 },
  { src: 'slice5.png', w: 286, h: 313, angleDeg: 98, radiusMul: 1.0, rot: -10 },
  { src: 'slice6.png', w: 388, h: 286, angleDeg: 155, radiusMul: 1.05, rot: 14 },
];
const FLANK_DISPLAY_LONG = 260;
const FLANK_BASE_RADIUS = 400;

// Grupo único (embalagem + fatias): entra assentando com peso (spring mais
// amortecida, sem "pop") e sai encolhendo de volta pro centro, suave —
// "saída quádrupla" simplificada pra um encolhimento simétrico: escala +
// blur + opacity, sem necessidade de posição (o próprio encolhimento pro
// centro já é a direção do movimento).
const RevealScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - MERGE_END), fps, config: { damping: 16, mass: 1.15, stiffness: 95 } });
  const entranceScale = interpolate(s, [0, 1], [0.08, 1]);
  const entranceOpacity = interpolate(frame, [MERGE_END - 2, MERGE_END + 10], [0, 1], clampCfg);
  const entranceBlur = interpolate(s, [0, 1], [9, 0]);

  // Encolhimento suave de saída — grupo inteiro (embalagem + fatias) junto.
  const exitT = interpolate(frame, [EXIT_START, EXIT_END], [0, 1], { ...clampCfg, easing: Easing.inOut(Easing.cubic) });
  const exitScale = interpolate(exitT, [0, 1], [1, 0.18]);
  const exitOpacity = interpolate(exitT, [0.35, 1], [1, 0]);
  const exitBlur = interpolate(exitT, [0, 1], [0, 10]);

  const groupScale = entranceScale * exitScale;
  const groupOpacity = entranceOpacity * exitOpacity;
  const groupBlur = entranceBlur + exitBlur;

  const shadowOpacity = interpolate(frame, [MERGE_END, MERGE_END + 16], [0, 0.28], clampCfg) * interpolate(exitT, [0, 1], [1, 0]);

  const w = BOX_DISPLAY_W;
  const h = w * (BOX.h / BOX.w);

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${groupScale})`,
        transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
        opacity: groupOpacity,
        filter: `blur(${groupBlur}px)`,
      }}
    >
      {FLANK.map((f, i) => {
        const fs = spring({ frame: Math.max(0, frame - MERGE_END - 4 - i * 3), fps, config: { damping: 16, mass: 0.9, stiffness: 95 } });
        const fScale = interpolate(fs, [0, 1], [0.18, 1]);
        const dw = f.w * (FLANK_DISPLAY_LONG / Math.max(f.w, f.h)) * fScale;
        const dh = f.h * (FLANK_DISPLAY_LONG / Math.max(f.w, f.h)) * fScale;
        const angleRad = (f.angleDeg * Math.PI) / 180;
        const radius = FLANK_BASE_RADIUS * f.radiusMul * fScale;

        // Micro-movimento vivo durante o respiro — cada fatia com fase e
        // frequência próprias, envelope suave na entrada/saída pra não dar
        // um "salto" quando o balanço liga/desliga.
        const idlePhase = i * 1.35 + 0.6;
        const idleEnv = interpolate(
          frame,
          [MERGE_END + 26, MERGE_END + 40, EXIT_START - 10, EXIT_START],
          [0, 1, 1, 0],
          clampCfg
        );
        const idleX = idleEnv * Math.sin(frame * 0.045 + idlePhase) * 7;
        const idleY = idleEnv * Math.sin(frame * 0.037 + idlePhase + 1.4) * 9;
        const idleRot = idleEnv * Math.sin(frame * 0.03 + idlePhase + 0.7) * 3;

        const fx = CENTER_X + Math.cos(angleRad) * radius + idleX;
        const fy = CENTER_Y + Math.sin(angleRad) * radius * 0.86 + idleY;
        const fOpacity = interpolate(fs, [0, 1], [0, 1]);
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
              opacity: fOpacity * 0.96,
              transform: `rotate(${f.rot + idleRot}deg)`,
            }}
          />
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: CENTER_X - w * 0.4,
          top: CENTER_Y + h * 0.44,
          width: w * 0.8,
          height: 36,
          opacity: shadowOpacity,
          background: `radial-gradient(ellipse at center, ${SHADOW} 0%, transparent 72%)`,
          filter: 'blur(14px)',
        }}
      />
      <Img
        src={staticFile(`uai-tofu/${BOX.src}`)}
        style={{
          position: 'absolute',
          left: CENTER_X - w / 2,
          top: CENTER_Y - h / 2,
          width: w,
          height: h,
        }}
      />
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 4 — Logo (176-225)
// A embalagem morfa na logo real (fade + escala, flash na virada), fica em
// hold, e dissolve pra preto no final.
// =============================================================================
const LOGO = { src: 'logo.png', w: 460, h: 376 };
const LOGO_DISPLAY_W = 420;

const LogoScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local = frame - LOGO_START;
  const s = spring({ frame: Math.max(0, local), fps, config: { damping: 16, mass: 1, stiffness: 95 } });
  const scale = interpolate(s, [0, 1], [0.55, 1]);
  const opacity = interpolate(frame, [LOGO_START, LOGO_START + 18], [0, 1], clampCfg);

  const glow = interpolate(local, [0, 18, 60], [0, 0.4, 0.24], clampCfg);

  const w = LOGO_DISPLAY_W * scale;
  const h = w * (LOGO.h / LOGO.w);

  return (
    <>
      <AbsoluteFill
        style={{
          opacity: glow,
          mixBlendMode: 'multiply',
          background: `radial-gradient(circle at 50% 50%, #ffffff 0%, ${BG_YELLOW} 55%, transparent 75%)`,
        }}
      />
      <Img
        src={staticFile(`uai-tofu/${LOGO.src}`)}
        style={{
          position: 'absolute',
          left: CENTER_X - w / 2,
          top: CENTER_Y - h / 2,
          width: w,
          height: h,
          opacity,
        }}
      />
    </>
  );
};

// =============================================================================
// Composição principal
// =============================================================================
export const UaiTofuMantra: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fundo compartilhado: verde profundo (texto) -> amarelo da marca (produto,
  // giro, logo), numa única transição de cor na janela da fusão.
  const colorT = interpolate(frame, [MERGE_START, MERGE_END + 8], [0, 1], clampCfg);
  const bgColor = lerpColor(colorT, BG_DEEP_RGB, BG_YELLOW_RGB);

  // Flash da fusão texto -> produto.
  const mergeFlash = interpolate(frame, [MERGE_END - 3, MERGE_END + 2, MERGE_END + 12], [0, 0.8, 0], clampCfg);

  const dissolve = interpolate(frame, [DISSOLVE_START, DURATION], [0, 1], clampCfg);

  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: bgColor }}>
      <FontFace />

      <MantraScene frame={frame} fps={fps} />

      <AbsoluteFill style={{ opacity: interpolate(frame, [MERGE_END - 4, MERGE_END + 4], [0, 1], clampCfg) }}>
        <RevealScene frame={frame} fps={fps} />
      </AbsoluteFill>

      {/* A logo cresce a partir do mesmo encolhimento da embalagem+fatias —
          crossfade suave, sem flash, sem giro. */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [LOGO_START - 2, LOGO_START + 8], [0, 1], clampCfg) }}>
        <LogoScene frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: CREAM, opacity: mergeFlash, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: dissolve }} />
    </AbsoluteFill>
  );
};
