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
// Vertical 9:16, 30fps, 225 frames (7.5s). Vídeo separado do "Da soja ao
// produto" — kinetic typography agressiva -> fatias reais em pseudo-3D ->
// embalagem real.
//
// Nota sobre a órbita das fatias: o briefing original pedia uma órbita de
// câmera de -45° a +45° ao redor das fatias. Nossas fatias são fotos reais
// de ângulo único (não há fotografia de múltiplos ângulos nem scan 3D) —
// perto de ±45° uma foto plana em CSS 3D fica visivelmente "de canto",
// fina como papel, o que reintroduziria exatamente o efeito falso que o
// cliente pediu pra tirar do vídeo anterior. Reduzimos a órbita para
// ±22° (ainda vende profundidade e parallax) e reforçamos com sombra
// projetada (drop-shadow no alpha real da fatia) e blur de profundidade.
// =============================================================================

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 225;

const CENTER_X = 540;
const CENTER_Y = 960;

// ---- Timeline (frames @ 30fps) --------------------------------------------
const S1_START = 0;
const S1_END = 90;
const S2_START = 83;
const S2_END = 170;
const S3_START = 163;

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---- Paleta técnica --------------------------------------------------------
const BG_DEEP = '#183D24';
const YELLOW = '#FFD23F';
const CREAM = '#FDFBF7';
const SHADOW = '#0B1F11';

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

// Crossfade curto (7f) entre cenas — a coreografia forte (z-dive, sucção,
// morph) já vive dentro de cada cena; isso só costura a emenda.
function crossfade(frame: number, start: number, end: number, overlap: number, isFirst: boolean, isLast: boolean) {
  if (isFirst && isLast) return 1;
  // O overlap já está embutido nos próprios frames de start/end de cada cena
  // (ex: Cena 2 começa em 83, Cena 1 termina em 90 — 7f de overlap). O fade
  // acontece DENTRO desse overlap já existente, não antes do "start".
  if (isFirst) return interpolate(frame, [end - overlap, end], [1, 0], clampCfg);
  if (isLast) return interpolate(frame, [start, start + overlap], [0, 1], clampCfg);
  return interpolate(frame, [start, start + overlap, end - overlap, end], [0, 1, 1, 0], clampCfg);
}

