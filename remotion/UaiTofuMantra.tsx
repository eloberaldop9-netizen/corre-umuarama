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
//            embalagem real + as fatias reais ao redor, juntas (sem uma fase
//            separada de fatias "flutuando sozinhas")
//   Cena 3 — Fatias somem, a embalagem dá um giro rápido no eixo Y com
//            motion blur (peso físico)
//   Cena 4 — A embalagem morfa na logo, hold final, dissolve pra preto
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
const REVEAL_HOLD_END = 148; // fim do respiro com embalagem+fatias paradas
const SLICES_EXIT_END = 158; // fatias já sumiram
const SPIN_START = 152;
const SPIN_END = 183; // giro no eixo Y completo — termina numa volta inteira (aterrissa de frente, não de perfil)
const LOGO_START = SPIN_END; // embalagem só começa a morfar na logo depois que o giro termina
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
// embalagem real e as 4 fatias reais nascem juntas do mesmo ponto central,
// crescendo e assentando — igual à referência (produto + peças aparecem de
// uma vez, não em duas fases separadas).
// =============================================================================
const BOX = { src: 'box.png', w: 557, h: 705 };
const BOX_DISPLAY_W = 560;

type FlankCfg = { src: string; w: number; h: number; ox: number; oy: number; rot: number };

// Mesmas 4 fatias reais e mesmo espírito de posicionamento (flanqueando a
// embalagem) já aprovados em "Da soja ao produto" — só reaproveitados aqui,
// escalados pro tamanho de caixa deste vídeo.
const FLANK: FlankCfg[] = [
  { src: 'slice1.png', w: 362, h: 300, ox: -1, oy: -0.72, rot: -16 },
  { src: 'slice6.png', w: 388, h: 286, ox: -0.92, oy: 0.78, rot: 10 },
  { src: 'slice3.png', w: 334, h: 272, ox: 1, oy: -0.76, rot: 12 },
  { src: 'slice5.png', w: 286, h: 313, ox: 1.05, oy: 0.74, rot: -10 },
];
const FLANK_DISPLAY_LONG = 220;

const RevealScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - MERGE_END), fps, config: { damping: 12, mass: 1, stiffness: 130 } });
  const scale = interpolate(s, [0, 1], [0.08, 1]);
  // A embalagem some bem no início do giro (Cena 3) — SpinBox assume dali em
  // diante, pra nunca haver duas caixas desenhadas ao mesmo tempo.
  const boxExit = interpolate(frame, [SPIN_START - 3, SPIN_START + 1], [1, 0], clampCfg);
  const opacity = interpolate(frame, [MERGE_END - 2, MERGE_END + 8], [0, 1], clampCfg) * boxExit;
  const blur = interpolate(s, [0, 1], [10, 0]);

  const shadowOpacity = interpolate(frame, [MERGE_END, MERGE_END + 16], [0, 0.28], clampCfg) * boxExit;

  // Fatias somem um pouco antes do giro começar — a composição afunila de
  // volta pra só a embalagem, preparando a Cena 3.
  const slicesExit = interpolate(frame, [REVEAL_HOLD_END, SLICES_EXIT_END], [1, 0], {
    ...clampCfg,
    easing: Easing.in(Easing.cubic),
  });

  const w = BOX_DISPLAY_W * scale;
  const h = w * (BOX.h / BOX.w);

  return (
    <>
      {FLANK.map((f, i) => {
        const fs = spring({ frame: Math.max(0, frame - MERGE_END - 4 - i * 3), fps, config: { damping: 15, mass: 0.85, stiffness: 100 } });
        const fScale = interpolate(fs, [0, 1], [0.15, 1]);
        const dw = f.w * (FLANK_DISPLAY_LONG / Math.max(f.w, f.h)) * fScale;
        const dh = f.h * (FLANK_DISPLAY_LONG / Math.max(f.w, f.h)) * fScale;
        const fx = CENTER_X + f.ox * (BOX_DISPLAY_W / 2 + 90) * fScale;
        const fy = CENTER_Y + f.oy * (BOX_DISPLAY_W * (BOX.h / BOX.w) / 2 + 70) * fScale;
        const fOpacity = interpolate(fs, [0, 1], [0, 1]) * slicesExit;
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
              transform: `rotate(${f.rot}deg)`,
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
          opacity,
          filter: `blur(${blur}px)`,
        }}
      />
    </>
  );
};

