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

const EXIT_START = 90;
const DURATION = 120;

// Ponto aproximado do "!" em "ciência!" (em px, canvas 1080×1920) — foco do flash e da íris de saída.
const IRIS_X = 788;
const IRIS_Y = 845;
// Raio que garante cobertura total do frame a partir desse ponto (diagonal até o canto mais distante).
const IRIS_MAX_RADIUS = 1400;

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

  // Explosão rápida dos anéis no instante do flash — dispersam antes da íris fechar.
  const exitProgress = interpolate(frame, [EXIT_START, EXIT_START + 16], [0, 1], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });
  const exitScale = interpolate(exitProgress, [0, 1], [1, 2.6]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  const rotation = baseSpin + kick;
  const opacity = entryOpacity * exitOpacity;
  const scale = pulse * exitScale;

  return (
    <svg
      viewBox="0 0 1080 1920"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        transform: `translateX(${drift}px) rotate(${rotation}deg) scale(${scale})`,
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

// A faísca do conhecimento: um pulso de luz que acende no instante do corte, no lugar de um zoom de câmera.
const Flash: React.FC<{ frame: number }> = ({ frame }) => {
  const t = interpolate(frame, [EXIT_START - 2, EXIT_START + 8, EXIT_START + 22], [0, 1, 0], {
    ...clampCfg,
    easing: Easing.out(Easing.cubic),
  });
  const burstScale = interpolate(t, [0, 1], [0.5, 1.6]);

  if (t <= 0) return null;

  return (
    <AbsoluteFill
      style={{
        opacity: t,
        mixBlendMode: 'screen',
        background: `radial-gradient(circle at ${IRIS_X}px ${IRIS_Y}px, rgba(255,244,222,0.95) 0%, rgba(255,221,160,0.55) 22%, rgba(246,163,49,0.25) 45%, transparent 70%)`,
        transform: `scale(${burstScale})`,
        transformOrigin: `${IRIS_X}px ${IRIS_Y}px`,
      }}
    />
  );
};

// Obturador científico fechando sobre o "!" — a saída dinâmica que substitui o zoom.
const Iris: React.FC<{ frame: number }> = ({ frame }) => {
  const radius = interpolate(frame, [EXIT_START + 4, DURATION], [IRIS_MAX_RADIUS, 0], {
    ...clampCfg,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle ${Math.max(radius, 0.5)}px at ${IRIS_X}px ${IRIS_Y}px, transparent 0, transparent 99%, #000 100%)`,
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

  // Câmera: dolly-in orgânico (ease in-out senoidal), sem mergulho — a saída não usa zoom.
  const dolly = interpolate(frame, [0, 90], [1, 1.16], {
    ...clampCfg,
    easing: Easing.inOut(Easing.sin),
  });
  const cameraScale = dolly;

  // Respiração contínua do bloco tipográfico + pulso de impacto no instante do corte.
  const breathe = Math.sin(frame * 0.03) * 2;
  const impactT = interpolate(
    frame,
    [EXIT_START, EXIT_START + 8, EXIT_START + 16],
    [0, 1, 0],
    { ...clampCfg, easing: Easing.out(Easing.cubic) }
  );
  const impactScale = 1 + impactT * 0.05;

  // Subtítulo — entrada leve e fluida, saída em blur/fade
  const subtitleSpring = spring({
    frame: frame - SUBTITLE_DELAY,
    fps,
    config: { mass: 0.7, damping: 16, stiffness: 110 },
  });
  const subtitleTranslateY = interpolate(subtitleSpring, [0, 1], [30, 0]);
  const subtitleScale = interpolate(subtitleSpring, [0, 1], [0.96, 1]);
  const subtitleBlurIn = interpolate(subtitleSpring, [0, 1], [8, 0], { extrapolateRight: 'clamp' });
  const subtitleOpacityIn = interpolate(subtitleSpring, [0, 1], [0, 1], { extrapolateRight: 'clamp' });

  const subtitleExitProgress = interpolate(frame, [90, 116], [0, 1], {
    ...clampCfg,
    easing: Easing.in(Easing.cubic),
  });
  const subtitleBlurOut = interpolate(subtitleExitProgress, [0, 1], [0, 20]);
  const subtitleOpacityOut = interpolate(subtitleExitProgress, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG_EDGE, fontFamily }}>
      <FontFace />
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
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div
            style={{
              transform: `translateY(${breathe}px) scale(${impactScale})`,
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
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

      <Flash frame={frame} />
      <Iris frame={frame} />
    </AbsoluteFill>
  );
};
