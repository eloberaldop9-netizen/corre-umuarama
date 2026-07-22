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

// Paleta técnica — "UAI, é ciência!"
const BG_EDGE = '#D67015';
const BG_CORE = '#F6A331';
const TEXT_PRIMARY = '#962D15';

const WORDS = ['UAI,', 'é', 'ciência!'];
const WORD_DELAYS = [4, 8, 12];
const SUBTITLE_DELAY = 22;

const DURATION = 120;
// A saída inteira (cena) começa a esmaecer aqui — janela longa e suave, sem forma geométrica.
const FADE_START = 94;

const clampCfg = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const Rings: React.FC<{ frame: number }> = ({ frame }) => {
  // Giro contínuo (sem corte de velocidade) + um "empurrão" inicial que decai suavemente.
  const baseSpin = frame * 0.12;
  const kick = interpolate(frame, [0, 45], [10, 0], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });
  const entryOpacity = interpolate(frame, [0, 40], [0, 1], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });
  const pulse = 1 + Math.sin(frame * 0.05) * 0.015;
  const drift = Math.sin(frame * 0.035) * 8;
  const rotation = baseSpin + kick;

  return (
    <svg
      viewBox="0 0 1080 1920"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        transform: `translateX(${drift}px) rotate(${rotation}deg) scale(${pulse})`,
        transformOrigin: '50% 50%',
        opacity: entryOpacity,
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

const Grain: React.FC<{ frame: number }> = ({ frame }) => {
  const flicker = 0.045 + Math.sin(frame * 0.4) * 0.012;
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: flicker,
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
};

// Um respiro de luz muito discreto no instante em que a saída começa — não é um flash, é uma insinuação.
const Glow: React.FC<{ frame: number }> = ({ frame }) => {
  const t = interpolate(frame, [FADE_START - 6, FADE_START + 6, FADE_START + 18], [0, 1, 0], {
    ...clampCfg,
    easing: Easing.inOut(Easing.sin),
  });

  if (t <= 0) return null;

  return (
    <AbsoluteFill
      style={{
        opacity: t * 0.14,
        mixBlendMode: 'screen',
        background: `radial-gradient(circle at 50% 46%, #fff4de 0%, ${BG_CORE} 45%, transparent 75%)`,
      }}
    />
  );
};

const TitleWord: React.FC<{ word: string; delay: number }> = ({ word, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: { mass: 1, damping: 15, stiffness: 110 },
  });
  const translateY = interpolate(s, [0, 1], [90, 0]);
  const skewY = interpolate(s, [0, 1], [3, 0]);
  const scale = interpolate(s, [0, 1], [0.92, 1]);
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', paddingTop: 16, paddingBottom: 16, marginTop: -16 }}>
      <span
        style={{
          display: 'inline-block',
          transform: `translateY(${translateY}px) skewY(${skewY}deg) scale(${scale})`,
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

  // Background: fade-in / settle do pôster + respiração contínua (nunca estático)
  const bgProgress = interpolate(frame, [0, 30], [0, 1], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });
  const bgSettle = interpolate(bgProgress, [0, 1], [1.1, 1]);
  const bgBreathe = 1 + Math.sin(frame * 0.022) * 0.01;
  const bgScale = bgSettle * bgBreathe;
  const bgOpacity = interpolate(frame, [0, 22], [0, 1], clampCfg);

  // Câmera: dolly-in orgânico (ease in-out senoidal) + um recolhimento quase imperceptível na saída.
  const dolly = interpolate(frame, [0, 90], [1, 1.16], {
    ...clampCfg,
    easing: Easing.inOut(Easing.sin),
  });
  const settle = interpolate(frame, [FADE_START, DURATION], [1, 0.97], {
    ...clampCfg,
    easing: Easing.inOut(Easing.cubic),
  });
  const cameraScale = dolly * settle;

  // Respiração contínua do bloco tipográfico — nada de pulso de impacto, só a vida de sempre.
  const breathe = Math.sin(frame * 0.03) * 2;

  // Toda a cena esmaece junto, devagar e por igual — sem forma geométrica, sem zoom.
  const sceneOpacity = interpolate(frame, [FADE_START, DURATION], [1, 0], {
    ...clampCfg,
    easing: Easing.inOut(Easing.cubic),
  });

  // Subtítulo — entrada leve e fluida, saída em blur/fade suave (some um pouco antes do resto)
  const subtitleSpring = spring({
    frame: frame - SUBTITLE_DELAY,
    fps,
    config: { mass: 0.7, damping: 16, stiffness: 110 },
  });
  const subtitleTranslateY = interpolate(subtitleSpring, [0, 1], [30, 0]);
  const subtitleScale = interpolate(subtitleSpring, [0, 1], [0.96, 1]);
  const subtitleBlurIn = interpolate(subtitleSpring, [0, 1], [8, 0], { extrapolateRight: 'clamp' });
  const subtitleOpacityIn = interpolate(subtitleSpring, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  const subtitleExitProgress = interpolate(frame, [88, 112], [0, 1], {
    ...clampCfg,
    easing: Easing.in(Easing.cubic),
  });
  const subtitleBlurOut = interpolate(subtitleExitProgress, [0, 1], [0, 14]);
  const subtitleOpacityOut = interpolate(subtitleExitProgress, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d0904', fontFamily }}>
      <FontFace />
      <AbsoluteFill style={{ opacity: sceneOpacity }}>
        <AbsoluteFill style={{ backgroundColor: BG_EDGE }} />
        <AbsoluteFill style={{ transform: `scale(${cameraScale})`, transformOrigin: '50% 50%' }}>
          <AbsoluteFill
            style={{
              transform: `scale(${bgScale})`,
              opacity: bgOpacity,
              background: `radial-gradient(circle at 50% 50%, ${BG_CORE} 0%, transparent 80%)`,
            }}
          />
          <Rings frame={frame} />
          <Grain frame={frame} />
          <Glow frame={frame} />
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ transform: `translateY(${breathe}px)`, textAlign: 'center', padding: '0 40px' }}>
              <div
                style={{
                  fontSize: 130,
                  fontWeight: 900,
                  color: TEXT_PRIMARY,
                  letterSpacing: -1,
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
                  fontSize: 54,
                  fontWeight: 400,
                  color: TEXT_PRIMARY,
                  opacity: 0.85 * subtitleOpacityIn * subtitleOpacityOut,
                  transform: `translateY(${subtitleTranslateY}px) scale(${subtitleScale})`,
                  filter: `blur(${Math.max(subtitleBlurIn, subtitleBlurOut)}px)`,
                  marginTop: 22,
                  letterSpacing: 0.5,
                }}
              >
                com Dr. Éric Slywitch
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