// =============================================================================
// CENA 3 — Giro (150-183)
// A embalagem dá um giro rápido e completo no eixo Y, com motion blur
// proporcional à velocidade angular (pico no meio do giro, zero nas pontas)
// e uma leve contração de peso — física real, não um "spin" de vetor.
// =============================================================================
const SpinBox: React.FC<{ frame: number }> = ({ frame }) => {
  const spinT = interpolate(frame, [SPIN_START, SPIN_END], [0, 1], { ...clampCfg, easing: Easing.inOut(Easing.cubic) });
  const spinDeg = spinT * 360 * 3; // 3 voltas inteiras — termina de frente (0°), pronta pro handoff com a logo
  const motionBlur = Math.sin(spinT * Math.PI) * 7;
  const squash = 1 - Math.sin(spinT * Math.PI) * 0.06;

  const w = BOX_DISPLAY_W * squash;
  const h = w * (BOX.h / BOX.w);

  return (
    <AbsoluteFill style={{ perspective: 1600 }}>
      <div
        style={{
          position: 'absolute',
          left: CENTER_X - w * 0.4,
          top: CENTER_Y + h * 0.44,
          width: w * 0.8,
          height: 36,
          opacity: 0.26,
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
          transform: `rotateY(${spinDeg}deg)`,
          filter: `blur(${motionBlur}px)`,
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
  const s = spring({ frame: Math.max(0, local - 4), fps, config: { damping: 13, mass: 0.9, stiffness: 120 } });
  const scale = interpolate(s, [0, 1], [0.82, 1]);
  const opacity = interpolate(frame, [LOGO_START + 2, LOGO_START + 16], [0, 1], clampCfg);

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

// Box -> Logo: fade cruzado dos dois com um flash branco rápido no meio,
// selando a "virada" — mesmo princípio do flash Cena1->Cena2.
const BoxToLogo: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const boxOpacity = interpolate(frame, [LOGO_START, LOGO_START + 9], [1, 0], clampCfg);
  const boxScale = interpolate(frame, [LOGO_START, LOGO_START + 9], [1, 1.08], clampCfg);
  const w = BOX_DISPLAY_W * boxScale;
  const h = w * (BOX.h / BOX.w);

  return (
    <>
      {boxOpacity > 0 && (
        <Img
          src={staticFile(`uai-tofu/${BOX.src}`)}
          style={{
            position: 'absolute',
            left: CENTER_X - w / 2,
            top: CENTER_Y - h / 2,
            width: w,
            height: h,
            opacity: boxOpacity,
            filter: `blur(${(1 - boxOpacity) * 6}px)`,
          }}
        />
      )}
      <LogoScene frame={frame} fps={fps} />
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
  // Flash da virada embalagem -> logo.
  const logoFlash = interpolate(frame, [LOGO_START - 2, LOGO_START + 2, LOGO_START + 10], [0, 0.6, 0], clampCfg);

  const dissolve = interpolate(frame, [DISSOLVE_START, DURATION], [0, 1], clampCfg);

  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: bgColor }}>
      <FontFace />

      <MantraScene frame={frame} fps={fps} />

      <AbsoluteFill style={{ opacity: interpolate(frame, [MERGE_END - 4, MERGE_END + 4], [0, 1], clampCfg) }}>
        <RevealScene frame={frame} fps={fps} />
      </AbsoluteFill>

      {/* Fade-in ao entrar no giro, fade-out logo depois que ele termina —
          entrega a caixa pra BoxToLogo sem nenhum frame com as duas juntas. */}
      <AbsoluteFill
        style={{
          opacity: interpolate(
            frame,
            [SPIN_START - 2, SPIN_START + 4, SPIN_END, SPIN_END + 6],
            [0, 1, 1, 0],
            clampCfg
          ),
        }}
      >
        <SpinBox frame={frame} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: interpolate(frame, [SPIN_END - 1, SPIN_END + 2], [0, 1], clampCfg) }}>
        <BoxToLogo frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: CREAM, opacity: mergeFlash, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ backgroundColor: CREAM, opacity: logoFlash, mixBlendMode: 'screen' }} />
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: dissolve }} />
    </AbsoluteFill>
  );
};
