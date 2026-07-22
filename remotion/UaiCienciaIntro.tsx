import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const fontFamily = 'Fredoka';

const FontFace: React.FC = () => (
  <style>{`
    @font-face {
      font-family: 'Fredoka';
      src: url('${staticFile('fonts/Fredoka-Variable-latin.woff2')}') format('woff2');
      font-weight: 300 700;
      font-style: normal;
      font-display: block;
    }
  `}</style>
);

// Paleta técnica — "UAI, é ciência!"
const BG_EDGE = '#D67015';
const BG_CORE = '#F6A331';
const TEXT_PRIMARY = '#962D15';

const WORDS = ['UAI,', 'é', 'ciência!'];
const WORD_DELAYS = [5, 8, 11];
const SUBTITLE_DELAY = 20;

const EXIT_START = 90;
const DURATION = 120;

// Ponto aproximado do "!" em "ciência!" — foco do Z-dive final.
const DIVE_ORIGIN = '73% 44%';

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const Rings: React.FC<{ frame: number }> = ({ frame }) => {
  const entryProgress = interpolate(frame, [0, 30], [0, 1], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });
  const entryRotation = interpolate(entryProgress, [0, 1], [0, 15]);
  const continuousRotation = Math.max(0, frame - 30) * 0.1;

  const exitProgress = interpolate(frame, [EXIT_START, DURATION], [0, 1], {
    ...clampCfg,
    easing: Easing.in(Easing.exp),
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, 3]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  const rotation = entryRotation + continuousRotation;
  const opacity = entryProgress * exitOpacity;

  return (
    <svg
      viewBox="0 0 1080 1920"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        transform: `rotate(${rotation}deg) scale(${exitScale})`,
        transformOrigin: '50% 50%',
        opacity,
      }}
    >
      {[300, 500, 700].map((r) => (
        <circle
          key={r}
          cx={540}
          cy={960}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
};

const Grain: React.FC<{ frame: number }> = ({ frame }) => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.05,
      mixBlendMode: 'overlay',
    }}
  >
    <filter id="uai-grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency={0.85}
        numOctaves={2}
        seed={frame}
        stitchTiles="stitch"
      />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.3 0.59 0.11 0 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#uai-grain)" />
  </svg>
);

const TitleWord: React.FC<{ word: string; delay: number }> = ({ word, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { mass: 1.2, damping: 12, stiffness: 100 },
  });
  const translateY = interpolate(s, [0, 1], [100, 0]);
  const skewY = interpolate(s, [0, 1], [5, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', paddingTop: 16, paddingBottom: 16, marginTop: -16 }}>
      <span
        style={{
          display: 'inline-block',
          transform: `translateY(${translateY}px) skewY(${skewY}deg)`,
          opacity,
        }}
      >
        {word}
      </span>
    </span>
  );
};

export const UaiCienciaIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background: fade-in / settle do pôster
  const bgProgress = interpolate(frame, [0, 25], [0, 1], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });
  const bgScale = interpolate(bgProgress, [0, 1], [1.1, 1]);
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], clampCfg);

  // Câmera: Dolly-In contínuo → Z-Dive agressivo
  const dolly = interpolate(frame, [0, 90], [1, 1.15], { ...clampCfg, easing: Easing.linear });
  const diveProgress = interpolate(frame, [EXIT_START, DURATION], [0, 1], {
    ...clampCfg,
    easing: Easing.in(Easing.exp),
  });
  const dive = interpolate(diveProgress, [0, 1], [1, 9]);
  const cameraScale = dolly * dive;

  // Respiração do bloco tipográfico durante o hold
  const breathe = Math.sin(frame * 0.03) * 2;

  // Subtítulo — entrada (spring mais leve) e saída (blur/fade)
  const subtitleSpring = spring({
    frame: frame - SUBTITLE_DELAY,
    fps,
    config: { mass: 0.8, damping: 14, stiffness: 100 },
  });
  const subtitleTranslateY = interpolate(subtitleSpring, [0, 1], [40, 0]);
  const subtitleBlurIn = interpolate(subtitleSpring, [0, 1], [10, 0], { extrapolateRight: 'clamp' });
  const subtitleOpacityIn = interpolate(subtitleSpring, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  const subtitleExitProgress = interpolate(frame, [92, 118], [0, 1], {
    ...clampCfg,
    easing: Easing.in(Easing.cubic),
  });
  const subtitleBlurOut = interpolate(subtitleExitProgress, [0, 1], [0, 20]);
  const subtitleOpacityOut = interpolate(subtitleExitProgress, [0, 1], [1, 0]);

  // Fade final para o breu — corte seco para o vídeo real
  const darkOpacity = interpolate(frame, [105, 120], [0, 1], clampCfg);

  return (
    <AbsoluteFill style={{ backgroundColor: BG_EDGE, fontFamily }}>
      <FontFace />
      <AbsoluteFill style={{ transform: `scale(${cameraScale})`, transformOrigin: DIVE_ORIGIN }}>
        <AbsoluteFill
          style={{
            transform: `scale(${bgScale})`,
            opacity: bgOpacity,
            background: `radial-gradient(circle at 50% 50%, ${BG_CORE} 0%, transparent 80%)`,
          }}
        />
        <Rings frame={frame} />
        <Grain frame={frame} />
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ transform: `translateY(${breathe}px)`, textAlign: 'center', padding: '0 40px' }}>
            <div
              style={{
                fontSize: 132,
                fontWeight: 700,
                color: TEXT_PRIMARY,
                letterSpacing: -2,
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {WORDS.map((word, i) => (
                <React.Fragment key={word}>
                  <TitleWord word={word} delay={WORD_DELAYS[i]} />
                  {i < WORDS.length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 500,
                color: TEXT_PRIMARY,
                opacity: 0.85 * subtitleOpacityIn * subtitleOpacityOut,
                transform: `translateY(${subtitleTranslateY}px)`,
                filter: `blur(${Math.max(subtitleBlurIn, subtitleBlurOut)}px)`,
                marginTop: 24,
                letterSpacing: 0.5,
              }}
            >
              com Dr. Éric Slywitch
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: '#000000', opacity: darkOpacity }} />
    </AbsoluteFill>
  );
};
