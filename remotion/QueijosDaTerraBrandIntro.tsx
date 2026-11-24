import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Vinheta "Queijos da Terra" — reveal simples do selo oficial (a logo já é
// o selo completo: nome + "Plant Based" + "Produto Vegano", então não
// adiciona nenhum texto novo). Mesma lógica de "selo crescendo com spring"
// usada na vinheta do UAI Tofu, sem o disco branco por trás (a própria
// logo já é o selo circular). Fundo = o degradê verde-menta da própria
// apresentação oficial da logo (não inventado).
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 60;
export const DURATION = 300;

const BG_TOP = 'rgb(202, 225, 209)';
const BG_BOTTOM = 'rgb(242, 248, 244)';
const SHADOW_GREEN = 'rgba(43, 78, 14, 0.25)';

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2 - 40;
const LOGO_SIZE = 760;

const LOGO_START = 8;
const IDLE_START = 90;

const Glow: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [LOGO_START, LOGO_START + 20, LOGO_START + 50], [0, 0.5, 0.22], {
    ...clampCfg,
  });
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: 'multiply',
        background: `radial-gradient(circle at ${CENTER_X}px ${CENTER_Y}px, rgba(217,164,65,0.35) 0%, rgba(217,164,65,0) 62%)`,
      }}
    />
  );
};

const LogoSeal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - LOGO_START), fps, config: { damping: 11, mass: 0.85, stiffness: 118 } });
  const scale = interpolate(s, [0, 1], [0, 1] as number[]);
  const rotate = interpolate(s, [0, 1], [-10, 0] as number[]);
  const opacity = interpolate(frame, [LOGO_START, LOGO_START + 10], [0, 1] as number[], clampCfg);

  // respiração sutil no hold, pra não ficar parado
  const idle = frame > IDLE_START ? Math.sin((frame - IDLE_START) * 0.035) * 0.015 : 0;
  const finalScale = scale + idle;

  const shadowOpacity = interpolate(frame, [LOGO_START, LOGO_START + 16], [0, 1] as number[], clampCfg);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: CENTER_X - LOGO_SIZE * 0.36,
          top: CENTER_Y + (LOGO_SIZE * finalScale) / 2 - 18,
          width: LOGO_SIZE * 0.72,
          height: LOGO_SIZE * 0.1,
          opacity: shadowOpacity * 0.8,
          background: `radial-gradient(ellipse at center, ${SHADOW_GREEN} 0%, rgba(43,78,14,0) 72%)`,
          filter: 'blur(18px)',
        }}
      />
      <Img
        src={staticFile('queijos-da-terra/logo.png')}
        style={{
          position: 'absolute',
          left: CENTER_X - (LOGO_SIZE * finalScale) / 2,
          top: CENTER_Y - (LOGO_SIZE * finalScale) / 2,
          width: LOGO_SIZE * finalScale,
          height: LOGO_SIZE * finalScale,
          opacity,
          transform: `rotate(${rotate}deg)`,
        }}
      />
    </>
  );
};

export const QueijosDaTerraBrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: `linear-gradient(to bottom, ${BG_TOP}, ${BG_BOTTOM})` }}>
      <Glow frame={frame} />
      <LogoSeal frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
