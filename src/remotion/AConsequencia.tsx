import React from 'react';
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

const BG_BASE = '#050506';
const ACCENT = '#D35400';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = '#8B8B8D';

export const AConsequencia: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camYMain = interpolate(frame, [0, 65], [300, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camYExit = interpolate(frame, [65, 90], [0, -200], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camY = frame < 65 ? camYMain : camYExit;
  const camRotXDeg = interpolate(frame, [0, 90], [-15, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camRotX = (camRotXDeg * Math.PI) / 180;

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const noiseFlicker = 0.06 + Math.sin(frame * 0.11) * 0.01;

  const podemSpring = spring({
    frame: frame - 4,
    fps,
    config: {damping: 15, mass: 1.5},
  });
  const podemY = interpolate(podemSpring, [0, 1], [-400, 0]);
  const podemBlurIn = interpolate(frame, [4, 26], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const podemOpacityIn = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const advertSpring = spring({
    frame: frame - 10,
    fps,
    config: {damping: 12, mass: 2.5},
  });
  const advertY = interpolate(advertSpring, [0, 1], [-600, 0]);
  const advertBlurIn = interpolate(frame, [10, 38], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const advertOpacityIn = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shockProgress = interpolate(frame, [13, 30], [0, 1], {
    easing: Easing.out(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockScale = interpolate(shockProgress, [0, 1], [0, 3]);
  const shockOpacity = interpolate(shockProgress, [0, 1], [0.5, 0]);

  const medidasSpring = spring({
    frame: frame - 18,
    fps,
    config: {damping: 14, mass: 1.2},
  });
  const medidasY = interpolate(medidasSpring, [0, 1], [-400, 0]);
  const medidasBlurIn = interpolate(frame, [18, 38], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const medidasOpacityIn = interpolate(frame, [18, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const holdWindow = interpolate(frame, [60, 65], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const advertBreathY = Math.sin(frame * 0.03) * 3 * holdWindow;
  const glowPulse = (Math.sin(frame * 0.05) * 0.5 + 0.5) * holdWindow;
  const advertGlow = 15 + glowPulse * 30;

  const medidasExit = interpolate(frame, [65, 90], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const medidasExitY = medidasExit * 800;
  const medidasExitBlur = medidasExit * 25;
  const medidasExitOpacity = interpolate(medidasExit, [0, 1], [1, 0]);
  const medidasExitScale = interpolate(medidasExit, [0, 1], [1, 0.94]);

  const advertExit = interpolate(frame, [68, 90], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const advertExitY = advertExit * 1000;
  const advertExitBlur = advertExit * 30;
  const advertExitOpacity = interpolate(advertExit, [0, 1], [1, 0]);
  const advertExitScale = interpolate(advertExit, [0, 1], [1, 0.9]);

  const podemExit = interpolate(frame, [72, 90], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const podemExitY = podemExit * 600;
  const podemExitBlur = podemExit * 20;
  const podemExitOpacity = interpolate(podemExit, [0, 1], [1, 0]);
  const podemExitScale = interpolate(podemExit, [0, 1], [1, 0.94]);

  return (
    <AbsoluteFill style={{backgroundColor: BG_BASE, overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: bgOpacity}}>
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(to top, rgba(211,84,0,0.05), transparent 50%)',
          }}
        />
        <Noise opacity={noiseFlicker} />
      </AbsoluteFill>

      <CameraStage translateY={camY} rotateX={camRotX}>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_FAMILY,
          }}
        >
          <svg
            width={700}
            height={700}
            style={{
              position: 'absolute',
              transform: `translateZ(10px) rotateX(60deg) scale(${shockScale})`,
              opacity: shockOpacity,
            }}
          >
            <ellipse
              cx={350}
              cy={350}
              rx={320}
              ry={320}
              fill="none"
              stroke={ACCENT}
              strokeWidth={2}
            />
          </svg>

          <div
            style={{
              transform: `translateZ(20px) translateY(${
                podemY + podemExitY
              }px) scale(${podemExitScale})`,
              filter: `blur(${podemBlurIn + podemExitBlur}px)`,
              opacity: podemOpacityIn * podemExitOpacity,
              fontSize: 45,
              fontWeight: 400,
              color: TEXT_SECONDARY,
              letterSpacing: 2,
            }}
          >
            podem gerar
          </div>

          <div
            style={{
              transform: `translateZ(60px) translateY(${
                advertY + advertBreathY + advertExitY
              }px) scale(${advertExitScale})`,
              filter: `blur(${advertBlurIn + advertExitBlur}px)`,
              opacity: advertOpacityIn * advertExitOpacity,
              fontSize: 115,
              fontWeight: 900,
              color: ACCENT,
              letterSpacing: -3,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textShadow: `0 30px 40px rgba(0,0,0,0.8), 0 0 ${advertGlow}px rgba(211,84,0,0.4)`,
            }}
          >
            Advert&ecirc;ncias
          </div>

          <div
            style={{
              transform: `translateZ(40px) translateY(${
                medidasY + medidasExitY
              }px) scale(${medidasExitScale})`,
              filter: `blur(${medidasBlurIn + medidasExitBlur}px)`,
              opacity: medidasOpacityIn * medidasExitOpacity,
              fontSize: 55,
              fontWeight: 600,
              color: TEXT_PRIMARY,
              letterSpacing: -1,
            }}
          >
            e outras medidas.
          </div>
        </AbsoluteFill>
      </CameraStage>
    </AbsoluteFill>
  );
};
