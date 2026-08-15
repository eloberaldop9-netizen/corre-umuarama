import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {FONT_POPPINS} from '../fonts';
import {MediaCard} from '../components/MediaCard';
import {scene4Captions} from '../captions';
import {ci} from '../motion';

const LOCAL_DURATION = 178;
const WIPE_START = 158;

const VERDICT_START = 96; // início de "provavelmente o problema não está na sua internet."
const VERDICT_WORDS = 'provavelmente o problema não está na sua internet.'.split(' ');
const VERDICT_COLOR: Record<number, string> = {
  3: COLORS.brandRed, // "não"
  7: COLORS.success, // "internet."
};

const StackedLine: React.FC<{
  text: string;
  start: number;
  frame: number;
  recede: boolean;
}> = ({text, start, frame, recede}) => {
  const p = ci(frame, [start, start + 16], [0, 1], Easing.out(Easing.cubic));
  const y = ci(frame, [start, start + 16], [-50, 0], Easing.out(Easing.cubic));
  const blur = ci(frame, [start, start + 12], [10, 0]);
  const recedeP = recede ? ci(frame, [VERDICT_START, VERDICT_START + 16], [0, 1]) : 0;

  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.3em',
        fontFamily: FONT_POPPINS,
        fontWeight: 800,
        fontSize: 48,
        color: COLORS.textPrimary,
        opacity: (frame < start ? 0 : 1) * (1 - recedeP * 0.55),
        transform: `translateY(${y - recedeP * 30}px) scale(${1 - recedeP * 0.22})`,
        filter: `blur(${blur}px)`,
      }}
    >
      {words.map((w, i) => {
        const isIptv = w.toLowerCase().includes('iptv');
        return (
          <span key={i} style={{opacity: p, color: isIptv ? COLORS.brandRed : 'inherit'}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const VerdictLine: React.FC<{frame: number}> = ({frame}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.24em',
        fontFamily: FONT_POPPINS,
        fontWeight: 900,
        fontSize: 80,
        lineHeight: 1.05,
        textAlign: 'center',
        letterSpacing: '-2px',
      }}
    >
      {VERDICT_WORDS.map((word, i) => {
        const wordStart = VERDICT_START + i * 6;
        const p = ci(frame, [wordStart, wordStart + 16], [0, 1], Easing.out(Easing.cubic));
        const y = ci(frame, [wordStart, wordStart + 16], [-60, 0], Easing.out(Easing.cubic));
        const blur = ci(frame, [wordStart, wordStart + 12], [12, 0]);
        const color = VERDICT_COLOR[i] ?? COLORS.textPrimary;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              color,
              textShadow: VERDICT_COLOR[i] ? `0 0 26px ${color}aa` : 'none',
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const Scene4Conclusao: React.FC = () => {
  const frame = useCurrentFrame();

  const ringP = ci(frame, [VERDICT_START, VERDICT_START + 30], [0, 1], Easing.out(Easing.cubic));
  const ringScale = ci(ringP, [0, 1], [0.3, 2.6]);
  const ringOpacity = interpolate(ringP, [0, 0.5, 1], [0, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---- SAÍDA CRIATIVA: lâmina vermelha varrendo em diagonal ----
  const wipeP = ci(frame, [WIPE_START, LOCAL_DURATION], [0, 1], Easing.in(Easing.cubic));

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          opacity: 0.16,
          filter: 'blur(18px) brightness(0.6)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MediaCard
          src={staticFile('video/cliente-familia.mov')}
          glowOpacity={0}
          loopDurationInFrames={151}
          size={2000}
          style={{borderRadius: 0, border: 'none'}}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(230,0,11,0.2), transparent 65%)',
        }}
      />

      {/* Anel de luz branca ao chegar no veredito */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            border: `3px solid ${COLORS.white}`,
            opacity: ringOpacity,
            transform: `scale(${ringScale})`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            width: '88%',
          }}
        >
          <StackedLine text={scene4Captions[0].text} start={7} frame={frame} recede />
          <StackedLine text={scene4Captions[1].text} start={48} frame={frame} recede />
          <VerdictLine frame={frame} />
        </div>
      </AbsoluteFill>

      {/* Wipe diagonal vermelho: a borda varre de fora-topo-esquerda até cobrir tudo */}
      {wipeP > 0 && (
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, transparent ${ci(wipeP, [0, 1], [100, -40])}%, ${COLORS.brandRed} ${ci(wipeP, [0, 1], [102, -38])}%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
