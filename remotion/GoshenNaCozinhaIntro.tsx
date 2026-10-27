import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Vinheta "GOSHEN — na Cozinha com ELO", reveal palavra por palavra.
// Todos os elementos (logo, folhas, pontilhado, onda, cada palavra) são
// recortes reais extraídos da arte de referência do cliente (alpha cutout,
// mesmo pipeline usado no resto do projeto) — nada foi redesenhado, só
// animado. Posições escaladas 1.2x a partir do canvas original 1600x900
// para o canvas nativo 1920x1080.
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 60;
export const DURATION = 320;

const BG = '#FEFEFE';
const SCALE = 1.2;
const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

type Box = { src: string; left: number; top: number; w: number; h: number };

const box = (src: string, x0: number, y0: number, w: number, h: number): Box => ({
  src,
  left: x0 * SCALE,
  top: y0 * SCALE,
  w: w * SCALE,
  h: h * SCALE,
});

const LOGO = box('logo.png', 535, 33, 430, 261);
const WORD_NA = box('word-na.png', 281, 398, 260, 117);
const WORD_COZINHA = box('word-cozinha.png', 535, 280, 791, 304);
const WORD_COM = box('word-com.png', 521, 575, 259, 75);
const WORD_ELO = box('word-elo.png', 842, 575, 233, 75);
const DOTS = box('dots.png', 1422, 0, 162, 110);
const LEAF_TL = box('leaf-tl.png', 14, 15, 192, 155);
const LEAF_TR = box('leaf-tr.png', 1401, 120, 171, 155);
const LEAF_MID = box('leaf-mid.png', 489, 659, 206, 167);
const LEAF_BL = box('leaf-bl-blur.png', 0, 716, 184, 184);
const WAVE = box('wave.png', 400, 560, 1200, 340);

// Timeline (60fps)
const WAVE_START = 0;
const LEAF_BL_START = 4;
const LEAF_TL_START = 10;
const LEAF_TR_START = 22;
const DOTS_START = 30;
const LEAF_MID_START = 46;
const LOGO_START = 58;
const WORD_NA_START = 132;
const WORD_COZINHA_START = 152;
const WORD_COM_START = 208;
const WORD_ELO_START = 226;
const IDLE_START = 255;

// Entra deslizando de baixo, desfocada -> nítida, com leve overshoot de
// escala — a mesma linguagem de "pop para foco" usada no resto do projeto.
const WordImg: React.FC<{ frame: number; fps: number; start: number; box: Box; travel?: number }> = ({
  frame,
  fps,
  start,
  box,
  travel = 46,
}) => {
  const s = spring({ frame: Math.max(0, frame - start), fps, config: { damping: 13, mass: 0.8, stiffness: 150 } });
  const scale = interpolate(s, [0, 1], [0.82, 1] as number[]);
  const translateY = interpolate(s, [0, 1], [travel, 0] as number[]);
  const opacity = interpolate(frame, [start, start + 16], [0, 1] as number[], clampCfg);
  const blur = interpolate(frame, [start, start + 20], [10, 0] as number[], clampCfg);

  return (
    <Img
      src={staticFile(`goshen/${box.src}`)}
      style={{
        position: 'absolute',
        left: box.left,
        top: box.top,
        width: box.w,
        height: box.h,
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    />
  );
};

const Logo: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - LOGO_START), fps, config: { damping: 12, mass: 0.9, stiffness: 130 } });
  const scale = interpolate(s, [0, 1], [0.6, 1] as number[]);
  const rotate = interpolate(s, [0, 1], [-6, 0] as number[]);
  const opacity = interpolate(frame, [LOGO_START, LOGO_START + 18], [0, 1] as number[], clampCfg);
  const blur = interpolate(frame, [LOGO_START, LOGO_START + 22], [14, 0] as number[], clampCfg);

  // Respiração sutil no hold — mantém o selo "vivo" em vez de parado.
  const idle = frame > IDLE_START ? Math.sin((frame - IDLE_START) * 0.045) * 0.012 : 0;

  return (
    <Img
      src={staticFile(`goshen/${LOGO.src}`)}
      style={{
        position: 'absolute',
        left: LOGO.left,
        top: LOGO.top,
        width: LOGO.w,
        height: LOGO.h,
        opacity,
        filter: `blur(${blur}px)`,
        transform: `rotate(${rotate}deg) scale(${scale + idle})`,
      }}
    />
  );
};

