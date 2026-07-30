import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Noise} from './Noise';
import {CameraStage} from './Camera';
import {useMontserratFont, FONT_FAMILY} from './fonts';

const BG_BASE = '#080809';
const ACCENT = '#D35400';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = '#8B8B8D';
const BUILDING_STROKE = '#4A4A4D';

const BUILDING_LINES = [
  'M100 900 L100 200 L160 200 L160 120 L240 120 L240 200 L300 200 L300 900',
  'M100 320 L300 320',
  'M100 420 L300 420',
  'M100 520 L300 520',
  'M100 620 L300 620',
  'M100 720 L300 720',
  'M100 820 L300 820',
];

const CRACK_PATH =
  'M198 860 L236 782 L188 726 L228 654 L176 588 L218 516 L188 456 L212 400';

const Dust: React.FC<{frame: number}> = ({frame}) => {
  const particles = useMemo(
    () =>
      new Array(16).fill(0).map((_, i) => {
        const seed = i * 61.3;
        return {
          x: (Math.sin(seed) * 0.5 + 0.5) * 1080,
          startY: (Math.cos(seed * 1.7) * 0.5 + 0.5) * 1920,
          size: 2 + (i % 3),
        };
      }),
    [],
  );
  return (
    <>
      {particles.map((p, i) => {
        const y = ((p.startY - frame * 0.5) % 1920 + 1920) % 1920;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: TEXT_SECONDARY,
              opacity: 0.3,
            }}
          />
        );
      })}
    </>
  );
};

