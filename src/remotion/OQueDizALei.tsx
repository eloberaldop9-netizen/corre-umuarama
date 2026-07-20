import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS} from './colors';
import {Noise} from './Noise';
import {CameraStage} from './Camera';
import {useMontserratFont, FONT_FAMILY} from './fonts';

const Dust: React.FC<{frame: number}> = ({frame}) => {
  const particles = useMemo(
    () =>
      new Array(18).fill(0).map((_, i) => {
        const seed = i * 53.7;
        return {
          x: (Math.sin(seed) * 0.5 + 0.5) * 1080,
          startY: (Math.cos(seed * 1.7) * 0.5 + 0.5) * 1920,
          size: 2 + (i % 3),
          speed: 0.25 + (i % 4) * 0.06,
        };
      }),
    [],
  );

  return (
    <>
      {particles.map((p, i) => {
        const y = ((p.startY - frame * p.speed) % 1920 + 1920) % 1920;
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
              background: COLORS.accent,
              opacity: 0.25,
              filter: 'blur(0.5px)',
            }}
          />
        );
      })}
    </>
  );
};

export const OQueDizALei: React.FC = () => {
  useMontserratFont();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camZDolly = interpolate(frame, [0, 65], [-900, -100], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZExit = interpolate(frame, [65, 90], [-100, 400], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const camZ = frame < 65 ? camZDolly : camZExit;
  const camDelta = camZ + 900;

  const bgOpacity = interpolate(frame, [0, 30], [0, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgBlur = interpolate(frame, [0, 30], [20, 8], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const masAfinalSpring = spring({
    frame: frame - 5,
    fps,
    config: {damping: 14, mass: 0.8},
  });
  const masAfinalZ = interpolate(masAfinalSpring, [0, 1], [200, 0]);
  const masAfinalBlur = interpolate(frame, [5, 22], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const masAfinalOpacityIn = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const oQueDizSpring = spring({
    frame: frame - 9,
    fps,
    config: {damping: 13, mass: 1.0},
  });
  const oQueDizZ = interpolate(oQueDizSpring, [0, 1], [400, 0]);
  const oQueDizBlur = interpolate(frame, [9, 28], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const oQueDizOpacityIn = interpolate(frame, [9, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const aLeiSpring = spring({
    frame: frame - 14,
    fps,
    config: {damping: 13, mass: 1.0},
  });
  const aLeiZ = interpolate(aLeiSpring, [0, 1], [400, 0]);
  const aLeiBlur = interpolate(frame, [14, 33], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const aLeiOpacityIn = interpolate(frame, [14, 29], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const qMarkSpring = spring({
    frame: frame - 20,
    fps,
    config: {damping: 10, mass: 1.2},
  });
  const qMarkScaleIn = qMarkSpring;
  const qMarkColorProgress = interpolate(frame, [20, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const qMarkColor = interpolateColors(
    qMarkColorProgress,
    [0, 1],
    [COLORS.textPrimary, COLORS.accent],
  );
  const qMarkGlowIn = interpolate(frame, [20, 34], [0, 40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const qMarkOpacityIn = interpolate(frame, [20, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const holdWindow = interpolate(frame, [60, 65], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glowPulse = (Math.sin(frame * 0.05) * 0.5 + 0.5) * holdWindow;
  const qMarkGlow = qMarkGlowIn + glowPulse * 10;
  const aLeiBrightness = 1 + glowPulse * 0.12;

  const masAfinalExit = interpolate(frame, [68, 90], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const oQueDizExit = interpolate(frame, [71, 90], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const aLeiExit = interpolate(frame, [74, 90], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const qMarkExit = interpolate(frame, [76, 90], [0, 1], {
    easing: Easing.in(Easing.exp),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const flashOverlay = interpolate(frame, [80, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bgBase, overflow: 'hidden'}}>
      <Img
        src={staticFile('images/predio-textura.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          transform: 'scale(1.4)',
          mixBlendMode: 'screen',
          opacity: bgOpacity,
          filter: `blur(${bgBlur}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.2), rgba(0,0,0,0.95) 80%)',
        }}
      />
      <Noise opacity={0.04} />
      <Dust frame={frame} />

      <CameraStage
        translateY={-50}
        rotateX={(2 * Math.PI) / 180}
        translateZ={camDelta}
        perspective={4200}
      >
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT_FAMILY,
          }}
        >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <div
            style={{
              transform: `translateZ(20px) translateZ(${masAfinalZ}px) translateX(${
                -masAfinalExit * 50
              }px)`,
              filter: `blur(${masAfinalBlur + masAfinalExit * 20}px)`,
              opacity: masAfinalOpacityIn * (1 - masAfinalExit),
              fontSize: 45,
              fontWeight: 400,
              color: COLORS.textSecondary,
              letterSpacing: 2,
            }}
          >
            Mas afinal,
          </div>

          <div
            style={{
              transform: `translateZ(80px) translateZ(${oQueDizZ}px) translateX(${
                -oQueDizExit * 100
              }px)`,
              filter: `blur(${oQueDizBlur + oQueDizExit * 20}px)`,
              opacity: oQueDizOpacityIn * (1 - oQueDizExit),
              fontSize: 110,
              fontWeight: 800,
              color: COLORS.textPrimary,
              letterSpacing: -2,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              lineHeight: 1.05,
            }}
          >
            O QUE DIZ
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                transform: `translateZ(80px) translateZ(${aLeiZ}px) translateX(${
                  -aLeiExit * 100
                }px)`,
                filter: `blur(${aLeiBlur + aLeiExit * 20}px) brightness(${aLeiBrightness})`,
                opacity: aLeiOpacityIn * (1 - aLeiExit),
                fontSize: 110,
                fontWeight: 800,
                color: COLORS.textPrimary,
                letterSpacing: -2,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                lineHeight: 1.05,
              }}
            >
              A LEI
            </div>

            <div
              style={{
                transform: `translateZ(120px) translateY(-30px) translateX(10px) scale(${
                  qMarkScaleIn * (1 + qMarkExit * 19)
                })`,
                filter: `blur(${qMarkExit * 30}px)`,
                opacity: qMarkOpacityIn,
                fontSize: 140,
                fontWeight: 900,
                color: qMarkColor,
                textShadow: `0 0 ${qMarkGlow}px rgba(211,84,0,0.6)`,
              }}
            >
              ?
            </div>
          </div>
        </div>
        </AbsoluteFill>
      </CameraStage>

      <AbsoluteFill
        style={{backgroundColor: COLORS.accentDeep, opacity: flashOverlay}}
      />
    </AbsoluteFill>
  );
};
