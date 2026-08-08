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
//   Cena 2 — As palavras se fundem num ponto central; a embalagem nasce no
//            centro e 12 fatias reais se espalham preenchendo a tela toda,
//            balançando levemente
//   Cena 3 — As fatias e a embalagem somem JUNTAS (encolhendo/desfocando no
//            próprio lugar, com um stagger mínimo entre as fatias)
//   Cena 4 — A logo real surge desse encolhimento, hold, dissolve pra preto
//
// O fundo troca de verde profundo (texto) para o amarelo da marca (produto e
// logo) numa única transição de cor compartilhada, na mesma janela da fusão.
//
// Duração estendida de 225 -> 300 frames (7.5s -> 10s): preencher a tela
// inteira de fatias e depois convergi-las pra dentro da caixa é um beat bem
// mais rico que precisa de espaço pra respirar — não cabia no tempo antigo
// sem parecer apressado.
// =============================================================================

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 300;

const CENTER_X = 540;
const CENTER_Y = 960;

// ---- Timeline (frames @ 30fps) --------------------------------------------
const S1_START = 0;
const MERGE_START = 83; // palavras começam a colapsar pro centro
const MERGE_END = 100; // ponto de "fusão" — flash, embalagem+fatias nascem daqui
const BOX_EXIT_START = 236; // embalagem e fatias começam a sumir JUNTAS
const BOX_EXIT_END = 258;
const EXIT_STAGGER = 0.6; // stagger mínimo entre fatias na saída — ainda lê como "junto", não em fila
const LOGO_START = 250; // a logo já começa a crescer antes do encolhimento terminar — crossfade suave
const DISSOLVE_START = 285;

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
// CENA 2 — Fusão -> Embalagem no centro + 12 fatias preenchendo a tela
// (83-236)
// No instante da fusão (MERGE_END), um flash marca a transformação: a
// embalagem nasce no centro e 12 fatias reais (as 6 fotos reais, reaproveitadas
// em ângulos/posições diferentes — nunca fabricamos foto nova) se espalham
// preenchendo a tela inteira, cada uma com seu próprio balanço, até o
// instante em que tudo começa a sumir.
//
// CENA 3 — Saída em conjunto (236-258)
// A embalagem e as 12 fatias somem JUNTAS — cada uma encolhe/desfoca no seu
// próprio lugar (nada voa pro centro), com um stagger de poucos frames entre
// elas pra não parecer um corte seco em bloco único.
// =============================================================================
const BOX = { src: 'box.png', w: 557, h: 705 };
const BOX_DISPLAY_W = 540;

// Embalagem: entra assentando com peso (spring amortecida, sem "pop") no
// centro, fica parada durante toda a Cena 2, e encolhe/some junto com as
// fatias a partir de BOX_EXIT_START.
const BoxScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - MERGE_END), fps, config: { damping: 16, mass: 1.15, stiffness: 95 } });
  const entranceScale = interpolate(s, [0, 1], [0.08, 1]);
  const entranceOpacity = interpolate(frame, [MERGE_END - 2, MERGE_END + 10], [0, 1], clampCfg);
  const entranceBlur = interpolate(s, [0, 1], [9, 0]);

  const exitT = interpolate(frame, [BOX_EXIT_START, BOX_EXIT_END], [0, 1], { ...clampCfg, easing: Easing.inOut(Easing.cubic) });
  const exitScale = interpolate(exitT, [0, 1], [1, 0.18]);
  const exitOpacity = interpolate(exitT, [0.35, 1], [1, 0]);
  const exitBlur = interpolate(exitT, [0, 1], [0, 10]);

  const scale = entranceScale * exitScale;
  const opacity = entranceOpacity * exitOpacity;
  const blur = entranceBlur + exitBlur;

  const shadowOpacity = interpolate(frame, [MERGE_END, MERGE_END + 16], [0, 0.28], clampCfg) * interpolate(exitT, [0, 1], [1, 0]);

  const w = BOX_DISPLAY_W;
  const h = w * (BOX.h / BOX.w);

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
        opacity,
        filter: `blur(${blur}px)`,
      }}
    >
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

type SliceSrc = { src: string; w: number; h: number };
const SLICE_SRCS: SliceSrc[] = [
  { src: 'slice1.png', w: 362, h: 300 },
  { src: 'slice2.png', w: 368, h: 206 },
  { src: 'slice3.png', w: 334, h: 272 },
  { src: 'slice4.png', w: 256, h: 346 },
  { src: 'slice5.png', w: 286, h: 313 },
  { src: 'slice6.png', w: 388, h: 286 },
];

type FieldCfg = { srcIndex: number; x: number; y: number; rot: number; long: number };

