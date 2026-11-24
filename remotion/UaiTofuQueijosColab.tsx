import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Vinheta de COLAB (UAI Tofu × Queijos da Terra). Sem nenhum elemento
// conector (nem "×", nem fita, nem brilho central) — o cliente pediu pra
// tirar tudo isso e deixar só as duas logos animando, de forma limpa e
// profissional. Os dois selos convergem de direções opostas (um de cima,
// um de baixo) com um leve giro de assentamento, levemente escalonados
// no tempo (um lidera, o outro segue um beat depois) pra não ler como
// um espelhamento mecânico.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 60;
export const DURATION = 270;

const BG_TOP = 'rgb(250, 247, 240)';
const BG_BOTTOM = 'rgb(240, 235, 222)';

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const CENTER_X = WIDTH / 2;
const SEAL_SIZE = 620;
const GAP = 170;
const STACK_TOP = (HEIGHT - (SEAL_SIZE + GAP + SEAL_SIZE)) / 2;

const SEAL1_CY = STACK_TOP + SEAL_SIZE / 2;
const SEAL2_CY = STACK_TOP + SEAL_SIZE + GAP + SEAL_SIZE / 2;

const SEAL1_START = 6;
const SEAL2_START = 20;
const IDLE_START = 120;

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

export const UaiTofuQueijosColab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${BG_TOP}, ${BG_BOTTOM})` }}>
      <UaiTofuSeal frame={frame} fps={fps} />
      <QueijosSeal frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
