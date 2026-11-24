import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Vinheta de COLAB (UAI Tofu × Queijos da Terra). Depois do feedback de
// que o "×" ficou frio/sem graça, trocamos o divisor por um elo real: uma
// fita curva que nasce com o degradê das duas cores de marca (vermelho do
// UAI Tofu se fundindo no dourado do Queijos da Terra) se desenhando entre
// os dois selos, fechando num pingente com um brilho — em vez de um
// símbolo tipográfico, o próprio traço marca a parceria. Os dois selos
// convergem de direções opostas (um de cima, um de baixo) em vez de só
// crescerem no lugar, pra entrada ter mais intenção.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 60;
export const DURATION = 300;

const BG_TOP = 'rgb(250, 247, 240)';
const BG_BOTTOM = 'rgb(240, 235, 222)';

const RED = '#CC2419';
const GOLD = '#DBA43D';

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const CENTER_X = WIDTH / 2;
const SEAL_SIZE = 600;
const GAP = 220;
const STACK_TOP = (HEIGHT - (SEAL_SIZE + GAP + SEAL_SIZE)) / 2;

const SEAL1_CY = STACK_TOP + SEAL_SIZE / 2;
const SEAL2_CY = STACK_TOP + SEAL_SIZE + GAP + SEAL_SIZE / 2;
const THREAD_TOP_Y = SEAL1_CY + SEAL_SIZE / 2 - 8;
const THREAD_BOTTOM_Y = SEAL2_CY - SEAL_SIZE / 2 + 8;

const SEAL1_START = 6;
const SEAL2_START = 6;
const THREAD_START = 78;
const THREAD_DRAW = 36;
const PENDANT_START = 106;
const GLOW_START = 112;
const IDLE_START = 165;

// Curva da fita: dois pontos de controle alternados pra um "S" suave em
// vez de uma linha reta — lê mais como um laço do que como uma régua.
const P0 = { x: CENTER_X, y: THREAD_TOP_Y };
const P1 = { x: CENTER_X - 46, y: THREAD_TOP_Y + (THREAD_BOTTOM_Y - THREAD_TOP_Y) * 0.32 };
const P2 = { x: CENTER_X + 46, y: THREAD_TOP_Y + (THREAD_BOTTOM_Y - THREAD_TOP_Y) * 0.68 };
const P3 = { x: CENTER_X, y: THREAD_BOTTOM_Y };

function bezierPoint(t: number, p0: typeof P0, p1: typeof P0, p2: typeof P0, p3: typeof P0) {
  const mt = 1 - t;
  const x = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
  const y = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
  return { x, y };
}

const PENDANT_POS = bezierPoint(0.5, P0, P1, P2, P3);

const PATH_D = `M ${P0.x} ${P0.y} C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${P3.x} ${P3.y}`;

// Selo redondo do UAI Tofu — mesmo tratamento (disco branco + logo real)
// já usado no resto da marca, agora convergindo de cima com um leve
// balanço de rotação em vez de só crescer parado.
const UaiTofuSeal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - SEAL1_START), fps, config: { damping: 13, mass: 0.9, stiffness: 95 } });
  const scale = interpolate(s, [0, 1], [0.55, 1] as number[]);
  const translateY = interpolate(s, [0, 1], [-170, 0] as number[]);
  const rotate = interpolate(s, [0, 1], [-5, 0] as number[]);
  const opacity = interpolate(frame, [SEAL1_START, SEAL1_START + 14], [0, 1] as number[], clampCfg);
  const idle = frame > IDLE_START ? Math.sin((frame - IDLE_START) * 0.035) * 0.014 : 0;
  const finalScale = scale + idle;

  const d = SEAL_SIZE * finalScale;
  const logoW = d * 0.66;
  const logoH = logoW * (1264 / 1549);
  const cy = SEAL1_CY + translateY;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: CENTER_X - d * 0.36,
          top: SEAL1_CY + d / 2 - 16,
          width: d * 0.72,
          height: d * 0.1,
          opacity: opacity * 0.7,
          background: 'radial-gradient(ellipse at center, rgba(60,35,10,0.22) 0%, rgba(60,35,10,0) 72%)',
          filter: 'blur(16px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: CENTER_X - d / 2,
          top: cy - d / 2,
          width: d,
          height: d,
          borderRadius: '50%',
          background: '#fffdf6',
          opacity,
          transform: `rotate(${rotate}deg)`,
          boxShadow: '0 14px 34px rgba(70,40,10,0.16)',
        }}
      />
      <Img
        src={staticFile('uai-tofu/logo.png')}
        style={{
          position: 'absolute',
          left: CENTER_X - logoW / 2,
          top: cy - logoH / 2,
          width: logoW,
          height: logoH,
          opacity,
          transform: `rotate(${rotate}deg)`,
        }}
      />
    </>
  );
};