export const AFraturaPatrimonio: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camZMain = interpolate(frame, [0, 95], [-800, -300], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZExit = interpolate(frame, [95, 120], [-300, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZ = frame < 95 ? camZMain : camZExit;
  const camDelta = camZ + 800;

  const shakeEnvelope = interpolate(frame, [65, 67, 73, 75], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(frame * 2.3) * 10 * shakeEnvelope;
  const shakeY = Math.cos(frame * 3.1) * 10 * shakeEnvelope;

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const buildingDraw = interpolate(frame, [0, 40], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const buildingOpacityIn = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const buildingShiftX = interpolate(
    frame,
    [64, 66, 69, 72],
    [0, -5, 2, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const crackDraw = interpolate(frame, [65, 75], [0, 1], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glowFlash = interpolate(frame, [64, 66, 76], [15, 80, 15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const buildingExit = interpolate(frame, [95, 120], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const buildingExitX = buildingExit * -1500;
  const buildingExitSkew = buildingExit * -15;
  const buildingExitBlur = buildingExit * 25;

  const textExit = interpolate(frame, [98, 120], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textExitX = textExit * -1500;
  const textExitSkew = textExit * -15;
  const textExitBlur = textExit * 25;

  const line = (
    text: string,
    start: number,
    opts: {
      fontSize: number;
      fontWeight: number;
      color: string;
      letterSpacing: number;
      uppercase?: boolean;
      z: number;
      damping?: number;
      mass?: number;
      axis?: 'x' | 'y';
      textShadow?: string;
    },
  ) => {
    const {
      fontSize,
      fontWeight,
      color,
      letterSpacing,
      uppercase,
      damping = 14,
      mass = 0.8,
      axis = 'y',
    } = opts;
    const s = spring({frame: frame - start, fps, config: {damping, mass}});
    const offset = interpolate(s, [0, 1], [axis === 'y' ? 30 : -50, 0]);
    const blurIn = interpolate(frame, [start, start + 15], [10, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const opacityIn = interpolate(frame, [start, start + 13], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const translate = axis === 'y' ? `translateY(${offset}px)` : `translateX(${offset}px)`;
    return (
      <div
        style={{
          transform: `translateZ(${opts.z}px) ${translate}`,
          filter: `blur(${blurIn}px)`,
          opacity: opacityIn,
          fontSize,
          fontWeight,
          color,
          letterSpacing,
          textTransform: uppercase ? 'uppercase' : 'none',
          textShadow: opts.textShadow,
        }}
      >
        {text}
      </div>
    );
  };

  const anosSpring = spring({
    frame: frame - 28,
    fps,
    config: {damping: 20, mass: 1.5},
  });
  const anosScale = interpolate(anosSpring, [0, 1], [0.8, 1]);
  const anosBlurIn = interpolate(frame, [28, 46], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const anosOpacityIn = interpolate(frame, [28, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG_BASE, overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: bgOpacity}}>
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 80% 60%, rgba(211,84,0,0.08), transparent 70%)',
          }}
        />
        <Noise opacity={0.05} />
        <Dust frame={frame} />
      </AbsoluteFill>

      <CameraStage
        translateX={shakeX}
        translateY={shakeY}
        translateZ={camDelta}
        perspective={5000}
      >
        <AbsoluteFill>
          <svg
            width={400}
            height={900}
            viewBox="0 0 400 900"
            style={{
              position: 'absolute',
              right: 40,
              top: '50%',
              transform: `translateY(-50%) translateX(${
                buildingShiftX + buildingExitX
              }px) skewX(${buildingExitSkew}deg)`,
              filter: `blur(${buildingExitBlur}px)`,
              opacity: buildingOpacityIn,
            }}
          >
            {BUILDING_LINES.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={BUILDING_STROKE}
                strokeWidth={2}
                strokeDasharray={1400}
                strokeDashoffset={1400 * (1 - buildingDraw)}
              />
            ))}
            <path
              d={CRACK_PATH}
              fill="none"
              stroke={ACCENT}
              strokeWidth={4}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={600}
              strokeDashoffset={600 * (1 - crackDraw)}
              style={{filter: 'drop-shadow(0 0 30px rgba(211,84,0,0.6))'}}
            />
          </svg>

          <div
            style={{
              position: 'absolute',
              left: 90,
              top: '50%',
              transform: `translateY(-50%) translateX(${textExitX}px) skewX(${textExitSkew}deg)`,
              filter: `blur(${textExitBlur}px)`,
              maxWidth: 810,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 6,
              fontFamily: FONT_FAMILY,
            }}
          >
            {line('Você sabia que uma construtora', 5, {
              fontSize: 38,
              fontWeight: 400,
              color: TEXT_SECONDARY,
              letterSpacing: 0,
              z: 40,
            })}
            {line('AINDA PODE SER', 15, {
              fontSize: 65,
              fontWeight: 800,
              color: TEXT_PRIMARY,
              letterSpacing: -1,
              uppercase: true,
              z: 60,
              damping: 18,
              mass: 1.2,
              axis: 'x',
            })}
            {line('RESPONSABILIZADA', 19, {
              fontSize: 74,
              fontWeight: 900,
              color: TEXT_PRIMARY,
              letterSpacing: -2,
              uppercase: true,
              z: 80,
              damping: 18,
              mass: 1.2,
              axis: 'x',
            })}
            {line('por problemas no imóvel,', 10, {
              fontSize: 38,
              fontWeight: 400,
              color: TEXT_SECONDARY,
              letterSpacing: 0,
              z: 40,
            })}
            {line('MESMO DEPOIS DE', 23, {
              fontSize: 50,
              fontWeight: 800,
              color: ACCENT,
              letterSpacing: -1,
              uppercase: true,
              z: 100,
              damping: 18,
              mass: 1.2,
              axis: 'x',
            })}
            <div
              style={{
                transform: `translateZ(120px) scale(${anosScale})`,
                filter: `blur(${anosBlurIn}px)`,
                opacity: anosOpacityIn,
                fontSize: 110,
                fontWeight: 900,
                color: ACCENT,
                letterSpacing: -3,
                textTransform: 'uppercase',
                textShadow: `0 0 ${glowFlash}px rgba(211,84,0,0.6)`,
              }}
            >
              5 anos?
            </div>
          </div>
        </AbsoluteFill>
      </CameraStage>
    </AbsoluteFill>
  );
};