const Leaf: React.FC<{
  frame: number;
  fps: number;
  start: number;
  box: Box;
  rotFrom: number;
  idlePhase: number;
}> = ({ frame, fps, start, box, rotFrom, idlePhase }) => {
  const s = spring({ frame: Math.max(0, frame - start), fps, config: { damping: 11, mass: 0.8, stiffness: 110 } });
  const scale = interpolate(s, [0, 1], [0.55, 1] as number[]);
  const rotEnter = interpolate(s, [0, 1], [rotFrom, 0] as number[]);
  const opacity = interpolate(frame, [start, start + 22], [0, 1] as number[], clampCfg);
  const idle = frame > IDLE_START ? Math.sin((frame - IDLE_START) * 0.03 + idlePhase) * 1.6 : 0;

  return (
    <Img
      src={staticFile(`goshen/${box.src}`)}
      style={{
        position: 'absolute',
        left: box.left,
        top: box.top,
        width: box.w,
        height: box.h,
        opacity,
        transform: `rotate(${rotEnter + idle}deg) scale(${scale})`,
      }}
    />
  );
};

const Dots: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: Math.max(0, frame - DOTS_START), fps, config: { damping: 14, mass: 0.7, stiffness: 160 } });
  const scale = interpolate(s, [0, 1], [0.5, 1] as number[]);
  const opacity = interpolate(frame, [DOTS_START, DOTS_START + 24], [0, 1] as number[], clampCfg);

  return (
    <Img
      src={staticFile(`goshen/${DOTS.src}`)}
      style={{
        position: 'absolute',
        left: DOTS.left,
        top: DOTS.top,
        width: DOTS.w,
        height: DOTS.h,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: '100% 0%',
      }}
    />
  );
};

const Wave: React.FC<{ frame: number }> = ({ frame }) => {
  const t = interpolate(frame, [WAVE_START, WAVE_START + 46], [0, 1] as number[], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });
  const translateX = interpolate(t, [0, 1], [90, 0] as number[]);
  const translateY = interpolate(t, [0, 1], [70, 0] as number[]);
  const opacity = interpolate(frame, [WAVE_START, WAVE_START + 30], [0, 1] as number[], clampCfg);

  return (
    <Img
      src={staticFile(`goshen/${WAVE.src}`)}
      style={{
        position: 'absolute',
        left: WAVE.left,
        top: WAVE.top,
        width: WAVE.w,
        height: WAVE.h,
        opacity,
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    />
  );
};

export const GoshenNaCozinhaIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Wave frame={frame} />
      <Leaf frame={frame} fps={fps} start={LEAF_BL_START} box={LEAF_BL} rotFrom={-10} idlePhase={0.5} />
      <Leaf frame={frame} fps={fps} start={LEAF_TL_START} box={LEAF_TL} rotFrom={-26} idlePhase={1.8} />
      <Leaf frame={frame} fps={fps} start={LEAF_TR_START} box={LEAF_TR} rotFrom={24} idlePhase={3.4} />
      <Dots frame={frame} fps={fps} />
      <Leaf frame={frame} fps={fps} start={LEAF_MID_START} box={LEAF_MID} rotFrom={-20} idlePhase={2.6} />

      <Logo frame={frame} fps={fps} />

      <WordImg frame={frame} fps={fps} start={WORD_NA_START} box={WORD_NA} />
      <WordImg frame={frame} fps={fps} start={WORD_COZINHA_START} box={WORD_COZINHA} travel={56} />
      <WordImg frame={frame} fps={fps} start={WORD_COM_START} box={WORD_COM} />
      <WordImg frame={frame} fps={fps} start={WORD_ELO_START} box={WORD_ELO} />
    </AbsoluteFill>
  );
};
