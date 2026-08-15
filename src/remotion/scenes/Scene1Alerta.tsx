import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {TriangleAlert} from 'lucide-react';
import {ci} from '../motion';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {Noise} from '../components/Noise';

// Ícone de alerta sutil pulsando atrás do texto enquanto "ALERTA!" está na tela.
const AlertIconBackdrop: React.FC<{frame: number}> = ({frame}) => {
  const introP = ci(frame, [0, 24], [0, 1], Easing.out(Easing.cubic));
  const pulse = 1 + Math.sin(frame * 0.09) * 0.06;
  const rotate = Math.sin(frame * 0.035) * 6;
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          opacity: introP * 0.16,
          transform: `scale(${pulse}) rotate(${rotate}deg)`,
        }}
      >
        <TriangleAlert size={620} color={COLORS.textPrimary} strokeWidth={1.2} />
      </div>
    </AbsoluteFill>
  );
};

const Waves: React.FC<{frame: number}> = ({frame}) => {
  const rings = [0, 1, 2];
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      {rings.map((i) => {
        const localFrame = (frame - i * 10) % 30;
        const progress = Math.max(0, localFrame) / 30;
        const scale = ci(progress, [0, 1], [0, 2]);
        const opacity = ci(progress, [0, 1], [0.5, 0], Easing.out(Easing.cubic));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 900,
              height: 900,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              transform: `scale(${scale})`,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// "Sua" — impacto seco, branco sólido.
const WordSua: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const p = ci(frame, [start, start + 8], [0, 1], Easing.out(Easing.back(2.2)));
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 60,
        fontWeight: 900,
        color: COLORS.textPrimary,
        opacity: ci(frame, [start, start + 4], [0, 1]),
        transform: `scale(${p})`,
      }}
    >
      Sua
    </span>
  );
};

// "IPTV" — stagger letra por letra, amarelo alerta.
const WordIptv: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const letters = ['I', 'P', 'T', 'V'];
  return (
    <span style={{display: 'inline-flex'}}>
      {letters.map((l, i) => {
        const ls = start + i * 5;
        const p = ci(frame, [ls, ls + 10], [0, 1], Easing.out(Easing.back(2)));
        const y = ci(frame, [ls, ls + 10], [-30, 0], Easing.out(Easing.back(2)));
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize: 60,
              fontWeight: 900,
              color: COLORS.alertYellow,
              opacity: ci(frame, [ls, ls + 5], [0, 1]),
              transform: `translateY(${y}px) scale(${p})`,
              textShadow: `0 0 20px ${COLORS.alertYellow}aa`,
            }}
          >
            {l}
          </span>
        );
      })}
    </span>
  );
};

// "parou de funcionar?" — física de queda/quebra: cada palavra despenca e balança ao pousar.
const TumbleWord: React.FC<{frame: number; start: number; word: string; seed: string}> = ({
  frame,
  start,
  word,
  seed,
}) => {
  const fall = ci(frame, [start, start + 14], [0, 1], Easing.out(Easing.cubic));
  const y = interpolate(fall, [0, 0.7, 1], [-70, 6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wobble = (random(seed) - 0.5) * 14;
  const rotate = ci(frame, [start, start + 14], [wobble, 0], Easing.out(Easing.cubic));
  const opacity = ci(frame, [start, start + 6], [0, 1]);
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 60,
        fontWeight: 900,
        color: COLORS.textPrimary,
        opacity,
        transform: `translateY(${y}px) rotate(${rotate}deg)`,
      }}
    >
      {word}
    </span>
  );
};

export const Scene1Alerta: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- ENTRADA: ALERTA! rasga a tela de baixo pra cima ----
  const alertaOpacity = ci(frame, [0, 10], [0, 1]);
  const alertaBounceScale = ci(frame, [0, 20], [0.6, 1], Easing.out(Easing.back(1.7)));
  const alertaY = ci(frame, [0, 18], [140, 0], Easing.out(Easing.cubic));
  const jitterX = frame >= 22 && frame < 78 ? Math.sin(frame * 0.8) * 3 : 0;

  // ---- SAÍDA (82-97): Z-Dive rápido e violento ----
  const diveStart = 82;
  const diveProgress = ci(frame, [diveStart, 97], [0, 1], Easing.in(Easing.exp));
  const diveScale = ci(diveProgress, [0, 1], [1, 6]);
  const diveBlur = ci(diveProgress, [0, 1], [0, 32]);
  const bgOpacity = ci(frame, [diveStart + 6, 97], [1, 0], Easing.in(Easing.quad));

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill style={{backgroundColor: COLORS.brandRed, opacity: bgOpacity}}>
        <Noise opacity={0.06} />
        <Waves frame={frame} />
        <AlertIconBackdrop frame={frame} />
      </AbsoluteFill>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            transform: `translateY(${alertaY}px) scale(${alertaBounceScale * diveScale}) translateX(${jitterX}px)`,
            opacity: alertaOpacity,
            filter: `blur(${diveBlur}px)`,
            fontFamily: FONT_POPPINS,
            fontWeight: 900,
            fontSize: 150,
            color: COLORS.textPrimary,
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: '-2px',
          }}
        >
          ALERTA!
        </div>

        <div
          style={{
            position: 'absolute',
            top: '62%',
            width: '86%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 18,
            opacity: bgOpacity,
            fontFamily: FONT_POPPINS,
          }}
        >
          <WordSua frame={frame} start={8} />
          <WordIptv frame={frame} start={20} />
          <TumbleWord frame={frame} start={44} word="parou" seed="parou" />
          <TumbleWord frame={frame} start={52} word="de" seed="de" />
          <TumbleWord frame={frame} start={58} word="funcionar?" seed="funcionar" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
