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
// Vertical 9:16, 30fps, 347 frames (~11.6s).
//
// Estrutura (seguindo a referência "Royal Tempeh" enviada pelo cliente):
//   Cena 1 — Manifesto tipográfico (Lato Black, 3 frases empilhadas)
//   Cena 2 — As palavras se fundem num ponto central; a embalagem nasce no
//            centro e 16 fatias reais se espalham preenchendo a tela toda,
//            balançando o tempo todo (nunca "congelam")
//   Cena 3a — As fatias voam de volta, uma a uma, pra DENTRO da embalagem —
//             encolhendo, desfocando e desaparecendo POR TRÁS dela (a
//             embalagem fica por cima, absorvendo cada fatia)
//   Cena 3b — SÓ DEPOIS que a última fatia sumiu a embalagem, sozinha,
//             encolhe até desaparecer por completo
//   Cena 4 — SÓ DEPOIS que a embalagem sumiu a logo real cresce, fica em
//            hold, e dissolve pra preto — tudo sequencial, sem crossfade
//
// O fundo troca de verde profundo (texto) para o amarelo da marca (produto e
// logo) numa única transição de cor compartilhada, na mesma janela da fusão.
//
// Duração estendida de 225 -> 347 frames (7.5s -> ~11.6s) ao longo das
// iterações: preencher a tela inteira de fatias e depois dar tempo pra cada
// fase da saída (fatias -> caixinha -> logo) terminar por completo antes da
// próxima começar são beats que precisam de espaço pra respirar — não
// cabiam no tempo antigo sem parecer apressado.
// =============================================================================

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 347;

const CENTER_X = 540;
const CENTER_Y = 960;

// ---- Timeline (frames @ 30fps) --------------------------------------------
const S1_START = 0;
const MERGE_START = 83; // palavras começam a colapsar pro centro
const MERGE_END = 100; // ponto de "fusão" — flash, embalagem+fatias nascem daqui
const CONVERGE_START = 210; // fatias começam a voar de volta pra dentro da embalagem, por trás dela
const CONVERGE_STAGGER = 1.2;
const CONVERGE_TRAVEL = 22;
const CONVERGE_END = CONVERGE_START + 15 * CONVERGE_STAGGER + CONVERGE_TRAVEL; // última fatia (índice 15) absorvida
const BOX_EXIT_START = CONVERGE_END + 2; // SÓ DEPOIS de todas as fatias sumidas a caixinha encolhe sozinha
const BOX_EXIT_END = BOX_EXIT_START + 22;
const LOGO_START = BOX_EXIT_END + 3; // só cresce DEPOIS que a caixinha sumiu por completo
const DISSOLVE_START = LOGO_START + 45; // tempo de sobra pra logo assentar (spring) e ficar em hold

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
// CENA 2 — Fusão -> Embalagem no centro + 16 fatias preenchendo a tela
// No instante da fusão (MERGE_END), um flash marca a transformação: a
// embalagem nasce no centro e 16 fatias reais (as 6 fotos reais, reaproveitadas
// em ângulos/posições diferentes — nunca fabricamos foto nova) se espalham
// preenchendo a tela inteira, cada uma com seu próprio balanço, até o
// instante em que começam a voltar.
//
// CENA 3a — Sucção (CONVERGE_START -> CONVERGE_END)
// As fatias voam de volta, uma a uma, pra DENTRO da embalagem — encolhendo,
// desfocando e sumindo POR TRÁS dela (a embalagem renderiza por cima nesse
// trecho, então cada fatia parece ser literalmente absorvida por ela).
//
// CENA 3b — Saída da embalagem (BOX_EXIT_START -> BOX_EXIT_END)
// SÓ DEPOIS que a última fatia já foi absorvida, a embalagem — sozinha,
// sem mais nada na tela — encolhe até desaparecer por completo.
// =============================================================================
const BOX = { src: 'box.png', w: 557, h: 705 };
const BOX_DISPLAY_W = 540;