// =============================================================================
// CENA 1 — O Mantra do Tofu (0-90)
// Tipografia de impacto na fonte da marca (Lato Black), com espaçamento
// generoso entre letras e linhas. As 3 frases entram em sequência, cada uma
// pousando abaixo da anterior — nada desaparece, a frase final é a soma das
// três ("EU COMO TOFU" / "EU AMO TOFU" / "EU VIVO TOFU").
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
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
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

  return (
    <AbsoluteFill>
      <KineticGrid frame={frame} />
      {LINES.map((line, i) => (
        <MantraLine key={i} line={line} frame={frame} fps={fps} top={firstTop + i * (LINE_SIZE * 1.05 + LINE_GAP)} />
      ))}
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 2 — A Dança das Fatias (83-170)
// Fatias reais em pseudo-3D (CSS perspective/translateZ). Órbita ajustada
// para ±22° (ver nota no topo do arquivo). Saída: sucção magnética — todas
// convergem pro centro exato da tela e colidem.
// =============================================================================
type SliceCfg = { src: string; w: number; h: number; z: number; x: number; y: number; blurred?: boolean; phase: number };

// Profundidade e órbita reduzidas em relação ao briefing original (ver nota
// no topo do arquivo): com z tão extremo (+100 a -300) e órbita de 45°, o
// giro em torno do eixo Y empurra os elementos de trás bem para o lado
// (rotateY não afeta Y, mas combina x/z — objetos "atrás" varrem lateralmente
// mais que os da frente), e a composição lia como desalinhada/deslocada em
// vez de um cluster central com profundidade. Valores mais contidos mantêm
// o cluster centralizado o tempo todo.
const SLICES_3D: SliceCfg[] = [
  { src: 'slice1.png', w: 362, h: 300, z: 70, x: 0, y: -60, phase: 0 },
  { src: 'slice2.png', w: 368, h: 206, z: 10, x: -260, y: 90, phase: 1.4 },
  { src: 'slice4.png', w: 256, h: 346, z: -40, x: 260, y: 70, phase: 2.7 },
  { src: 'slice6.png', w: 388, h: 286, z: -140, x: 0, y: -270, blurred: true, phase: 4.1 },
];

const SLICE_DISPLAY_LONG = 400;

const Particle: React.FC<{ frame: number; x0: number; y0: number; size: number; phase: number }> = ({ frame, x0, y0, size, phase }) => {
  const drift = Math.sin(frame * 0.02 + phase) * 30;
  const rise = ((frame * 0.6 + phase * 40) % (HEIGHT + 200)) - 100;
  const opacity = 0.35 + 0.35 * Math.sin(frame * 0.05 + phase);
  return (
    <div
      style={{
        position: 'absolute',
        left: x0 + drift,
        top: HEIGHT - rise,
        width: size,
        height: size,
        borderRadius: '50%',
        background: CREAM,
        opacity,
        filter: 'blur(0.4px)',
      }}
    />
  );
};

const PARTICLES = Array.from({ length: 14 }).map((_, i) => ({
  x0: (i * 137) % WIDTH,
  size: 2 + (i % 4),
  phase: i * 0.9,
}));

const SliceCard: React.FC<{ cfg: SliceCfg; frame: number; fps: number; index: number }> = ({ cfg, frame, fps, index }) => {
  const local2 = frame - S2_START;
  const emergeStart = 85 - S2_START + index * 4;
  const s = spring({ frame: Math.max(0, local2 - emergeStart), fps, config: { damping: 14, mass: 0.9 } });

  const suckT = interpolate(frame, [150, 170], [0, 1], { ...clampCfg, easing: Easing.in(Easing.exp) });

  const scaleBase = SLICE_DISPLAY_LONG / Math.max(cfg.w, cfg.h);
  const entranceScale = interpolate(s, [0, 1], [0.5, 1]);
  const scale = interpolate(suckT, [0, 1], [entranceScale, 0.6]) * scaleBase;

  const bobPhase = cfg.phase;
  const bob = interpolate(frame, [emergeStart + S2_START + 30, emergeStart + S2_START + 44], [0, 1], clampCfg) * Math.sin(frame * 0.09 + bobPhase) * 10;

  const targetX = interpolate(s, [0, 1], [0, cfg.x] as number[]);
  const targetY = interpolate(s, [0, 1], [0, cfg.y] as number[]) + bob;
  const targetZ = interpolate(s, [0, 1], [0, cfg.z] as number[]);

  const x = interpolate(suckT, [0, 1], [targetX, 0]);
  const y = interpolate(suckT, [0, 1], [targetY, 0]);
  const z = interpolate(suckT, [0, 1], [targetZ, 0]);

  const opacity = interpolate(local2, [emergeStart, emergeStart + 10], [0, 1], clampCfg);
  const depthBlur = cfg.blurred ? interpolate(suckT, [0, 1], [4, 0]) : 0;

  const w = cfg.w * scale;
  const h = cfg.h * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: CENTER_X - w / 2,
        top: CENTER_Y - h / 2,
        width: w,
        height: h,
        opacity,
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
        filter: `drop-shadow(0 ${18 + z * 0.06}px ${22 - z * 0.02}px rgba(11,31,17,0.55)) blur(${depthBlur}px)`,
      }}
    >
      <Img src={staticFile(`uai-tofu/${cfg.src}`)} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

const ORBIT_MAX_DEG = 22;

const SlicesScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local2 = frame - S2_START;
  const orbit = interpolate(local2, [0, 77], [-ORBIT_MAX_DEG, ORBIT_MAX_DEG], { ...clampCfg, easing: Easing.out(Easing.cubic) });
  const suckT = interpolate(frame, [150, 170], [0, 1], { ...clampCfg, easing: Easing.in(Easing.exp) });
  // A órbita relaxa de volta ao centro conforme a sucção acontece, pra não
  // brigar com a convergência.
  const orbitEased = orbit * (1 - suckT);

  const flashOpacity = interpolate(frame, [163, 166, 176], [0, 0.85, 0], clampCfg);

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DEEP }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, rgba(255,210,63,0.15) 0%, transparent 62%)`,
        }}
      />
      {PARTICLES.map((p, i) => (
        <Particle key={i} frame={frame} x0={p.x0} y0={0} size={p.size} phase={p.phase} />
      ))}

      <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: '50% 50%' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${orbitEased}deg)`,
          }}
        >
          {SLICES_3D.map((cfg, i) => (
            <SliceCard key={cfg.src} cfg={cfg} frame={frame} fps={fps} index={i} />
          ))}
        </div>
      </AbsoluteFill>

      {/* Flash do impacto — o exato instante da colisão/implosão. */}
      <AbsoluteFill style={{ backgroundColor: CREAM, opacity: flashOpacity }} />
    </AbsoluteFill>
  );
};

// =============================================================================
// CENA 3 — A Origem, Embalagem UAI Tofu (163-225)
// Embalagem real (box.png) nasce do choque com peso (spring pesado), glow
// pulsante, dolly out leve, e dissolve final pra preto (loop).
// =============================================================================
const BOX = { src: 'box.png', w: 557, h: 705 };
const BOX_DISPLAY_W = 620;

const PackageScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const local3 = frame - S3_START;
  const s = spring({ frame: Math.max(0, local3 - 2), fps, config: { damping: 12, mass: 1.2 } });
  const scale = interpolate(s, [0, 1], [0.2, 1]);
  const blur = interpolate(s, [0, 1], [20, 0]);
  const opacity = interpolate(local3, [0, 8], [0, 1], clampCfg);

  const glowT = interpolate(local3, [4, 20], [0, 1], { ...clampCfg, easing: Easing.out(Easing.cubic) });
  const glowPulse = 1 + Math.sin(frame * 0.12) * 0.08;
  const glowOpacity = glowT * (0.55 + Math.sin(frame * 0.12) * 0.12);

  // Dolly out levíssimo — leve respiro/recuo de câmera até o fim.
  const dolly = interpolate(local3, [2, 62], [1.045, 1], { ...clampCfg, easing: Easing.out(Easing.cubic) });

  const dissolve = interpolate(frame, [210, 225], [0, 1], clampCfg);

  const w = BOX_DISPLAY_W * scale;
  const h = w * (BOX.h / BOX.w);

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DEEP }}>
      <AbsoluteFill style={{ transform: `scale(${dolly})`, transformOrigin: '50% 50%' }}>
        <AbsoluteFill
          style={{
            opacity: glowOpacity,
            mixBlendMode: 'screen',
            background: `radial-gradient(circle at 50% 50%, ${YELLOW} 0%, transparent 68%)`,
            transform: `scale(${glowPulse})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: CENTER_X - w * 0.42,
            top: CENTER_Y + h * 0.44,
            width: w * 0.84,
            height: 40,
            opacity: opacity * 0.5,
            background: `radial-gradient(ellipse at center, ${SHADOW} 0%, transparent 72%)`,
            filter: 'blur(16px)',
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
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: dissolve }} />
    </AbsoluteFill>
  );
};

// =============================================================================
// Composição principal
// =============================================================================
export const UaiTofuMantra: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: BG_DEEP }}>
      <FontFace />

      <AbsoluteFill style={{ opacity: crossfade(frame, S1_START, S1_END, 7, true, false) }}>
        <MantraScene frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S2_START, S2_END, 7, false, false) }}>
        <SlicesScene frame={frame} fps={fps} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: crossfade(frame, S3_START, DURATION, 7, false, true) }}>
        <PackageScene frame={frame} fps={fps} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
