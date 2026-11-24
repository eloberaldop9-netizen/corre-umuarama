import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Vinheta de COLAB: as duas marcas no mesmo cartão, uma embaixo da outra
// (formato vertical), com um "×" entre elas marcando a parceria. O selo
// do UAI Tofu reusa o mesmo tratamento (disco branco atrás da logo real)
// já usado nos outros vídeos da marca; o selo do Queijos da Terra é o
// PNG real (já é um selo circular completo) usado sem alteração.
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 60;
export const DURATION = 300;

const BG_TOP = 'rgb(250, 247, 240)';
const BG_BOTTOM = 'rgb(240, 235, 222)';

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const CENTER_X = WIDTH / 2;
const SEAL_SIZE = 600;
const GAP = 60;
const DIVIDER_H = 90;
const STACK_TOP = (HEIGHT - (SEAL_SIZE + GAP + DIVIDER_H + GAP + SEAL_SIZE)) / 2;

const SEAL1_CY = STACK_TOP + SEAL_SIZE / 2;
const DIVIDER_CY = STACK_TOP + SEAL_SIZE + GAP + DIVIDER_H / 2;
const SEAL2_CY = STACK_TOP + SEAL_SIZE + GAP + DIVIDER_H + GAP + SEAL_SIZE / 2;

const SEAL1_START = 8;
const DIVIDER_START = 55;
const SEAL2_START = 75;
const IDLE_START = 150;

const fontFamily = 'Lato';
const FontFace: React.FC = () => (
  <style>{`
    @font-face {
      font-family: 'Lato';
      src: url('${staticFile('fonts/Lato-Black-latin.woff2')}') format('woff2');
      font-weight: 900;
      font-style: normal;
      font-display: block;
    }
  `}</style>
);

// Selo redondo do UAI Tofu — mesmo tratamento (disco branco + logo real)
// usado no resto da marca; aqui sem a caixa, só o selo, pra casar com o
// selo já-circular do Queijos da Terra.
const UaiTofuSeal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - SEAL1_START), fps, config: { damping: 11, mass: 0.85, stiffness: 118 } });
  const scale = interpolate(s, [0, 1], [0, 1] as number[]);
  const opacity = interpolate(frame, [SEAL1_START, SEAL1_START + 10], [0, 1] as number[], clampCfg);
  const idle = frame > IDLE_START ? Math.sin((frame - IDLE_START) * 0.035) * 0.015 : 0;
  const finalScale = scale + idle;

  const d = SEAL_SIZE * finalScale;
  const logoW = d * 0.66;
  const logoH = logoW * (1264 / 1549);

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
          top: SEAL1_CY - d / 2,
          width: d,
          height: d,
          borderRadius: '50%',
          background: '#fffdf6',
          opacity,
          boxShadow: '0 14px 34px rgba(70,40,10,0.16)',
        }}
      />
      <Img
        src={staticFile('uai-tofu/logo.png')}
        style={{
          position: 'absolute',
          left: CENTER_X - logoW / 2,
          top: SEAL1_CY - logoH / 2,
          width: logoW,
          height: logoH,
          opacity,
        }}
      />
    </>
  );
};

const QueijosSeal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - SEAL2_START), fps, config: { damping: 11, mass: 0.85, stiffness: 118 } });
  const scale = interpolate(s, [0, 1], [0, 1] as number[]);
  const opacity = interpolate(frame, [SEAL2_START, SEAL2_START + 10], [0, 1] as number[], clampCfg);
  const idle = frame > IDLE_START ? Math.sin((frame - IDLE_START) * 0.035 + 1.8) * 0.015 : 0;
  const finalScale = scale + idle;
  const d = SEAL_SIZE * finalScale;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: CENTER_X - d * 0.36,
          top: SEAL2_CY + d / 2 - 16,
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
          top: SEAL2_CY - d / 2,
          width: d,
          height: d,
          opacity,
        }}
      />
    </>
  );
};

const Divider: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - DIVIDER_START), fps, config: { damping: 12, mass: 0.6, stiffness: 170 } });
  const scale = interpolate(s, [0, 1], [0.3, 1] as number[]);
  const opacity = interpolate(frame, [DIVIDER_START, DIVIDER_START + 10], [0, 1] as number[], clampCfg);

  return (
    <div
      style={{
        position: 'absolute',
        left: CENTER_X - 60,
        top: DIVIDER_CY - 60,
        width: 120,
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <span style={{ fontFamily, fontWeight: 900, fontSize: 72, color: '#3A3A3A', lineHeight: 1 }}>×</span>
    </div>
  );
};

export const UaiTofuQueijosColab: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${BG_TOP}, ${BG_BOTTOM})` }}>
      <FontFace />
      <UaiTofuSeal frame={frame} fps={fps} />
      <Divider frame={frame} fps={fps} />
      <QueijosSeal frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
