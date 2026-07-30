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

const BG_VOID = '#080809';
const SURFACE = '#151517';
const ACCENT = '#D35400';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = '#D8D8DA';

const FRACTURE_PATHS = [
  'M300 640 L430 780 L360 900 L470 1040 L400 1180 L480 1320 L430 1440',
  'M430 780 L580 820',
  'M470 1040 L630 1090',
  'M400 1180 L260 1230',
];
const REBAR_TICKS = [
  'M410 900 L470 880',
  'M440 1180 L500 1160',
  'M410 1320 L470 1300',
];

const Dust: React.FC<{frame: number; clipPath: string}> = ({
  frame,
  clipPath,
}) => {
  const particles = useMemo(
    () =>
      new Array(18).fill(0).map((_, i) => {
        const seed = i * 53.1;
        return {
          x: (Math.sin(seed) * 0.5 + 0.5) * 1080,
          startY: (Math.cos(seed * 1.7) * 0.5 + 0.5) * 1920,
          size: 1.5 + (i % 3),
        };
      }),
    [],
  );
  return (
    <AbsoluteFill style={{clipPath}}>
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
              background: ACCENT,
              opacity: 0.4,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Card: React.FC<{
  label: string;
  start: number;
  frame: number;
  fps: number;
  exitStart: number;
}> = ({label, start, frame, fps, exitStart}) => {
  const s = spring({frame: frame - start, fps, config: {damping: 23, mass: 1.8}});
  const y = interpolate(s, [0, 1], [400, 0]);
  const rotX = interpolate(s, [0, 1], [45, 0]);
  const opacityIn = interpolate(frame, [start, start + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitProgress = interpolate(frame, [exitStart, exitStart + 20], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitY = exitProgress * -600;
  const exitRotX = exitProgress * -20;
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.8]);

  return (
    <div
      style={{
        width: 440,
        height: 120,
        borderRadius: 10,
        backgroundColor: '#1A1A1C',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 40px 60px rgba(0,0,0,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateZ(220px) translateY(${y + exitY}px) rotateX(${
          rotX + exitRotX
        }deg) scale(${exitScale})`,
        opacity: opacityIn,
      }}
    >
      <span
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: ACCENT,
          textTransform: 'uppercase',
          fontFamily: FONT_FAMILY,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const ORaioXDoDefeito: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camX = interpolate(frame, [0, 80], [100, -50], {
    easing: Easing.out(Easing.sin),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camRotYDeg = 2;
  const camRotY = (camRotYDeg * Math.PI) / 180;
  const camZ = interpolate(frame, [85, 110], [-300, -700], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camDelta = camZ + 300;

  const wallOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wallBlurIn = interpolate(frame, [0, 15], [20, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wallExit = interpolate(frame, [115, 125], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const beamX = interpolate(frame, [25, 85], [1340, -260], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const concreteClip = `inset(0 ${Math.max(0, 1080 - beamX)}px 0 0)`;

  const fractureGlowPulse =
    frame > 85 ? 1 + (Math.sin(frame * 0.15) * 0.5 + 0.5) * 0.5 : 1;

  const headlineSpring = spring({
    frame: frame - 8,
    fps,
    config: {damping: 14, mass: 0.8},
  });
  const headlineY = interpolate(headlineSpring, [0, 1], [30, 0]);
  const headlineBlur = interpolate(frame, [8, 23], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headlineOpacityIn = interpolate(frame, [8, 21], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ocultoSpring = spring({
    frame: frame - 12,
    fps,
    config: {damping: 21, mass: 1.5},
  });
  const ocultoScale = interpolate(ocultoSpring, [0, 1], [0.9, 1]);
  const ocultoBlur = interpolate(frame, [12, 27], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ocultoOpacityIn = interpolate(frame, [12, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const posteriorY = interpolate(frame, [45, 60], [20, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const posteriorOpacityIn = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textExit = (start: number) =>
    interpolate(frame, [start, start + 16], [0, 1], {
      easing: Easing.in(Easing.exp),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  const headlineExit = textExit(108);
  const ocultoExit = textExit(110);
  const posteriorExit = textExit(112);

  const exitBeamProgress = interpolate(frame, [105, 120], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitBeamX = interpolate(exitBeamProgress, [0, 1], [-800, 1200]);
  const exitBeamScaleX = interpolate(exitBeamProgress, [0, 1], [1, 200]);
  const exitBeamOpacity =
    frame < 105
      ? 0
      : frame < 120
        ? 1
        : interpolate(frame, [120, 130], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

  return (
    <AbsoluteFill style={{backgroundColor: BG_VOID, overflow: 'hidden'}}>
      <CameraStage
        translateX={camX}
        translateZ={camDelta}
        rotateY={camRotY}
        perspective={2600}
      >
        <AbsoluteFill
          style={{
            transform: 'translateZ(-350px)',
            opacity: wallOpacity * wallExit,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1080 1920"
            style={{filter: `brightness(${fractureGlowPulse})`}}
          >
            {FRACTURE_PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={ACCENT}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{filter: 'drop-shadow(0 0 30px rgba(211,84,0,0.8))'}}
              />
            ))}
            {REBAR_TICKS.map((d, i) => (
              <path
                key={`tick-${i}`}
                d={d}
                fill="none"
                stroke={ACCENT}
                strokeWidth={4}
                strokeLinecap="round"
                style={{filter: 'drop-shadow(0 0 20px rgba(211,84,0,0.7))'}}
              />
            ))}
          </svg>
        </AbsoluteFill>

        <Dust frame={frame} clipPath={concreteClip} />

        <AbsoluteFill
          style={{
            transform: 'translateZ(-300px)',
            backgroundColor: SURFACE,
            clipPath: concreteClip,
            opacity: wallOpacity * wallExit,
            filter: `blur(${wallBlurIn}px)`,
          }}
        >
          <Noise opacity={0.05} />
        </AbsoluteFill>

        <div
          style={{
            position: 'absolute',
            left: beamX - 90,
            top: 0,
            width: 90,
            height: '100%',
            transform: 'translateZ(-290px)',
            background:
              'linear-gradient(to right, transparent, rgba(211,84,0,0.16) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: beamX,
            top: 0,
            width: 60,
            height: '100%',
            transform: 'translateZ(-290px)',
            background:
              'linear-gradient(to right, rgba(211,84,0,0.22), transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: beamX,
            top: 0,
            width: 2,
            height: '100%',
            transform: 'translateZ(-290px)',
            backgroundColor: ACCENT,
            opacity: 0.75,
            boxShadow: '0 0 16px rgba(211,84,0,0.5)',
          }}
        />

        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_FAMILY,
            background:
              'radial-gradient(ellipse 620px 720px at 50% 50%, rgba(4,4,5,0.6), rgba(4,4,5,0) 72%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <div
              style={{
                transform: `translateZ(140px) translateY(${headlineY}px) translateX(${
                  headlineExit * 300
                }px)`,
                filter: `blur(${headlineBlur + headlineExit * 20}px)`,
                opacity: headlineOpacityIn * (1 - headlineExit),
                fontSize: 40,
                fontWeight: 600,
                letterSpacing: 0.3,
                color: TEXT_SECONDARY,
                textShadow: '0 1px 3px rgba(0,0,0,1), 0 4px 18px rgba(0,0,0,0.9)',
              }}
            >
              Quando o defeito &eacute;
            </div>

            <div
              style={{
                transform: `translateZ(140px) scale(${ocultoScale}) translateX(${
                  ocultoExit * 300
                }px)`,
                filter: `blur(${ocultoBlur + ocultoExit * 20}px)`,
                opacity: ocultoOpacityIn * (1 - ocultoExit),
                fontSize: 110,
                fontWeight: 900,
                color: TEXT_PRIMARY,
                textTransform: 'uppercase',
                letterSpacing: -1,
                textShadow: '0 4px 24px rgba(0,0,0,0.85)',
              }}
            >
              Oculto,
            </div>

            <div
              style={{
                transform: `translateZ(140px) translateY(${posteriorY}px) translateX(${
                  posteriorExit * 300
                }px)`,
                opacity: posteriorOpacityIn * (1 - posteriorExit),
                filter: `blur(${posteriorExit * 20}px)`,
                fontSize: 34,
                fontWeight: 500,
                letterSpacing: 0.3,
                color: TEXT_SECONDARY,
                textAlign: 'center',
                textShadow: '0 1px 3px rgba(0,0,0,1), 0 4px 18px rgba(0,0,0,0.9)',
              }}
            >
              e s&oacute; aparece posteriormente,
            </div>

            <div style={{height: 30}} />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <Card label="Reparo" start={80} frame={frame} fps={fps} exitStart={110} />
              <Card label="Indeniza&ccedil;&atilde;o" start={86} frame={frame} fps={fps} exitStart={113} />
            </div>
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: 'absolute',
            left: exitBeamX,
            top: 0,
            width: 8,
            height: '100%',
            transform: `translateZ(500px) scaleX(${exitBeamScaleX})`,
            transformOrigin: 'center',
            backgroundColor: ACCENT,
            opacity: exitBeamOpacity,
            boxShadow: '0 0 60px rgba(211,84,0,1)',
          }}
        />
      </CameraStage>
    </AbsoluteFill>
  );
};