// 16 posições espalhadas pela tela INTEIRA (não só ao redor da caixa) — a
// grade de 3 colunas x 5 linhas de base (12 fatias) mais 4 fatias extras nos
// vãos que sobravam vazios entre as fileiras, sempre com o miolo (onde a
// embalagem fica) livre. As 6 fotos reais se repetem (2-3x cada, em
// ângulos/tamanhos diferentes) — nunca inventamos uma fatia nova. Posições e
// tamanhos (long) verificados numericamente: sem sair do canvas e sem
// sobrepor a caixinha uma vez assentadas.
const FIELD: FieldCfg[] = [
  { srcIndex: 0, x: 208, y: 215, rot: -18, long: 236 },
  { srcIndex: 1, x: 540, y: 195, rot: 8, long: 244 },
  { srcIndex: 2, x: 872, y: 215, rot: 14, long: 238 },
  { srcIndex: 3, x: 173, y: 560, rot: -10, long: 248 },
  { srcIndex: 4, x: 907, y: 560, rot: 16, long: 232 },
  { srcIndex: 5, x: 158, y: 965, rot: -14, long: 250 },
  { srcIndex: 0, x: 922, y: 965, rot: 10, long: 236 },
  { srcIndex: 1, x: 173, y: 1370, rot: -8, long: 240 },
  { srcIndex: 2, x: 540, y: 1390, rot: 18, long: 234 },
  { srcIndex: 3, x: 907, y: 1370, rot: -16, long: 246 },
  { srcIndex: 4, x: 208, y: 1710, rot: 12, long: 230 },
  { srcIndex: 5, x: 872, y: 1710, rot: -10, long: 240 },
  { srcIndex: 0, x: 500, y: 380, rot: 0, long: 190 },
  { srcIndex: 5, x: 620, y: 1600, rot: 0, long: 180 },
  { srcIndex: 1, x: 140, y: 1160, rot: 0, long: 190 },
  { srcIndex: 2, x: 980, y: 1150, rot: 0, long: 120 },
];

const SliceField: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => (
  <>
    {FIELD.map((f, i) => {
      const cfg = SLICE_SRCS[f.srcIndex];

      // Entrada: nasce no centro (ponto da fusão) e voa até a posição final,
      // com stagger — igual ao "soco na tela" da tipografia, só que espacial.
      const es = spring({ frame: Math.max(0, frame - MERGE_END - 3 - i * 2.4), fps, config: { damping: 16, mass: 0.9, stiffness: 90 } });
      const entranceScale = interpolate(es, [0, 1], [0.12, 1]);
      const ex = interpolate(es, [0, 1], [CENTER_X, f.x] as number[]);
      const ey = interpolate(es, [0, 1], [CENTER_Y, f.y] as number[]);
      const entranceOpacity = interpolate(es, [0, 1], [0, 1]);

      // Balanço vivo durante todo o respiro — fase e frequência próprias por
      // fatia, envelope suave na entrada e desligando pouco antes da saída
      // começar (pra não brigar com o encolhimento da saída).
      const idlePhase = i * 1.24 + 0.5;
      const idleEnv = interpolate(
        frame,
        [MERGE_END + 30, MERGE_END + 44, BOX_EXIT_START - 14, BOX_EXIT_START],
        [0, 1, 1, 0],
        clampCfg,
      );
      const idleX = idleEnv * Math.sin(frame * 0.032 + idlePhase) * 7;
      const idleY = idleEnv * Math.sin(frame * 0.026 + idlePhase + 1.4) * 11;
      const idleRot = idleEnv * Math.sin(frame * 0.022 + idlePhase + 0.7) * 3.5;

      // Saída em conjunto: a fatia encolhe e desfoca NO PRÓPRIO LUGAR, na
      // mesma janela (BOX_EXIT_START -> BOX_EXIT_END) que a embalagem usa
      // pra sumir — nada voa pro centro. Um stagger de frações de segundo
      // entre fatias evita o corte seco de "tudo em bloco único".
      const exitDelay = i * EXIT_STAGGER;
      const exitT = interpolate(frame, [BOX_EXIT_START + exitDelay, BOX_EXIT_END + exitDelay], [0, 1], {
        ...clampCfg,
        easing: Easing.inOut(Easing.cubic),
      });
      const exitScale = interpolate(exitT, [0, 1], [1, 0.15]);
      const exitOpacity = interpolate(exitT, [0.35, 1], [1, 0]);
      const exitBlur = interpolate(exitT, [0, 1], [0, 8]);

      const x = ex + idleX;
      const y = ey + idleY;
      const scale = entranceScale * exitScale;
      const w = cfg.w * (f.long / Math.max(cfg.w, cfg.h)) * scale;
      const h = cfg.h * (f.long / Math.max(cfg.w, cfg.h)) * scale;
      const rot = f.rot + idleRot;
      const opacity = entranceOpacity * exitOpacity;

      return (
        <Img
          key={i}
          src={staticFile(`uai-tofu/${cfg.src}`)}
          style={{
            position: 'absolute',
            left: x - w / 2,
            top: y - h / 2,
            width: w,
            height: h,
            opacity: opacity * 0.96,
            transform: `rotate(${rot}deg)`,
            filter: exitBlur > 0.1 ? `blur(${exitBlur}px)` : undefined,
          }}
        />
      );
    })}
  </>
);

// =============================================================================
// CENA 4 — Logo (250-300)
// A logo real cresce a partir do mesmo ponto onde a embalagem encolheu, fica
// em hold, e dissolve pra preto no final.
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
        <BoxScene frame={frame} fps={fps} />
        <SliceField frame={frame} fps={fps} />
      </AbsoluteFill>

      {/* A logo cresce a partir do mesmo encolhimento da embalagem —
          crossfade suave, sem flash, sem giro. */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [LOGO_START - 2, LOGO_START + 8], [0, 1], clampCfg) }}>
        <LogoScene frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: CREAM, opacity: mergeFlash, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: dissolve }} />
    </AbsoluteFill>
  );
};