const QueijosSeal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - SEAL2_START), fps, config: { damping: 13, mass: 0.9, stiffness: 95 } });
  const scale = interpolate(s, [0, 1], [0.55, 1] as number[]);
  const translateY = interpolate(s, [0, 1], [170, 0] as number[]);
  const rotate = interpolate(s, [0, 1], [5, 0] as number[]);
  const opacity = interpolate(frame, [SEAL2_START, SEAL2_START + 14], [0, 1] as number[], clampCfg);
  const idle = frame > IDLE_START ? Math.sin((frame - IDLE_START) * 0.035 + 1.8) * 0.014 : 0;
  const finalScale = scale + idle;
  const d = SEAL_SIZE * finalScale;
  const cy = SEAL2_CY + translateY;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: CENTER_X - d * 0.36,
          top: cy + d / 2 - 16,
          width: d * 0.72,
          height: d * 0.1,
          opacity: opacity * 0.7,
          background: 'radial-gradient(ellipse at center, rgba(43,78,14,0.22) 0%, rgba(43,78,14,0) 72%)',
          filter: 'blur(16px)',
        }}
      />
      <Img
        src={staticFile('queijos-da-terra/logo.png')}
        style={{
          position: 'absolute',
          left: CENTER_X - d / 2,
          top: cy - d / 2,
          width: d,
          height: d,
          opacity,
          transform: `rotate(${rotate}deg)`,
        }}
      />
    </>
  );
};

// O elo: uma fita com degradê vermelho -> dourado se desenhando entre os
// dois selos (stroke-dashoffset via pathLength=1, nada de matemática de
// comprimento real de curva), fechando num pingente com um brilho que
// "acende" no instante em que o traço termina.
const Thread: React.FC<{ frame: number }> = ({ frame }) => {
  const drawT = interpolate(frame, [THREAD_START, THREAD_START + THREAD_DRAW], [0, 1] as number[], clampCfg);
  const pathOpacity = interpolate(frame, [THREAD_START, THREAD_START + 6], [0, 1] as number[], clampCfg);

  const pendantS = interpolate(frame, [PENDANT_START, PENDANT_START + 16], [0, 1] as number[], {
    ...clampCfg,
  });
  const pendantScale = interpolate(pendantS, [0, 1], [0.2, 1] as number[]);
  const pendantOpacity = interpolate(frame, [PENDANT_START, PENDANT_START + 10], [0, 1] as number[], clampCfg);
  const glintOpacity = interpolate(
    frame,
    [PENDANT_START + 2, PENDANT_START + 14, PENDANT_START + 34],
    [0, 0.9, 0.35] as number[],
    clampCfg
  );

  // ponta viajante: um brilho pequeno que acompanha a extremidade do
  // traço enquanto ele se desenha, como uma fagulha percorrendo o fio.
  const tip = bezierPoint(Math.min(drawT, 0.999), P0, P1, P2, P3);
  const tipOpacity = interpolate(frame, [THREAD_START, THREAD_START + 6, THREAD_START + THREAD_DRAW - 4, THREAD_START + THREAD_DRAW + 6], [0, 1, 1, 0] as number[], clampCfg);

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <linearGradient id="threadGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RED} />
          <stop offset="100%" stopColor={GOLD} />
        </linearGradient>
      </defs>
      <path
        d={PATH_D}
        fill="none"
        stroke="url(#threadGradient)"
        strokeWidth={9}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - drawT}
        opacity={pathOpacity}
      />
      {/* fagulha na ponta do traço */}
      <circle cx={tip.x} cy={tip.y} r={9} fill={GOLD} opacity={tipOpacity * 0.9} />
      <circle cx={tip.x} cy={tip.y} r={16} fill={GOLD} opacity={tipOpacity * 0.28} />

      {/* brilho do pingente ao acender */}
      <circle cx={PENDANT_POS.x} cy={PENDANT_POS.y} r={46} fill={GOLD} opacity={glintOpacity * 0.22} />
      {/* pingente */}
      <g
        transform={`translate(${PENDANT_POS.x} ${PENDANT_POS.y}) scale(${pendantScale})`}
        opacity={pendantOpacity}
      >
        <circle r={22} fill="#fffdf6" stroke="url(#threadGradient)" strokeWidth={5} />
        <circle r={7} fill={GOLD} />
      </g>
    </svg>
  );
};

const SharedGlow: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [GLOW_START, GLOW_START + 30, GLOW_START + 70], [0, 0.22, 0.12] as number[], clampCfg);
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: 'multiply',
        background: `radial-gradient(circle at ${CENTER_X}px ${PENDANT_POS.y}px, rgba(219,164,61,0.4) 0%, rgba(219,164,61,0) 68%)`,
      }}
    />
  );
};

export const UaiTofuQueijosColab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${BG_TOP}, ${BG_BOTTOM})` }}>
      <SharedGlow frame={frame} />
      <UaiTofuSeal frame={frame} fps={fps} />
      <QueijosSeal frame={frame} fps={fps} />
      <Thread frame={frame} />
    </AbsoluteFill>
  );
};