// Embalagem: entra assentando com peso (spring amortecida, sem "pop") no
// centro, fica parada durante toda a Cena 2 e a sucção das fatias (ficando
// por cima delas nesse trecho), e só encolhe/some sozinha a partir de
// BOX_EXIT_START, quando a tela já está livre de fatias.
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
// embalagem fica) livre. As 4 extras usam rotação e tamanho no mesmo
// intervalo orgânico das 12 originais (nunca 0° "deitada" nem um tamanho
// destoante) pra não quebrar o ritmo e parecer um remendo. As 6 fotos reais
// se repetem (2-3x cada, em ângulos/tamanhos diferentes) — nunca inventamos
// uma fatia nova. Posições e tamanhos (long) verificados numericamente: sem
// sair do canvas e sem sobrepor a caixinha uma vez assentadas.
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
  { srcIndex: 0, x: 510, y: 420, rot: -14, long: 230 },
  { srcIndex: 5, x: 460, y: 1610, rot: -4, long: 190 },
  { srcIndex: 1, x: 130, y: 1170, rot: -6, long: 200 },
  { srcIndex: 1, x: 920, y: 1150, rot: -4, long: 165 },
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

      // Sucção: cada fatia é puxada de volta pro centro (pra dentro da
      // embalagem, que renderiza por cima nesse trecho), acelerando
      // (Easing.in.exp — sensação de "sugada") e encolhendo/desfocando/
      // sumindo ao longo do caminho. Mesma ordem/stagger da entrada.
      const convergeDelay = CONVERGE_START + i * CONVERGE_STAGGER;
      const ct = interpolate(frame, [convergeDelay, convergeDelay + CONVERGE_TRAVEL], [0, 1], {
        ...clampCfg,
        easing: Easing.in(Easing.exp),
      });

      // Balanço vivo o tempo todo — fase e frequência próprias por fatia,
      // entra suave e continua balançando até bem perto de ser sugada (sem
      // "congelar" antes), acompanhando o stagger de cada fatia em vez de
      // um corte fixo global.
      const idlePhase = i * 1.24 + 0.5;
      const idleEnv = interpolate(
        frame,
        [MERGE_END + 30, MERGE_END + 44, convergeDelay - 4, convergeDelay + 4],
        [0, 1, 1, 0],
        clampCfg,
      );
      const idleX = idleEnv * Math.sin(frame * 0.032 + idlePhase) * 7;
      const idleY = idleEnv * Math.sin(frame * 0.026 + idlePhase + 1.4) * 11;
      const idleRot = idleEnv * Math.sin(frame * 0.022 + idlePhase + 0.7) * 3.5;

      const baseX = ex + idleX;
      const baseY = ey + idleY;
      const x = interpolate(ct, [0, 1], [baseX, CENTER_X] as number[]);
      const y = interpolate(ct, [0, 1], [baseY, CENTER_Y] as number[]);
      const convergeScale = interpolate(ct, [0, 1], [1, 0.1]);
      const convergeOpacity = interpolate(ct, [0.55, 1], [1, 0]);
      const convergeBlur = interpolate(ct, [0.4, 1], [0, 7]);

      const scale = entranceScale * convergeScale;
      const w = cfg.w * (f.long / Math.max(cfg.w, cfg.h)) * scale;
      const h = cfg.h * (f.long / Math.max(cfg.w, cfg.h)) * scale;
      const rot = f.rot + idleRot;
      const opacity = entranceOpacity * convergeOpacity;

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
            filter: convergeBlur > 0.1 ? `blur(${convergeBlur}px)` : undefined,
          }}
        />
      );
    })}
  </>
);

// =============================================================================
// CENA 4 — Logo (entra só depois que a Cena 3 termina por completo)
// A logo real cresce no centro, fica em hold, e dissolve pra preto no final.
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

      {/* SliceField antes, BoxScene depois: a embalagem renderiza por cima
          das fatias, então na sucção (Cena 3a) elas somem visualmente por
          trás dela, como se estivessem sendo absorvidas. */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [MERGE_END - 4, MERGE_END + 4], [0, 1], clampCfg) }}>
        <SliceField frame={frame} fps={fps} />
        <BoxScene frame={frame} fps={fps} />
      </AbsoluteFill>

      {/* A logo só entra depois que embalagem+fatias já sumiram por
          completo — sequencial, sem crossfade, sem flash, sem giro. */}
      <AbsoluteFill style={{ opacity: interpolate(frame, [LOGO_START - 2, LOGO_START + 8], [0, 1], clampCfg) }}>
        <LogoScene frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: CREAM, opacity: mergeFlash, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: dissolve }} />
    </AbsoluteFill>
  );
};
